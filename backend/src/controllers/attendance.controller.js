"use strict";
const asyncHandler      = require("../utils/asyncHandler");
const { success, paginated } = require("../utils/response");
const attendanceService = require("../services/attendance.service");
const prisma            = require("../config/database");

const markAttendance = asyncHandler(async (req, res) => {
  const { classSessionId, records } = req.body;
  const result = await attendanceService.markAttendance(classSessionId, records, req.user.id);
  success(res, { count: result.length }, "Attendance marked");
});

const getSessionAttendance = asyncHandler(async (req, res) => {
  const records = await attendanceService.getSessionAttendance(req.params.sessionId);
  success(res, { records });
});

const getMyAttendance = asyncHandler(async (req, res) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: req.user.id } });
  if (!student) return success(res, { summary: null });
  const summary = await attendanceService.getStudentAttendanceSummary(student.id, parseInt(req.query.months || "6", 10));
  success(res, { summary });
});

const getStudentAttendance = asyncHandler(async (req, res) => {
  const summary = await attendanceService.getStudentAttendanceSummary(req.params.studentProfileId, 6);
  success(res, { summary });
});

module.exports = { markAttendance, getSessionAttendance, getMyAttendance, getStudentAttendance };
