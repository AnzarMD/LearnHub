"use strict";
const messageService = require("../services/message.service");
const logger         = require("../config/logger");

/**
 * Events:
 *   chat:join      { conversationId }            → Join conversation room
 *   chat:send      { conversationId, content }   → Send message
 *   chat:typing    { conversationId }             → Typing indicator
 *   chat:read      { conversationId }             → Mark messages read
 */
const registerChatHandlers = (io, socket) => {
  const user = socket.user;

  socket.on("chat:join", ({ conversationId }) => {
    socket.join("conv:" + conversationId);
    socket.emit("chat:joined", { conversationId });
  });

  socket.on("chat:leave", ({ conversationId }) => {
    socket.leave("conv:" + conversationId);
  });

  socket.on("chat:send", async ({ conversationId, content }) => {
    try {
      if (!content || !content.trim()) return;
      const message = await messageService.sendMessage(conversationId, user.id, content.trim());
      // messageService.setIo broadcasts to "conv:{id}" already — no need to emit here
      logger.info(`Message sent in conv ${conversationId} by ${user.firstName}`);
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

  socket.on("chat:typing", ({ conversationId }) => {
    socket.to("conv:" + conversationId).emit("chat:typing", {
      userId: user.id,
      name:   user.firstName + " " + user.lastName,
    });
  });

  socket.on("chat:read", ({ conversationId }) => {
    socket.to("conv:" + conversationId).emit("chat:read", {
      userId: user.id,
      conversationId,
      readAt: new Date(),
    });
  });
};

module.exports = registerChatHandlers;
