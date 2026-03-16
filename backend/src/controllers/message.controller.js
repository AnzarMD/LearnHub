"use strict";
const asyncHandler  = require("../utils/asyncHandler");
const { success, paginated } = require("../utils/response");
const messageService = require("../services/message.service");

const getConversations = asyncHandler(async (req, res) => {
  const conversations = await messageService.getConversations(req.user.id);
  success(res, { conversations });
});

const getOrCreateDirect = asyncHandler(async (req, res) => {
  const conv = await messageService.getOrCreateDirectConversation(req.user.id, req.body.userId);
  success(res, { conversation: conv });
});

const getMessages = asyncHandler(async (req, res) => {
  const result = await messageService.getMessages(req.params.conversationId, req.user.id, req.query);
  paginated(res, result.items, result.total, result.page, result.limit);
});

const sendMessage = asyncHandler(async (req, res) => {
  const attachmentUrl = req.file ? req.file.path : null;
  const message = await messageService.sendMessage(
    req.params.conversationId, req.user.id, req.body.content, attachmentUrl
  );
  success(res, { message }, "Message sent");
});

const deleteMessage = asyncHandler(async (req, res) => {
  await messageService.deleteMessage(req.params.messageId, req.user.id);
  success(res, {}, "Message deleted");
});

module.exports = { getConversations, getOrCreateDirect, getMessages, sendMessage, deleteMessage };
