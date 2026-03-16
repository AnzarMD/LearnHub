"use strict";
const bcrypt = require("bcryptjs");
const prisma = require("../config/database");
const { parsePagination, buildSearch } = require("../utils/pagination");

const SAFE_SELECT = {
  id: true, email: true, firstName: true, lastName: true,
  role: true, phone: true, avatar: true, isActive: true,
  isEmailVerified: true, lastLoginAt: true, createdAt: true,
  studentProfile: true, teacherProfile: true,
  parentProfile: true, adminProfile: true,
};

// ─── Get all users (admin) ───────────────────────────────────────────────────
const getAllUsers = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const search = buildSearch(["firstName", "lastName", "email"], query.search);

  const where = {
    deletedAt: null,
    ...(query.role   && { role: query.role }),
    ...(query.active !== undefined && { isActive: query.active === "true" }),
    ...search,
  };

  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: SAFE_SELECT,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { items, total, page, limit };
};

// ─── Get single user ─────────────────────────────────────────────────────────
const getUserById = async (id) => {
  const user = await prisma.user.findFirst({
    where:  { id, deletedAt: null },
    select: SAFE_SELECT,
  });
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

// ─── Update user ─────────────────────────────────────────────────────────────
const updateUser = async (id, data) => {
  const { firstName, lastName, phone, isActive, role } = data;
  return prisma.user.update({
    where:  { id },
    data:   { firstName, lastName, phone, isActive, role },
    select: SAFE_SELECT,
  });
};

// ─── Update avatar ────────────────────────────────────────────────────────────
const updateAvatar = async (id, avatarPath) => {
  return prisma.user.update({
    where:  { id },
    data:   { avatar: avatarPath },
    select: { id: true, avatar: true },
  });
};

// ─── Soft delete user ─────────────────────────────────────────────────────────
const deleteUser = async (id) => {
  await prisma.user.update({
    where: { id },
    data:  { deletedAt: new Date(), isActive: false },
  });
};

// ─── Assign student to class ─────────────────────────────────────────────────
const assignStudentToClass = async (studentUserId, classId) => {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: studentUserId },
  });
  if (!profile) {
    const err = new Error("Student profile not found");
    err.statusCode = 404;
    throw err;
  }
  return prisma.studentProfile.update({
    where: { id: profile.id },
    data:  { classId },
  });
};

// ─── Link parent to student ──────────────────────────────────────────────────
const linkParentToStudent = async (parentUserId, studentUserId) => {
  const parentProfile  = await prisma.parentProfile.findUnique({ where: { userId: parentUserId } });
  const studentProfile = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });

  if (!parentProfile || !studentProfile) {
    const err = new Error("Parent or student profile not found");
    err.statusCode = 404;
    throw err;
  }

  return prisma.parentStudentLink.upsert({
    where: {
      parentProfileId_studentProfileId: {
        parentProfileId:  parentProfile.id,
        studentProfileId: studentProfile.id,
      },
    },
    update: {},
    create: {
      parentProfileId:  parentProfile.id,
      studentProfileId: studentProfile.id,
    },
  });
};

// ─── Get current user profile ────────────────────────────────────────────────
const getMyProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: {
      ...SAFE_SELECT,
      studentProfile: {
        include: { class: { include: { academicYear: true } } },
      },
      teacherProfile: {
        include: { subjects: { include: { subject: true } } },
      },
      parentProfile: {
        include: {
          children: {
            include: {
              studentProfile: {
                include: { user: { select: { firstName: true, lastName: true, email: true } } },
              },
            },
          },
        },
      },
    },
  });
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

module.exports = { getAllUsers, getUserById, updateUser, updateAvatar, deleteUser, assignStudentToClass, linkParentToStudent, getMyProfile };
