"use strict";
const notifService = require("../services/notification.service");

/**
 * Events:
 *   notif:mark-read    { notificationId }
 *   notif:mark-all-read
 */
const registerNotifHandlers = (io, socket) => {
  const user = socket.user;

  socket.on("notif:mark-read", async ({ notificationId }) => {
    try {
      await notifService.markRead(notificationId, user.id);
      socket.emit("notif:marked-read", { notificationId });
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

  socket.on("notif:mark-all-read", async () => {
    try {
      await notifService.markAllRead(user.id);
      socket.emit("notif:all-marked-read");
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });
};

module.exports = registerNotifHandlers;
