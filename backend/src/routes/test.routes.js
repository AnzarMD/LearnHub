"use strict";
const router   = require("express").Router();
const ctrl     = require("../controllers/test.controller");
const { authenticate, authorize } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createTestSchema, addQuestionsSchema } = require("../models/schemas");

router.use(authenticate);

router.get("/",               ctrl.listTests);
router.get("/:id",            ctrl.getTestForStudent);
router.get("/:id/result",     ctrl.getAttemptResult);

router.post("/",              authorize("TEACHER","ADMIN"), validate(createTestSchema), ctrl.createTest);
router.post("/:id/questions", authorize("TEACHER","ADMIN"), validate(addQuestionsSchema), ctrl.addQuestions);
router.post("/:id/publish",   authorize("TEACHER","ADMIN"), ctrl.publishTest);
router.post("/:id/start",     authorize("STUDENT"), ctrl.startAttempt);
router.post("/:id/submit",    authorize("STUDENT"), ctrl.submitTest);

module.exports = router;
