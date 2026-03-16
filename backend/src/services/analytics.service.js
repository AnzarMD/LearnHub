"use strict";
const prisma = require("../config/database");
const { calcAttendancePct } = require("../utils/grade");

// ─── Platform overview (Admin) ────────────────────────────────────────────────
const getPlatformOverview = async () => {
  const [totalStudents, totalTeachers, totalCourses, recentLogins] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.teacherProfile.count(),
    prisma.subject.count({ where: { isActive: true } }),
    prisma.user.count({ where: { lastLoginAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
  ]);

  const attendanceRecords = await prisma.attendance.findMany({
    where: { date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
    select: { status: true },
  });
  const present   = attendanceRecords.filter((r) => r.status === "PRESENT").length;
  const avgAttendance = calcAttendancePct(present, attendanceRecords.length);

  return { totalStudents, totalTeachers, totalCourses, recentLogins, avgAttendance };
};

// ─── Attendance trends ────────────────────────────────────────────────────────
const getAttendanceTrends = async (months = 6, classId = null) => {
  const since = new Date();
  since.setMonth(since.getMonth() - months);

  const where = { date: { gte: since }, ...(classId && { classId }) };

  const records = await prisma.attendance.findMany({ where, select: { date: true, status: true } });

  const monthly = {};
  records.forEach((r) => {
    const key = new Date(r.date).toLocaleString("default", { month: "short", year: "numeric" });
    if (!monthly[key]) monthly[key] = { present: 0, absent: 0, late: 0 };
    if (r.status === "PRESENT") monthly[key].present++;
    else if (r.status === "ABSENT") monthly[key].absent++;
    else if (r.status === "LATE") monthly[key].late++;
  });

  return Object.entries(monthly).map(([month, v]) => ({
    month,
    ...v,
    percentage: calcAttendancePct(v.present, v.present + v.absent + v.late),
  }));
};

// ─── Performance trends ────────────────────────────────────────────────────────
const getPerformanceTrends = async (studentUserId) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) return [];

  const grades = await prisma.grade.findMany({
    where:   { studentProfileId: student.id },
    include: { subject: true },
    orderBy: { gradedAt: "desc" },
  });

  // Group by subject
  const bySubject = {};
  grades.forEach((g) => {
    const subj = g.subject.name;
    if (!bySubject[subj]) bySubject[subj] = { subject: subj, scores: [], avg: 0 };
    bySubject[subj].scores.push((g.marksObtained / g.totalMarks) * 100);
  });

  return Object.values(bySubject).map((s) => ({
    subject: s.subject,
    avg:     Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length),
    latest:  Math.round(s.scores[0] || 0),
  }));
};

// ─── Engagement metrics ───────────────────────────────────────────────────────
const getEngagementMetrics = async (days = 7) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [logins, submissions, testAttempts] = await Promise.all([
    prisma.activityLog.groupBy({
      by: ["createdAt"],
      where: { action: "USER_LOGIN", createdAt: { gte: since } },
      _count: true,
    }),
    prisma.submission.groupBy({
      by: ["submittedAt"],
      where: { submittedAt: { gte: since } },
      _count: true,
    }),
    prisma.testAttempt.groupBy({
      by: ["startedAt"],
      where: { startedAt: { gte: since } },
      _count: true,
    }),
  ]);

  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d   = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const day = d.toLocaleString("default", { weekday: "short" });
    result.push({
      day,
      logins:      logins.filter((l) => new Date(l.createdAt).toDateString() === d.toDateString()).reduce((a, b) => a + b._count, 0),
      submissions: submissions.filter((s) => s.submittedAt && new Date(s.submittedAt).toDateString() === d.toDateString()).reduce((a, b) => a + b._count, 0),
      testAttempts: testAttempts.filter((t) => new Date(t.startedAt).toDateString() === d.toDateString()).reduce((a, b) => a + b._count, 0),
    });
  }
  return result;
};

// ─── Subject completion rates ─────────────────────────────────────────────────
const getSubjectStats = async () => {
  const subjects = await prisma.subject.findMany({ where: { isActive: true } });
  const stats = await Promise.all(
    subjects.map(async (s) => {
      const assignments = await prisma.assignment.count({ where: { subjectId: s.id, status: "PUBLISHED" } });
      const completed   = await prisma.submission.count({ where: { assignment: { subjectId: s.id }, status: "GRADED" } });
      return { subject: s.name, assignments, completed, rate: assignments ? Math.round((completed / assignments) * 100) : 0 };
    })
  );
  return stats;
};

module.exports = { getPlatformOverview, getAttendanceTrends, getPerformanceTrends, getEngagementMetrics, getSubjectStats };
