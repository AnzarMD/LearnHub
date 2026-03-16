"use strict";
const express      = require("express");
const helmet       = require("helmet");
const cors         = require("cors");
const morgan       = require("morgan");
const cookieParser = require("cookie-parser");
const compression  = require("compression");
const swaggerUi    = require("swagger-ui-express");
const path         = require("path");

const swaggerSpec          = require("./config/swagger");
const logger               = require("./config/logger");
const { defaultLimiter }   = require("./middleware/rateLimiter");
const { errorHandler, notFound } = require("./middleware/errorHandler");

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes         = require("./routes/auth.routes");
const userRoutes         = require("./routes/user.routes");
const classRoutes        = require("./routes/class.routes");
const subjectRoutes      = require("./routes/subject.routes");
const timetableRoutes    = require("./routes/timetable.routes");
const attendanceRoutes   = require("./routes/attendance.routes");
const assignmentRoutes   = require("./routes/assignment.routes");
const testRoutes         = require("./routes/test.routes");
const noteRoutes         = require("./routes/note.routes");
const notificationRoutes = require("./routes/notification.routes");
const messageRoutes      = require("./routes/message.routes");
const analyticsRoutes    = require("./routes/analytics.routes");

const app    = express();
const PREFIX = process.env.API_PREFIX || "/api/v1";

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // allow file serving
}));

app.use(cors({
  origin:      (process.env.CORS_ORIGINS || "http://localhost:5173").split(","),
  credentials: true,
  methods:     ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Parsers ───────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(compression());

// ── Logging ───────────────────────────────────────────────────────────────────
app.use(morgan("combined", {
  stream: { write: (msg) => logger.info(msg.trim()) },
  skip:   (req) => req.url === "/health",
}));

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use(PREFIX, defaultLimiter);

// ── Static uploads ────────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status:  "ok",
    service: "LearnHub API",
    time:    new Date().toISOString(),
    env:     process.env.NODE_ENV,
  });
});

// ── API documentation ─────────────────────────────────────────────────────────
if (process.env.SWAGGER_ENABLED !== "false") {
  app.use(PREFIX + "/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "LearnHub API Docs",
  }));
}

// ── Mount routes ──────────────────────────────────────────────────────────────
app.use(PREFIX + "/auth",          authRoutes);
app.use(PREFIX + "/users",         userRoutes);
app.use(PREFIX + "/classes",       classRoutes);
app.use(PREFIX + "/subjects",      subjectRoutes);
app.use(PREFIX + "/timetable",     timetableRoutes);
app.use(PREFIX + "/attendance",    attendanceRoutes);
app.use(PREFIX + "/assignments",   assignmentRoutes);
app.use(PREFIX + "/tests",         testRoutes);
app.use(PREFIX + "/notes",         noteRoutes);
app.use(PREFIX + "/notifications", notificationRoutes);
app.use(PREFIX + "/messages",      messageRoutes);
app.use(PREFIX + "/analytics",     analyticsRoutes);

// ── 404 & global error handler ────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
