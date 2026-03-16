"use strict";
const asyncHandler = require("../utils/asyncHandler");
const { success, created, paginated } = require("../utils/response");
const userService  = require("../services/user.service");

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getMyProfile(req.user.id);
  success(res, { user }, "Profile retrieved");
});

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await userService.getAllUsers(req.query);
  paginated(res, result.items, result.total, result.page, result.limit);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  success(res, { user });
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  success(res, { user }, "User updated");
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  success(res, {}, "User deleted");
});

const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    const err = new Error("Avatar file required");
    err.statusCode = 400;
    throw err;
  }
  const result = await userService.updateAvatar(req.user.id, req.file.path);
  success(res, result, "Avatar updated");
});

const assignStudentToClass = asyncHandler(async (req, res) => {
  const { studentUserId, classId } = req.body;
  const result = await userService.assignStudentToClass(studentUserId, classId);
  success(res, result, "Student assigned to class");
});

const linkParentToStudent = asyncHandler(async (req, res) => {
  const { parentUserId, studentUserId } = req.body;
  const result = await userService.linkParentToStudent(parentUserId, studentUserId);
  success(res, result, "Parent linked to student");
});

module.exports = { getMe, getAllUsers, getUserById, updateUser, deleteUser, updateAvatar, assignStudentToClass, linkParentToStudent };
