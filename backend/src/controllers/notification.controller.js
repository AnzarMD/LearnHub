"use strict";
const asyncHandler          = require("../utils/asyncHandler");
const { success, paginated } = require("../utils/response");
const notifService          = require("../services/notification.service");

const getNotifications = asyncHandler(async (req, res) => {
  const result = await notifService.getUserNotifications(req.user.id, req.query);
  paginated(res, result.items, result.total, result.page, result.limit);
});

const markRead = asyncHandler(async (req, res) => {
  await notifService.markRead(req.params.id, req.user.id);
  success(res, {}, "Marked as read");
});

const markAllRead = asyncHandler(async (req, res) => {
  await notifService.markAllRead(req.user.id);
  success(res, {}, "All notifications marked as read");
});

const sendAnnouncement = asyncHandler(async (req, res) => {
  const { classId, type, title, message } = req.body;
  if (classId) {
    await notifService.notifyClass(classId, type || "ANNOUNCEMENT", title, message);
  }
  success(res, {}, "Announcement sent");
});

module.exports = { getNotifications, markRead, markAllRead, sendAnnouncement };
