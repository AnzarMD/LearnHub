"use strict";
const prisma = require("../config/database");
const { parsePagination } = require("../utils/pagination");

let _io = null;
const setIo = (io) => { _io = io; };

// ─── Create and push notification ─────────────────────────────────────────────
const sendNotification = async (userId, type, title, message, data = null) => {
  const notif = await prisma.notification.create({
    data: { userId, type, title, message, data },
  });

  // Push via socket if user is online
  if (_io) {
    _io.to("user:" + userId).emit("notification:new", notif);
  }

  return notif;
};

// ─── Send to multiple users ───────────────────────────────────────────────────
const sendBulkNotification = async (userIds, type, title, message) => {
  const inserts = userIds.map((userId) =>
    prisma.notification.create({ data: { userId, type, title, message } })
  );
  const results = await prisma.$transaction(inserts);

  if (_io) {
    userIds.forEach((uid, i) => _io.to("user:" + uid).emit("notification:new", results[i]));
  }

  return results;
};

// ─── Send to an entire class ──────────────────────────────────────────────────
const notifyClass = async (classId, type, title, message) => {
  const students = await prisma.studentProfile.findMany({
    where:   { classId },
    include: { user: { select: { id: true } } },
  });
  const userIds = students.map((s) => s.user.id);
  return sendBulkNotification(userIds, type, title, message);
};

// ─── Get user notifications ───────────────────────────────────────────────────
const getUserNotifications = async (userId, query) => {
  const { page, limit, skip } = parsePagination(query);
  const where = { userId, ...(query.unread === "true" && { isRead: false }) };

  const [total, items] = await Promise.all([
    prisma.notification.count({ where }),
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { items, total, page, limit, unreadCount: await prisma.notification.count({ where: { userId, isRead: false } }) };
};

// ─── Mark as read ─────────────────────────────────────────────────────────────
const markRead = async (notificationId, userId) => {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data:  { isRead: true, readAt: new Date() },
  });
};

const markAllRead = async (userId) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data:  { isRead: true, readAt: new Date() },
  });
};

module.exports = { setIo, sendNotification, sendBulkNotification, notifyClass, getUserNotifications, markRead, markAllRead };
