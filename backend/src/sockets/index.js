"use strict";
const { Server }   = require("socket.io");
const { verifyAccess } = require("../utils/jwt");
const logger       = require("../config/logger");
const prisma       = require("../config/database");

const registerClassHandlers    = require("./class.socket");
const registerChatHandlers     = require("./chat.socket");
const registerNotifHandlers    = require("./notification.socket");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin:      (process.env.CORS_ORIGINS || "http://localhost:5173").split(","),
      methods:     ["GET", "POST"],
      credentials: true,
    },
    pingTimeout:  60000,
    pingInterval: 25000,
  });

  // ── JWT auth middleware ────────────────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token ||
                    socket.handshake.headers?.authorization?.replace("Bearer ", "");
      if (!token) return next(new Error("Authentication required"));

      const decoded = verifyAccess(token);
      const user    = await prisma.user.findFirst({
        where: { id: decoded.id, isActive: true, deletedAt: null },
        select: { id: true, firstName: true, lastName: true, role: true },
      });
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const { id, firstName, lastName, role } = socket.user;
    logger.info(`Socket connected: ${firstName} ${lastName} [${role}] — ${socket.id}`);

    // Each user joins their private room for targeted notifications
    socket.join("user:" + id);

    // Register feature handlers
    registerClassHandlers(io, socket);
    registerChatHandlers(io, socket);
    registerNotifHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      logger.info(`Socket disconnected: ${firstName} ${lastName} — ${reason}`);
    });

    socket.on("error", (err) => {
      logger.error("Socket error:", err);
    });
  });

  // Share io with notification and message services
  const notifService   = require("../services/notification.service");
  const messageService = require("../services/message.service");
  notifService.setIo(io);
  messageService.setIo(io);

  logger.info("Socket.io initialised");
  return io;
};

const getIo = () => {
  if (!io) throw new Error("Socket.io not initialised");
  return io;
};

module.exports = { initSocket, getIo };
