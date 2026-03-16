"use strict";
const router = require("express").Router();
const ctrl   = require("../controllers/notification.controller");
const { authenticate, authorize } = require("../middleware/auth");

router.use(authenticate);

router.get("/",            ctrl.getNotifications);
router.patch("/:id/read",  ctrl.markRead);
router.patch("/read-all",  ctrl.markAllRead);
router.post("/announce",   authorize("ADMIN","TEACHER"), ctrl.sendAnnouncement);

module.exports = router;
