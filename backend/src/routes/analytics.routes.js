"use strict";
const router = require("express").Router();
const ctrl   = require("../controllers/analytics.controller");
const { authenticate, authorize } = require("../middleware/auth");

router.use(authenticate);

router.get("/overview",    authorize("ADMIN"), ctrl.getPlatformOverview);
router.get("/attendance",  ctrl.getAttendanceTrends);
router.get("/performance", ctrl.getMyPerformance);
router.get("/engagement",  authorize("ADMIN","TEACHER"), ctrl.getEngagement);
router.get("/subjects",    authorize("ADMIN","TEACHER"), ctrl.getSubjectStats);
router.get("/logs",        authorize("ADMIN"), ctrl.getActivityLogs);

module.exports = router;
