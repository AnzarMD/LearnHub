"use strict";
const router = require("express").Router();
const { authenticate, authorize } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const { success, created, paginated } = require("../utils/response");
const { parsePagination } = require("../utils/pagination");
const prisma = require("../config/database");

router.use(authenticate);

// List classes
router.get("/", asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const where = { isActive: true };
  if (req.query.academicYearId) where.academicYearId = req.query.academicYearId;
  const [total, items] = await Promise.all([
    prisma.class.count({ where }),
    prisma.class.findMany({
      where,
      include: {
        academicYear: true,
        _count: { select: { students: true } },
      },
      skip, take: limit, orderBy: { name: "asc" },
    }),
  ]);
  paginated(res, items, total, page, limit);
}));

// Get class detail with students
router.get("/:id", asyncHandler(async (req, res) => {
  const cls = await prisma.class.findUnique({
    where: { id: req.params.id },
    include: {
      students: { include: { user: { select: { firstName: true, lastName: true, email: true, avatar: true } } } },
      teachers: { include: { teacherProfile: { include: { user: { select: { firstName: true, lastName: true } } } } } },
      academicYear: true,
    },
  });
  if (!cls) { const e = new Error("Class not found"); e.statusCode = 404; throw e; }
  success(res, { class: cls });
}));

// Create class
router.post("/", authorize("ADMIN"), asyncHandler(async (req, res) => {
  const cls = await prisma.class.create({ data: req.body, include: { academicYear: true } });
  created(res, { class: cls }, "Class created");
}));

// Update class
router.patch("/:id", authorize("ADMIN"), asyncHandler(async (req, res) => {
  const cls = await prisma.class.update({ where: { id: req.params.id }, data: req.body });
  success(res, { class: cls }, "Class updated");
}));

// Assign teacher to class
router.post("/:id/teachers", authorize("ADMIN"), asyncHandler(async (req, res) => {
  const link = await prisma.classTeacher.upsert({
    where: { classId_teacherProfileId: { classId: req.params.id, teacherProfileId: req.body.teacherProfileId } },
    update: { isClassTeacher: req.body.isClassTeacher || false },
    create: { classId: req.params.id, teacherProfileId: req.body.teacherProfileId, isClassTeacher: req.body.isClassTeacher || false },
  });
  created(res, { link }, "Teacher assigned to class");
}));

module.exports = router;
