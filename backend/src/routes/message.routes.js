"use strict";
const router   = require("express").Router();
const ctrl     = require("../controllers/message.controller");
const { authenticate } = require("../middleware/auth");
const validate = require("../middleware/validate");
const upload   = require("../middleware/upload");
const { sendMessageSchema } = require("../models/schemas");

router.use(authenticate);

router.get("/conversations",                       ctrl.getConversations);
router.post("/conversations/direct",               ctrl.getOrCreateDirect);
router.get("/conversations/:conversationId",       ctrl.getMessages);
router.post("/conversations/:conversationId/send",
  upload.single("attachment"),
  validate(sendMessageSchema),
  ctrl.sendMessage
);
router.delete("/messages/:messageId",              ctrl.deleteMessage);

module.exports = router;
