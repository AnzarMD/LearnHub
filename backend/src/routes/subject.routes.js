"use strict";
const router = require("express").Router();
const { authenticate, authorize } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const { success, created, paginated } = require("../utils/response");
const { parsePagination, buildSearch } = require("../utils/pagination");
const prisma = require("../config/database");

router.use(authenticate);

// List subjects
router.get("/", asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const search = buildSearch(["name", "code"], req.query.search);
  const where  = { isActive: true, ...search };
  const [total, items] = await Promise.all([
    prisma.subject.count({ where }),
    prisma.subject.findMany({ where, skip, take: limit, orderBy: { name: "asc" } }),
  ]);
  paginated(res, items, total, page, limit);
}));

// Get one
router.get("/:id", asyncHandler(async (req, res) => {
  const subject = await prisma.subject.findUnique({ where: { id: req.params.id } });
  if (!subject) { const e = new Error("Subject not found"); e.statusCode = 404; throw e; }
  success(res, { subject });
}));

// Create
router.post("/", authorize("ADMIN"), asyncHandler(async (req, res) => {
  const subject = await prisma.subject.create({ data: req.body });
  created(res, { subject }, "Subject created");
}));

// Update
router.patch("/:id", authorize("ADMIN"), asyncHandler(async (req, res) => {
  const subject = await prisma.subject.update({ where: { id: req.params.id }, data: req.body });
  success(res, { subject }, "Subject updated");
}));

// Delete (soft)
router.delete("/:id", authorize("ADMIN"), asyncHandler(async (req, res) => {
  await prisma.subject.update({ where: { id: req.params.id }, data: { isActive: false } });
  success(res, {}, "Subject deactivated");
}));

module.exports = router;
