"use strict";
const asyncHandler       = require("../utils/asyncHandler");
const { success, created, paginated } = require("../utils/response");
const assignmentService  = require("../services/assignment.service");

const createAssignment = asyncHandler(async (req, res) => {
  const data = { ...req.body, attachmentUrl: req.file ? req.file.path : null };
  const assignment = await assignmentService.createAssignment(req.user.id, data);
  created(res, { assignment }, "Assignment created");
});

const listAssignments = asyncHandler(async (req, res) => {
  const result = await assignmentService.listAssignments(req.query, req.user.id, req.user.role);
  paginated(res, result.items, result.total, result.page, result.limit);
});

const getAssignment = asyncHandler(async (req, res) => {
  const prisma = require("../config/database");
  const assignment = await prisma.assignment.findFirst({
    where: { id: req.params.id, deletedAt: null },
    include: { subject: true, submissions: { select: { id: true, status: true, studentProfileId: true, marksObtained: true } } },
  });
  if (!assignment) { const err = new Error("Not found"); err.statusCode = 404; throw err; }
  success(res, { assignment });
});

const submitAssignment = asyncHandler(async (req, res) => {
  const fileUrl = req.file ? req.file.path : null;
  const result  = await assignmentService.submitAssignment(req.params.id, req.user.id, fileUrl, req.body.content);
  success(res, { submission: result }, "Assignment submitted");
});

const gradeSubmission = asyncHandler(async (req, res) => {
  const { marksObtained, feedback } = req.body;
  const result = await assignmentService.gradeSubmission(req.params.submissionId, req.user.id, marksObtained, feedback);
  success(res, { submission: result }, "Submission graded");
});

const getMySubmissions = asyncHandler(async (req, res) => {
  const items = await assignmentService.getMySubmissions(req.user.id);
  success(res, { items });
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const prisma = require("../config/database");
  await prisma.assignment.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
  success(res, {}, "Assignment deleted");
});

module.exports = { createAssignment, listAssignments, getAssignment, submitAssignment, gradeSubmission, getMySubmissions, deleteAssignment };
