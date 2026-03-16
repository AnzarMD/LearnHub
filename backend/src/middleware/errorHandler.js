"use strict";
const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.path} — ${err.message}`);

  // Prisma known request errors
  if (err.code === "P2002") {
    const field = err.meta?.target?.join(", ") || "field";
    return res.status(409).json({ success: false, message: `Duplicate value for: ${field}` });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ success: false, message: "Record not found" });
  }
  if (err.code === "P2003") {
    return res.status(400).json({ success: false, message: "Foreign key constraint failed" });
  }

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.errors && { errors: err.errors }),
  });
};

const notFound = (req, res) =>
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });

module.exports = { errorHandler, notFound };
