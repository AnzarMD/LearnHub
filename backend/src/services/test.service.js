"use strict";
const prisma = require("../config/database");
const { scoreToGrade } = require("../utils/grade");

// ─── Create test ──────────────────────────────────────────────────────────────
const createTest = async (teacherUserId, data) => {
  const teacher = await prisma.teacherProfile.findUnique({ where: { userId: teacherUserId } });
  if (!teacher) {
    const err = new Error("Teacher profile not found");
    err.statusCode = 404;
    throw err;
  }

  return prisma.test.create({
    data: {
      title:             data.title,
      description:       data.description,
      subjectId:         data.subjectId,
      teacherProfileId:  teacher.id,
      durationMinutes:   data.durationMinutes || 60,
      totalMarks:        data.totalMarks      || 100,
      passingMarks:      data.passingMarks    || 40,
      startTime:         data.startTime ? new Date(data.startTime) : null,
      endTime:           data.endTime   ? new Date(data.endTime)   : null,
      randomizeQuestions: data.randomizeQuestions !== false,
      status:            "DRAFT",
    },
  });
};

// ─── Add questions to test ────────────────────────────────────────────────────
const addQuestions = async (testId, questions) => {
  const inserts = questions.map((q, i) =>
    prisma.question.create({
      data: {
        testId,
        questionText:  q.questionText,
        questionType:  q.questionType || "MCQ",
        options:       q.options || null,
        correctAnswer: q.correctAnswer,
        marks:         q.marks || 1,
        explanation:   q.explanation || null,
        orderIndex:    i,
      },
    })
  );
  return prisma.$transaction(inserts);
};

// ─── Get test questions (student view — no correct answers) ───────────────────
const getTestForStudent = async (testId, studentUserId) => {
  const test = await prisma.test.findFirst({
    where: { id: testId, deletedAt: null, status: { in: ["PUBLISHED", "ACTIVE"] } },
    include: { subject: true },
  });
  if (!test) {
    const err = new Error("Test not available");
    err.statusCode = 404;
    throw err;
  }

  // Check existing attempt
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  const existing = await prisma.testAttempt.findUnique({
    where: { testId_studentProfileId: { testId, studentProfileId: student.id } },
  });
  if (existing && existing.submittedAt) {
    const err = new Error("You have already submitted this test");
    err.statusCode = 400;
    throw err;
  }

  let questions = await prisma.question.findMany({
    where: { testId },
    select: { id: true, questionText: true, questionType: true, options: true, marks: true, orderIndex: true },
    orderBy: { orderIndex: "asc" },
  });

  if (test.randomizeQuestions) {
    questions = questions.sort(() => Math.random() - 0.5);
  }

  return { test: { ...test, correctAnswer: undefined }, questions };
};

// ─── Start attempt ────────────────────────────────────────────────────────────
const startAttempt = async (testId, studentUserId) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  return prisma.testAttempt.upsert({
    where: { testId_studentProfileId: { testId, studentProfileId: student.id } },
    update: {},
    create: { testId, studentProfileId: student.id },
  });
};

// ─── Submit test ──────────────────────────────────────────────────────────────
const submitTest = async (testId, studentUserId, answers, isAutoSubmit = false) => {
  // answers: { [questionId]: selectedAnswer }
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  if (!student) {
    const err = new Error("Student profile not found");
    err.statusCode = 404;
    throw err;
  }

  const attempt = await prisma.testAttempt.findUnique({
    where: { testId_studentProfileId: { testId, studentProfileId: student.id } },
  });
  if (!attempt) {
    const err = new Error("No active attempt found");
    err.statusCode = 400;
    throw err;
  }
  if (attempt.submittedAt) {
    const err = new Error("Test already submitted");
    err.statusCode = 400;
    throw err;
  }

  const questions = await prisma.question.findMany({ where: { testId } });
  const test      = await prisma.test.findUnique({ where: { id: testId } });

  let totalEarned = 0;
  const responses = [];

  for (const q of questions) {
    const selected  = answers[q.id] !== undefined ? String(answers[q.id]) : null;
    const isCorrect = q.questionType === "MCQ" ? selected === String(q.correctAnswer) : null;
    const marks     = isCorrect ? q.marks : 0;
    totalEarned    += marks;

    responses.push(
      prisma.questionResponse.upsert({
        where: { attemptId_questionId: { attemptId: attempt.id, questionId: q.id } },
        update: { selectedAnswer: selected, isCorrect, marksAwarded: marks },
        create: { attemptId: attempt.id, questionId: q.id, selectedAnswer: selected, isCorrect, marksAwarded: marks },
      })
    );
  }

  await prisma.$transaction(responses);

  const percentage = Math.round((totalEarned / test.totalMarks) * 100 * 100) / 100;
  const isPassed   = totalEarned >= test.passingMarks;
  const timeTaken  = Math.round((Date.now() - new Date(attempt.startedAt).getTime()) / 1000);
  const grade      = scoreToGrade(percentage);

  const updated = await prisma.testAttempt.update({
    where:  { id: attempt.id },
    data:   { submittedAt: new Date(), isAutoSubmitted: isAutoSubmit, marksObtained: totalEarned, percentage, isPassed, timeTaken },
  });

  // Store in grades table
  await prisma.grade.create({
    data: {
      studentProfileId: student.id,
      subjectId:        test.subjectId,
      examType:         "Test",
      marksObtained:    totalEarned,
      totalMarks:       test.totalMarks,
      grade,
    },
  }).catch(() => {});

  return { ...updated, grade, questions: questions.map((q) => ({ ...q, userAnswer: answers[q.id], correct: q.correctAnswer })) };
};

// ─── Get test results ─────────────────────────────────────────────────────────
const getAttemptResult = async (testId, studentUserId) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } });
  return prisma.testAttempt.findUnique({
    where: { testId_studentProfileId: { testId, studentProfileId: student.id } },
    include: { responses: { include: { question: true } }, test: { include: { subject: true } } },
  });
};

// ─── Publish test ─────────────────────────────────────────────────────────────
const publishTest = async (testId, teacherUserId) => {
  const teacher = await prisma.teacherProfile.findUnique({ where: { userId: teacherUserId } });
  return prisma.test.update({
    where: { id: testId, teacherProfileId: teacher.id },
    data:  { status: "PUBLISHED" },
  });
};

module.exports = { createTest, addQuestions, getTestForStudent, startAttempt, submitTest, getAttemptResult, publishTest };
