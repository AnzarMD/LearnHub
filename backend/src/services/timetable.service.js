"use strict";
const prisma = require("../config/database");

// ─── Detect time conflicts ─────────────────────────────────────────────────────
const hasTimeConflict = (start1, end1, start2, end2) => {
  const toMins = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const s1 = toMins(start1), e1 = toMins(end1);
  const s2 = toMins(start2), e2 = toMins(end2);
  return s1 < e2 && s2 < e1;
};

// ─── Create timetable slot (with conflict detection) ──────────────────────────
const createSlot = async (timetableId, data) => {
  const { classId, subjectId, teacherProfileId, dayOfWeek, startTime, endTime, roomNumber } = data;

  // Check teacher conflict
  const teacherConflicts = await prisma.timetableSlot.findMany({
    where: { timetableId, teacherProfileId, dayOfWeek, isActive: true },
  });
  for (const slot of teacherConflicts) {
    if (hasTimeConflict(startTime, endTime, slot.startTime, slot.endTime)) {
      const err = new Error(
        `Teacher has a conflicting slot on ${dayOfWeek} from ${slot.startTime} to ${slot.endTime}`
      );
      err.statusCode = 409;
      throw err;
    }
  }

  // Check class conflict
  const classConflicts = await prisma.timetableSlot.findMany({
    where: { timetableId, classId, dayOfWeek, isActive: true },
  });
  for (const slot of classConflicts) {
    if (hasTimeConflict(startTime, endTime, slot.startTime, slot.endTime)) {
      const err = new Error(
        `Class already has a slot on ${dayOfWeek} from ${slot.startTime} to ${slot.endTime}`
      );
      err.statusCode = 409;
      throw err;
    }
  }

  // Check room conflict
  if (roomNumber) {
    const roomConflicts = await prisma.timetableSlot.findMany({
      where: { timetableId, roomNumber, dayOfWeek, isActive: true },
    });
    for (const slot of roomConflicts) {
      if (hasTimeConflict(startTime, endTime, slot.startTime, slot.endTime)) {
        const err = new Error(
          `Room ${roomNumber} is already booked on ${dayOfWeek} from ${slot.startTime} to ${slot.endTime}`
        );
        err.statusCode = 409;
        throw err;
      }
    }
  }

  return prisma.timetableSlot.create({
    data: { timetableId, classId, subjectId, teacherProfileId, dayOfWeek, startTime, endTime, roomNumber },
    include: { subject: true, class: true, teacherProfile: { include: { user: { select: { firstName: true, lastName: true } } } } },
  });
};

// ─── Get timetable for class ──────────────────────────────────────────────────
const getClassTimetable = async (classId) => {
  const slots = await prisma.timetableSlot.findMany({
    where:   { classId, isActive: true },
    include: { subject: true, teacherProfile: { include: { user: { select: { firstName: true, lastName: true } } } } },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  // Group by day
  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const grouped = {};
  days.forEach((d) => { grouped[d] = []; });
  slots.forEach((s) => grouped[s.dayOfWeek].push(s));
  return grouped;
};

// ─── Get teacher's schedule ───────────────────────────────────────────────────
const getTeacherSchedule = async (teacherUserId) => {
  const teacher = await prisma.teacherProfile.findUnique({ where: { userId: teacherUserId } });
  if (!teacher) return {};

  return getClassTimetable(null).then(async () => {
    const slots = await prisma.timetableSlot.findMany({
      where:   { teacherProfileId: teacher.id, isActive: true },
      include: { subject: true, class: true },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
    const grouped = {};
    slots.forEach((s) => {
      if (!grouped[s.dayOfWeek]) grouped[s.dayOfWeek] = [];
      grouped[s.dayOfWeek].push(s);
    });
    return grouped;
  });
};

// ─── Create class session ─────────────────────────────────────────────────────
const createClassSession = async (timetableSlotId, scheduledAt) => {
  return prisma.classSession.create({
    data: { timetableSlotId, scheduledAt: new Date(scheduledAt) },
    include: { timetableSlot: { include: { subject: true, class: true } } },
  });
};

// ─── Start class session ──────────────────────────────────────────────────────
const startClassSession = async (sessionId, teacherUserId) => {
  return prisma.classSession.update({
    where: { id: sessionId },
    data:  { startedAt: new Date(), isLive: true },
  });
};

// ─── End class session ────────────────────────────────────────────────────────
const endClassSession = async (sessionId) => {
  const session = await prisma.classSession.findUnique({ where: { id: sessionId } });
  const duration = session.startedAt
    ? Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000)
    : null;

  return prisma.classSession.update({
    where: { id: sessionId },
    data:  { endedAt: new Date(), isLive: false, durationMinutes: duration },
  });
};

module.exports = { createSlot, getClassTimetable, getTeacherSchedule, createClassSession, startClassSession, endClassSession };
