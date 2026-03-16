"use strict";
const asyncHandler  = require("../utils/asyncHandler");
const { success, created, paginated } = require("../utils/response");
const testService   = require("../services/test.service");
const prisma        = require("../config/database");

const createTest = asyncHandler(async (req, res) => {
  const test = await testService.createTest(req.user.id, req.body);
  created(res, { test }, "Test created");
});

const addQuestions = asyncHandler(async (req, res) => {
  const questions = await testService.addQuestions(req.params.id, req.body.questions);
  success(res, { questions }, "Questions added");
});

const publishTest = asyncHandler(async (req, res) => {
  const test = await testService.publishTest(req.params.id, req.user.id);
  success(res, { test }, "Test published");
});

const getTestForStudent = asyncHandler(async (req, res) => {
  const data = await testService.getTestForStudent(req.params.id, req.user.id);
  success(res, data);
});

const startAttempt = asyncHandler(async (req, res) => {
  const attempt = await testService.startAttempt(req.params.id, req.user.id);
  success(res, { attempt });
});

const submitTest = asyncHandler(async (req, res) => {
  const result = await testService.submitTest(req.params.id, req.user.id, req.body.answers || {});
  success(res, { result }, "Test submitted");
});

const getAttemptResult = asyncHandler(async (req, res) => {
  const result = await testService.getAttemptResult(req.params.id, req.user.id);
  success(res, { result });
});

const listTests = asyncHandler(async (req, res) => {
  const { page, limit, skip } = require("../utils/pagination").parsePagination(req.query);
  const where = { deletedAt: null };
  if (req.user.role === "STUDENT") where.status = { in: ["PUBLISHED", "ACTIVE"] };
  if (req.query.subjectId) where.subjectId = req.query.subjectId;

  const [total, items] = await Promise.all([
    prisma.test.count({ where }),
    prisma.test.findMany({
      where,
      include: { subject: true, _count: { select: { questions: true, attempts: true } } },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  paginated(res, items, total, page, limit);
});

module.exports = { createTest, addQuestions, publishTest, getTestForStudent, startAttempt, submitTest, getAttemptResult, listTests };
