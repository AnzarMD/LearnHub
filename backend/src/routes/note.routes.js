"use strict";
const router = require("express").Router();
const { authenticate, authorize } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const { success, created, paginated } = require("../utils/response");
const { parsePagination } = require("../utils/pagination");
const { uploadLimiter } = require("../middleware/rateLimiter");
const upload = require("../middleware/upload");
const prisma = require("../config/database");

router.use(authenticate);

// List notes (approved only for students)
router.get("/", asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePagination(req.query);
  const where = { deletedAt: null };
  if (req.user.role === "STUDENT") where.isApproved = true;
  if (req.query.subjectId) where.subjectId = req.query.subjectId;

  const [total, items] = await Promise.all([
    prisma.note.count({ where }),
    prisma.note.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
  ]);
  paginated(res, items, total, page, limit);
}));

// Upload note
router.post("/",
  authorize("TEACHER", "ADMIN"),
  uploadLimiter,
  upload.single("notes"),
  asyncHandler(async (req, res) => {
    if (!req.file) { const e = new Error("File required"); e.statusCode = 400; throw e; }
    const teacher = await prisma.teacherProfile.findUnique({ where: { userId: req.user.id } });
    const note = await prisma.note.create({
      data: {
        title:           req.body.title,
        description:     req.body.description || null,
        subjectId:       req.body.subjectId,
        teacherProfileId: teacher ? teacher.id : req.body.teacherProfileId,
        fileUrl:         req.file.path,
        fileType:        req.body.fileType || "Document",
        fileSize:        req.file.size,
        isApproved:      req.user.role === "ADMIN",
      },
    });
    created(res, { note }, "Note uploaded" + (req.user.role !== "ADMIN" ? " — pending admin approval" : ""));
  })
);

// Approve note (Admin)
router.patch("/:id/approve", authorize("ADMIN"), asyncHandler(async (req, res) => {
  const note = await prisma.note.update({
    where: { id: req.params.id },
    data:  { isApproved: true, approvedBy: req.user.id },
  });
  success(res, { note }, "Note approved");
}));

// Increment download count
router.post("/:id/download", asyncHandler(async (req, res) => {
  await prisma.note.update({ where: { id: req.params.id }, data: { downloadCount: { increment: 1 } } });
  success(res, {}, "Download recorded");
}));

// Delete note
router.delete("/:id", authorize("TEACHER","ADMIN"), asyncHandler(async (req, res) => {
  await prisma.note.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
  success(res, {}, "Note deleted");
}));

module.exports = router;
