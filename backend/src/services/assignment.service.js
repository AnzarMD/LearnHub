"use strict";
const prisma = require("../config/database");
const { parsePagination } = require("../utils/pagination");
const { scoreToGrade }    = require("../utils/grade");

// ─── Create assignment ────────────────────────────────────────────────────────
const createAssignment = async (teacherUserId, data) => {
  const teacher = await prisma.teacherProfile.findUnique({ where: { userId: teacherUserId } });
  if (!teacher) {
    const err = new Error("Teacher profile not found");
    err.statusCode = 404;
    throw err;
  }

  return prisma.assignment.create({
    data: {
      title:           data.title,
      description:     data.description,
      subjectId:       data.subjectId,
      teacherProfileId: teacher.id,
      dueDate:         new Date(data.dueDate),
      totalMarks:      data.totalMarks || 100,
      attachmentUrl:   data.attachmentUrl || null,
      status:          "PUBLISHED",
      allowLate:       data.allowLate || false,
    },
    include: { subject: true, teacherProfile: { include: { user: { select: { firstName: true, lastName: true } } } } },
  });
};

// ─── List assignments ─────────────────────────────────────────────────────────
const listAssignments = async (query, userId, role) => {
  const { page, limit, skip } = parsePagination(query);

  let where = { deletedAt: null, status: "PUBLISHED" };

  if (role === "TEACHER") {
    const teacher = await prisma.teacherProfile.findUnique({ where: { userId } });
    if (teacher) where.teacherProfileId = teacher.id;
  }

  if (query.subjectId) where.subjectId = query.subjectId;
  if (query.status)    where.status    = query.status;

  const [total, items] = await Promise.all([
    prisma.assignment.count({ where }),
    prisma.assignment.findMany({
      where,
      include: {
        subject: true,
        teacherProfile: { include: { user: { select: { firstName: true, lastName: true } } } },
        _count: { select: { submissions: true } },
      },
      skip,
      take: limit,
      orderBy: { dueDate: "asc" },
    }),
  ]);

  return { items, total, page, limit };
};

// ─── Submit assignment ────────────────────────────────────────────────────────
const submitAssignment = async (assignmentId, studentUserId, fileUrl, content) => {
  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, deletedAt: null, status: "PUBLISHED" },
  });
  if (!assignment) {
    const err = new Error("Assignment not found or not available");
    err.statusCode = 404;
    throw err;
  }

  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) {
    const err = new Error("Student profile not found");
    err.statusCode = 404;
    throw err;
  }

  const isLate = new Date() > new Date(assignment.dueDate);
  if (isLate && !assignment.allowLate) {
    const err = new Error("Submission deadline has passed");
    err.statusCode = 400;
    throw err;
  }

  return prisma.submission.upsert({
    where: { assignmentId_studentProfileId: { assignmentId, studentProfileId: student.id } },
    update: { fileUrl, content, status: "SUBMITTED", submittedAt: new Date(), isLate },
    create: {
      assignmentId,
      studentProfileId: student.id,
      fileUrl,
      content,
      status:      "SUBMITTED",
      isLate,
      submittedAt: new Date(),
    },
  });
};

// ─── Grade submission ─────────────────────────────────────────────────────────
const gradeSubmission = async (submissionId, teacherUserId, marksObtained, feedback) => {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { assignment: true },
  });
  if (!submission) {
    const err = new Error("Submission not found");
    err.statusCode = 404;
    throw err;
  }

  const pct   = (marksObtained / submission.assignment.totalMarks) * 100;
  const grade = scoreToGrade(pct);

  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data:  { marksObtained, feedback, status: "GRADED", gradedAt: new Date(), gradedBy: teacherUserId },
  });

  // Record grade
  await prisma.grade.upsert({
    where: { id: submissionId }, // use same id for simplicity
    update: { marksObtained, grade },
    create: {
      id:               submissionId,
      studentProfileId: submission.studentProfileId,
      subjectId:        submission.assignment.subjectId,
      examType:         "Assignment",
      marksObtained,
      totalMarks:       submission.assignment.totalMarks,
      grade,
    },
  });

  return updated;
};

// ─── Get student submissions ──────────────────────────────────────────────────
const getMySubmissions = async (studentUserId) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) return [];

  return prisma.submission.findMany({
    where: { studentProfileId: student.id },
    include: {
      assignment: { include: { subject: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

module.exports = { createAssignment, listAssignments, submitAssignment, gradeSubmission, getMySubmissions };
