"use strict";
const prisma = require("../config/database");
const { calcAttendancePct } = require("../utils/grade");
const { sendLowAttendanceAlert } = require("../utils/email");
const { parsePagination } = require("../utils/pagination");

// ─── Mark attendance for a session ────────────────────────────────────────────
const markAttendance = async (classSessionId, records, markedBy) => {
  // records = [{ studentProfileId, status, remarks }]
  const session = await prisma.classSession.findUnique({
    where: { id: classSessionId },
    include: { timetableSlot: true },
  });
  if (!session) {
    const err = new Error("Class session not found");
    err.statusCode = 404;
    throw err;
  }

  const upserts = records.map((r) =>
    prisma.attendance.upsert({
      where: {
        studentProfileId_classSessionId: {
          studentProfileId: r.studentProfileId,
          classSessionId,
        },
      },
      update: { status: r.status, remarks: r.remarks, markedBy },
      create: {
        studentProfileId: r.studentProfileId,
        classSessionId,
        classId:  session.timetableSlot.classId,
        date:     session.scheduledAt,
        status:   r.status,
        markedBy,
        remarks:  r.remarks || null,
      },
    })
  );

  const results = await prisma.$transaction(upserts);

  // Check for low attendance and alert parents (non-blocking)
  checkLowAttendance(records.map((r) => r.studentProfileId)).catch(() => {});

  return results;
};

// ─── Auto-mark attendance via socket join ────────────────────────────────────
const autoMarkPresent = async (studentProfileId, classSessionId) => {
  const session = await prisma.classSession.findUnique({
    where: { id: classSessionId },
    include: { timetableSlot: true },
  });
  if (!session) return;

  await prisma.attendance.upsert({
    where: {
      studentProfileId_classSessionId: { studentProfileId, classSessionId },
    },
    update: { status: "PRESENT", joinedAt: new Date() },
    create: {
      studentProfileId,
      classSessionId,
      classId: session.timetableSlot.classId,
      date:    session.scheduledAt,
      status:  "PRESENT",
      joinedAt: new Date(),
    },
  });
};

// ─── Record student leaving ───────────────────────────────────────────────────
const markStudentLeft = async (studentProfileId, classSessionId) => {
  const record = await prisma.attendance.findUnique({
    where: {
      studentProfileId_classSessionId: { studentProfileId, classSessionId },
    },
  });
  if (!record || !record.joinedAt) return;

  const durationMinutes = Math.round(
    (Date.now() - new Date(record.joinedAt).getTime()) / 60000
  );

  await prisma.attendance.update({
    where: { id: record.id },
    data:  { leftAt: new Date(), durationMinutes },
  });
};

// ─── Get attendance summary for a student ────────────────────────────────────
const getStudentAttendanceSummary = async (studentProfileId, months = 6) => {
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const records = await prisma.attendance.findMany({
    where: {
      studentProfileId,
      date: { gte: since },
    },
    include: { classSession: { include: { timetableSlot: { include: { subject: true } } } } },
    orderBy: { date: "asc" },
  });

  const totalClasses = records.length;
  const present      = records.filter((r) => r.status === "PRESENT").length;
  const absent       = records.filter((r) => r.status === "ABSENT").length;
  const late         = records.filter((r) => r.status === "LATE").length;
  const percentage   = calcAttendancePct(present, totalClasses);

  // Monthly breakdown
  const monthly = {};
  records.forEach((r) => {
    const month = new Date(r.date).toLocaleString("default", { month: "short", year: "numeric" });
    if (!monthly[month]) monthly[month] = { present: 0, absent: 0, late: 0 };
    if (r.status === "PRESENT") monthly[month].present++;
    else if (r.status === "ABSENT") monthly[month].absent++;
    else if (r.status === "LATE") monthly[month].late++;
  });

  return { totalClasses, present, absent, late, percentage, monthly: Object.entries(monthly).map(([month, v]) => ({ month, ...v })) };
};

// ─── Get class attendance for a session ──────────────────────────────────────
const getSessionAttendance = async (classSessionId) => {
  return prisma.attendance.findMany({
    where: { classSessionId },
    include: {
      studentProfile: {
        include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
      },
    },
  });
};

// ─── Low attendance alert ─────────────────────────────────────────────────────
const checkLowAttendance = async (studentProfileIds) => {
  for (const spId of studentProfileIds) {
    const summary = await getStudentAttendanceSummary(spId, 1);
    if (summary.percentage < 75 && summary.totalClasses >= 5) {
      const student = await prisma.studentProfile.findUnique({
        where: { id: spId },
        include: {
          user: { select: { firstName: true, lastName: true } },
          parentLinks: {
            include: { parentProfile: { include: { user: { select: { email: true } } } } },
          },
        },
      });
      if (student) {
        const name = student.user.firstName + " " + student.user.lastName;
        student.parentLinks.forEach(({ parentProfile }) => {
          sendLowAttendanceAlert(parentProfile.user.email, name, summary.percentage).catch(() => {});
        });
      }
    }
  }
};

module.exports = { markAttendance, autoMarkPresent, markStudentLeft, getStudentAttendanceSummary, getSessionAttendance };
