"use strict";
const rateLimit = require("express-rate-limit");

/** Default limiter — applied to all routes */
const defaultLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  max:      parseInt(process.env.RATE_LIMIT_MAX       || "100",    10),
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

/** Stricter limiter for auth endpoints */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, message: "Too many auth attempts. Try again in 15 minutes." },
});

/** Upload limiter */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  message: { success: false, message: "Upload limit reached. Try again in 1 hour." },
});

module.exports = { defaultLimiter, authLimiter, uploadLimiter };
