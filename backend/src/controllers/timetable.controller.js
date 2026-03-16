"use strict";
const asyncHandler      = require("../utils/asyncHandler");
const { success, created } = require("../utils/response");
const timetableService  = require("../services/timetable.service");
const prisma            = require("../config/database");

const createTimetable = asyncHandler(async (req, res) => {
  const timetable = await prisma.timetable.create({ data: { ...req.body, effectiveFrom: new Date(req.body.effectiveFrom) } });
  created(res, { timetable }, "Timetable created");
});

const createSlot = asyncHandler(async (req, res) => {
  const slot = await timetableService.createSlot(req.params.timetableId, req.body);
  created(res, { slot }, "Slot added. No conflicts detected.");
});

const getClassTimetable = asyncHandler(async (req, res) => {
  const timetable = await timetableService.getClassTimetable(req.params.classId);
  success(res, { timetable });
});

const getMySchedule = asyncHandler(async (req, res) => {
  if (req.user.role === "TEACHER") {
    const schedule = await timetableService.getTeacherSchedule(req.user.id);
    return success(res, { schedule });
  }
  const student = await prisma.studentProfile.findUnique({ where: { userId: req.user.id } });
  if (student && student.classId) {
    const timetable = await timetableService.getClassTimetable(student.classId);
    return success(res, { timetable });
  }
  success(res, { timetable: {} });
});

const createSession = asyncHandler(async (req, res) => {
  const session = await timetableService.createClassSession(req.body.timetableSlotId, req.body.scheduledAt);
  created(res, { session }, "Class session created");
});

const startSession = asyncHandler(async (req, res) => {
  const session = await timetableService.startClassSession(req.params.sessionId, req.user.id);
  success(res, { session }, "Class started");
});

const endSession = asyncHandler(async (req, res) => {
  const session = await timetableService.endClassSession(req.params.sessionId);
  success(res, { session }, "Class ended");
});

module.exports = { createTimetable, createSlot, getClassTimetable, getMySchedule, createSession, startSession, endSession };
