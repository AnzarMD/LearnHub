"use strict";
const prisma            = require("../config/database");
const timetableService  = require("../services/timetable.service");
const attendanceService = require("../services/attendance.service");
const logger            = require("../config/logger");

/**
 * Events:
 *   class:start   { sessionId }           → Teacher starts class
 *   class:join    { sessionId }           → Student joins class
 *   class:leave   { sessionId }           → Student leaves class
 *   class:end     { sessionId }           → Teacher ends class
 *   class:message { sessionId, content }  → Group chat inside class
 */
const registerClassHandlers = (io, socket) => {
  const user = socket.user;

  // ── Teacher: start class ───────────────────────────────────────────────────
  socket.on("class:start", async ({ sessionId }) => {
    try {
      if (!["TEACHER", "ADMIN"].includes(user.role)) {
        return socket.emit("error", { message: "Only teachers can start a class" });
      }
      const session = await timetableService.startClassSession(sessionId, user.id);
      const roomId  = "session:" + sessionId;

      socket.join(roomId);
      io.to(roomId).emit("class:started", {
        sessionId,
        teacherId:   user.id,
        teacherName: user.firstName + " " + user.lastName,
        startedAt:   session.startedAt,
      });
      logger.info(`Class started: ${sessionId} by ${user.firstName}`);
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

  // ── Student: join class ────────────────────────────────────────────────────
  socket.on("class:join", async ({ sessionId }) => {
    try {
      const roomId = "session:" + sessionId;

      // Verify class is live
      const session = await prisma.classSession.findUnique({ where: { id: sessionId } });
      if (!session || !session.isLive) {
        return socket.emit("error", { message: "Class is not currently live" });
      }

      socket.join(roomId);

      // Auto-mark attendance if student
      if (user.role === "STUDENT") {
        const student = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
        if (student) {
          await attendanceService.autoMarkPresent(student.id, sessionId);
        }
      }

      // Broadcast to class
      io.to(roomId).emit("class:student-joined", {
        userId:    user.id,
        name:      user.firstName + " " + user.lastName,
        role:      user.role,
        joinedAt:  new Date(),
      });

      // Send class info back to the joining user
      socket.emit("class:joined", { sessionId, session });
      logger.info(`${user.firstName} joined class ${sessionId}`);
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

  // ── Student: leave class ───────────────────────────────────────────────────
  socket.on("class:leave", async ({ sessionId }) => {
    try {
      const roomId = "session:" + sessionId;
      socket.leave(roomId);

      if (user.role === "STUDENT") {
        const student = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
        if (student) {
          await attendanceService.markStudentLeft(student.id, sessionId);
        }
      }

      io.to(roomId).emit("class:student-left", {
        userId: user.id,
        name:   user.firstName + " " + user.lastName,
        leftAt: new Date(),
      });
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

  // ── Teacher: end class ─────────────────────────────────────────────────────
  socket.on("class:end", async ({ sessionId }) => {
    try {
      if (!["TEACHER", "ADMIN"].includes(user.role)) {
        return socket.emit("error", { message: "Only teachers can end a class" });
      }
      const session = await timetableService.endClassSession(sessionId);
      const roomId  = "session:" + sessionId;

      io.to(roomId).emit("class:ended", {
        sessionId,
        endedAt:        session.endedAt,
        durationMinutes: session.durationMinutes,
      });

      // Kick all sockets from the room
      const sockets = await io.in(roomId).fetchSockets();
      sockets.forEach((s) => s.leave(roomId));

      logger.info(`Class ended: ${sessionId}`);
    } catch (err) {
      socket.emit("error", { message: err.message });
    }
  });

  // ── Class group chat ───────────────────────────────────────────────────────
  socket.on("class:message", ({ sessionId, content }) => {
    if (!content || !content.trim()) return;
    const roomId = "session:" + sessionId;
    io.to(roomId).emit("class:message", {
      userId:  user.id,
      name:    user.firstName + " " + user.lastName,
      role:    user.role,
      content: content.trim(),
      sentAt:  new Date(),
    });
  });
};

module.exports = registerClassHandlers;
