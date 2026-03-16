"use strict";
const asyncHandler = require("../utils/asyncHandler");
const { success, created, error } = require("../utils/response");
const authService  = require("../services/auth.service");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password, role]
 *             properties:
 *               firstName: { type: string }
 *               lastName:  { type: string }
 *               email:     { type: string, format: email }
 *               password:  { type: string, minLength: 8 }
 *               role:      { type: string, enum: [ADMIN,TEACHER,STUDENT,PARENT] }
 *               phone:     { type: string }
 *     responses:
 *       201: { description: User registered }
 *       409: { description: Email already in use }
 */
const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  created(res, { user }, "Registration successful. Please verify your email.");
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and receive tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password }, req.ip);

  // Set refresh token in httpOnly cookie
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge:   7 * 24 * 60 * 60 * 1000,
  });

  success(res, { user: result.user, accessToken: result.accessToken }, "Login successful");
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token using refresh token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!token) return error(res, "Refresh token required", 401);

  const result = await authService.refreshAccessToken(token);
  success(res, result, "Token refreshed");
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout and revoke refresh token
 *     security: [{ bearerAuth: [] }]
 */
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  await authService.logout(req.user.id, token);
  res.clearCookie("refreshToken");
  success(res, {}, "Logged out successfully");
});

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     tags: [Auth]
 *     summary: Verify email address
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema: { type: string }
 */
const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  success(res, {}, "Email verified successfully");
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Send password reset email
 */
const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  success(res, {}, "If that email exists, a reset link has been sent.");
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password with token
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  success(res, {}, "Password reset successfully");
});

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     tags: [Auth]
 *     summary: Change password (authenticated)
 *     security: [{ bearerAuth: [] }]
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user.id, currentPassword, newPassword);
  success(res, {}, "Password changed successfully");
});

module.exports = { register, login, refreshToken, logout, verifyEmail, forgotPassword, resetPassword, changePassword };
