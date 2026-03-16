"use strict";
const router   = require("express").Router();
const ctrl     = require("../controllers/attendance.controller");
const { authenticate, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { markAttendanceSchema } = require("../models/schemas");

router.use(authenticate);

router.get("/me",                       ctrl.getMyAttendance);
router.get("/session/:sessionId",       authorize("ADMIN","TEACHER"), ctrl.getSessionAttendance);
router.get("/student/:studentProfileId", authorize("ADMIN","TEACHER","PARENT"), ctrl.getStudentAttendance);
router.post("/mark",                    authorize("ADMIN","TEACHER"), validate(markAttendanceSchema), ctrl.markAttendance);

module.exports = router;
