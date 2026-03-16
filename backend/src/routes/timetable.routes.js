"use strict";
const router   = require("express").Router();
const ctrl     = require("../controllers/timetable.controller");
const { authenticate, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createSlotSchema } = require("../models/schemas");

router.use(authenticate);

router.get("/me",                     ctrl.getMySchedule);
router.get("/class/:classId",         ctrl.getClassTimetable);

router.post("/",                      authorize("ADMIN"), ctrl.createTimetable);
router.post("/:timetableId/slots",    authorize("ADMIN"), validate(createSlotSchema), ctrl.createSlot);

// Class sessions
router.post("/sessions",              authorize("TEACHER","ADMIN"), ctrl.createSession);
router.patch("/sessions/:sessionId/start", authorize("TEACHER","ADMIN"), ctrl.startSession);
router.patch("/sessions/:sessionId/end",   authorize("TEACHER","ADMIN"), ctrl.endSession);

module.exports = router;
