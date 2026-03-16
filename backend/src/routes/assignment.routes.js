"use strict";
const router   = require("express").Router();
const ctrl     = require("../controllers/assignment.controller");
const { authenticate, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const upload   = require("../middleware/upload");
const { uploadLimiter } = require("../middleware/rateLimiter");
const { createAssignmentSchema, gradeSubmissionSchema } = require("../models/schemas");

router.use(authenticate);

router.get("/",       ctrl.listAssignments);
router.get("/mine",   ctrl.getMySubmissions);
router.get("/:id",    ctrl.getAssignment);

router.post("/",
  authorize("TEACHER","ADMIN"),
  uploadLimiter,
  upload.single("assignment"),
  validate(createAssignmentSchema),
  ctrl.createAssignment
);

router.post("/:id/submit",
  authorize("STUDENT"),
  uploadLimiter,
  upload.single("submission"),
  ctrl.submitAssignment
);

router.patch("/submissions/:submissionId/grade",
  authorize("TEACHER","ADMIN"),
  validate(gradeSubmissionSchema),
  ctrl.gradeSubmission
);

router.delete("/:id", authorize("TEACHER","ADMIN"), ctrl.deleteAssignment);

module.exports = router;
