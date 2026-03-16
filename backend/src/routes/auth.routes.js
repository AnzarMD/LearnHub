"use strict";
const router   = require("express").Router();
const ctrl     = require("../controllers/auth.controller");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const { authLimiter }  = require("../middleware/rateLimiter");
const logActivity      = require("../middleware/activityLogger");
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } = require("../models/schemas");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

router.post("/register",
  authLimiter,
  validate(registerSchema),
  logActivity("USER_REGISTER", "User", (r) => r.body.email + " registered"),
  ctrl.register
);

router.post("/login",
  authLimiter,
  validate(loginSchema),
  logActivity("USER_LOGIN", "User", (r) => r.body.email + " logged in"),
  ctrl.login
);

router.post("/refresh", ctrl.refreshToken);

router.post("/logout",
  authenticate,
  logActivity("USER_LOGOUT", "User", "User logged out"),
  ctrl.logout
);

router.get("/verify-email", ctrl.verifyEmail);

router.post("/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  ctrl.forgotPassword
);

router.post("/reset-password",
  validate(resetPasswordSchema),
  ctrl.resetPassword
);

router.post("/change-password",
  authenticate,
  validate(changePasswordSchema),
  ctrl.changePassword
);

module.exports = router;
