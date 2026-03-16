"use strict";
const winston = require("winston");
const { combine, timestamp, printf, colorize, errors } = winston.format;
const fmt = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ timestamp: ts, level, message, stack }) =>
    "[" + ts + "] [" + level.toUpperCase() + "] " + message + (stack ? "\n" + stack : ""))
);
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: fmt,
  transports: [new winston.transports.Console({ format: combine(colorize(), fmt) })],
});
module.exports = logger;
