"use strict";
const prisma = require("../config/database");
const { parsePagination } = require("../utils/pagination");

let _io = null;
const setIo = (io) => { _io = io; };

// ─── Get or create direct conversation ───────────────────────────────────────
const getOrCreateDirectConversation = async (userId1, userId2) => {
  const existing = await prisma.conversation.findFirst({
    where: {
      type: "DIRECT",
      AND: [
        { participants: { some: { userId: userId1 } } },
        { participants: { some: { userId: userId2 } } },
      ],
    },
    include: { participants: true },
  });

  if (existing && existing.participants.length === 2) return existing;

  return prisma.conversation.create({
    data: {
      type: "DIRECT",
      participants: {
        create: [{ userId: userId1 }, { userId: userId2 }],
      },
    },
    include: { participants: { include: { userId: true } } },
  });
};

// ─── Get conversations list ───────────────────────────────────────────────────
const getConversations = async (userId) => {
  return prisma.conversation.findMany({
    where: { participants: { some: { userId } } },
    include: {
      participants: {
        include: { conversation: false },
        where: { userId: { not: userId } },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });
};

// ─── Get messages in conversation ────────────────────────────────────────────
const getMessages = async (conversationId, userId, query) => {
  const { page, limit, skip } = parsePagination(query);

  // Verify participation
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });
  if (!participant) {
    const err = new Error("Not a participant of this conversation");
    err.statusCode = 403;
    throw err;
  }

  const [total, items] = await Promise.all([
    prisma.message.count({ where: { conversationId, deletedAt: null } }),
    prisma.message.findMany({
      where:   { conversationId, deletedAt: null },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true, role: true } } },
      skip,
      take:    limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Mark as read
  await prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data:  { lastReadAt: new Date() },
  });

  return { items: items.reverse(), total, page, limit };
};

// ─── Send message ─────────────────────────────────────────────────────────────
const sendMessage = async (conversationId, senderId, content, attachmentUrl = null) => {
  const message = await prisma.message.create({
    data: { conversationId, senderId, content, attachmentUrl },
    include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data:  { updatedAt: new Date() },
  });

  if (_io) {
    _io.to("conv:" + conversationId).emit("message:new", message);
  }

  return message;
};

// ─── Delete message (soft) ───────────────────────────────────────────────────
const deleteMessage = async (messageId, userId) => {
  return prisma.message.updateMany({
    where: { id: messageId, senderId: userId },
    data:  { deletedAt: new Date() },
  });
};

module.exports = { setIo, getOrCreateDirectConversation, getConversations, getMessages, sendMessage, deleteMessage };
