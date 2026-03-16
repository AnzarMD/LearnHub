"use strict";
const prisma = require("../config/database");

/**
 * Non-blocking activity log middleware.
 * Usage: router.post("/login", logActivity("USER_LOGIN", "User", "User logged in"), controller)
 */
const logActivity = (action, entity, description) => async (req, res, next) => {
  res.on("finish", async () => {
    if (res.statusCode < 400) {
      try {
        const desc =
          typeof description === "function" ? description(req) : description;
        await prisma.activityLog.create({
          data: {
            userId:      req.user ? req.user.id : null,
            action,
            entity,
            entityId:    req.params.id || null,
            description: desc,
            ipAddress:   req.ip,
            userAgent:   req.get("user-agent"),
            level:       "INFO",
          },
        });
      } catch (_) {
        /* Non-critical — never block the response */
      }
    }
  });
  next();
};

module.exports = logActivity;
