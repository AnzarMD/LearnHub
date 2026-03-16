"use strict";
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const prisma = require("../config/database");
const { signAccess, signRefresh, verifyRefresh } = require("../utils/jwt");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/email");
const logger = require("../config/logger");

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);

// ─── Register ──────────────────────────────────────────────────────────────────
const register = async ({ firstName, lastName, email, password, role, phone }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error("Email already in use");
    err.statusCode = 409;
    throw err;
  }

  const hashed     = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const verifyToken = crypto.randomBytes(32).toString("hex");

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashed,
      role,
      phone:            phone || null,
      emailVerifyToken: verifyToken,
      // Create role-specific profile
      ...(role === "STUDENT" && {
        studentProfile: {
          create: { rollNumber: "ROLL-" + Date.now() },
        },
      }),
      ...(role === "TEACHER" && {
        teacherProfile: {
          create: { employeeId: "EMP-" + Date.now() },
        },
      }),
      ...(role === "PARENT" && {
        parentProfile: { create: {} },
      }),
      ...(role === "ADMIN" && {
        adminProfile: { create: {} },
      }),
    },
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  });

  // Send verification email (non-blocking)
  sendVerificationEmail(email, verifyToken).catch(() => {});

  return user;
};

// ─── Login ────────────────────────────────────────────────────────────────────
const login = async ({ email, password }, ipAddress) => {
  const user = await prisma.user.findFirst({
    where: { email, deletedAt: null },
  });

  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error("Account is disabled. Contact administrator.");
    err.statusCode = 403;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const payload      = { id: user.id, role: user.role };
  const accessToken  = signAccess(payload);
  const refreshToken = signRefresh(payload);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token:     refreshToken,
      userId:    user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data:  { lastLoginAt: new Date() },
  });

  const { password: _, emailVerifyToken: __, passwordResetToken: ___, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
};

// ─── Refresh token ────────────────────────────────────────────────────────────
const refreshAccessToken = async (token) => {
  let decoded;
  try {
    decoded = verifyRefresh(token);
  } catch {
    const err = new Error("Invalid or expired refresh token");
    err.statusCode = 401;
    throw err;
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    const err = new Error("Refresh token revoked or expired");
    err.statusCode = 401;
    throw err;
  }

  const accessToken = signAccess({ id: decoded.id, role: decoded.role });
  return { accessToken };
};

// ─── Logout ───────────────────────────────────────────────────────────────────
const logout = async (userId, refreshToken) => {
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
  // Optionally invalidate all sessions
  // await prisma.refreshToken.deleteMany({ where: { userId } });
};

// ─── Verify email ─────────────────────────────────────────────────────────────
const verifyEmail = async (token) => {
  const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });
  if (!user) {
    const err = new Error("Invalid verification token");
    err.statusCode = 400;
    throw err;
  }
  await prisma.user.update({
    where: { id: user.id },
    data:  { isEmailVerified: true, emailVerifyToken: null },
  });
};

// ─── Forgot password ──────────────────────────────────────────────────────────
const forgotPassword = async (email) => {
  const user = await prisma.user.findFirst({ where: { email, deletedAt: null } });
  if (!user) return; // Silently ignore — don't reveal if email exists

  const token   = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data:  { passwordResetToken: token, passwordResetExpires: expires },
  });

  await sendPasswordResetEmail(email, token);
};

// ─── Reset password ───────────────────────────────────────────────────────────
const resetPassword = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken:   token,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    const err = new Error("Invalid or expired reset token");
    err.statusCode = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data:  {
      password:             hashed,
      passwordResetToken:   null,
      passwordResetExpires: null,
    },
  });

  // Revoke all refresh tokens after password reset
  await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
};

// ─── Change password ──────────────────────────────────────────────────────────
const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    const err = new Error("Current password is incorrect");
    err.statusCode = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  await prisma.refreshToken.deleteMany({ where: { userId } });
};

module.exports = { register, login, refreshAccessToken, logout, verifyEmail, forgotPassword, resetPassword, changePassword };
