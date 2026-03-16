"use strict";
const Joi = require("joi");

// ─── Auth ──────────────────────────────────────────────────────────────────────
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName:  Joi.string().min(2).max(50).required(),
  email:     Joi.string().email().required(),
  password:  Joi.string().min(8).max(128).required()
    .pattern(/^(?=.*[A-Z])(?=.*[0-9])/, "at least one uppercase letter and one number"),
  role:      Joi.string().valid("ADMIN", "TEACHER", "STUDENT", "PARENT").required(),
  phone:     Joi.string().pattern(/^[0-9+\-\s()]{7,20}$/).optional(),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token:    Joi.string().required(),
  password: Joi.string().min(8).max(128).required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword:     Joi.string().min(8).max(128).required(),
});

// ─── Assignment ───────────────────────────────────────────────────────────────
const createAssignmentSchema = Joi.object({
  title:       Joi.string().min(3).max(200).required(),
  description: Joi.string().max(2000).optional(),
  subjectId:   Joi.string().uuid().required(),
  dueDate:     Joi.date().iso().greater("now").required(),
  totalMarks:  Joi.number().integer().min(1).max(1000).default(100),
  allowLate:   Joi.boolean().default(false),
});

const gradeSubmissionSchema = Joi.object({
  marksObtained: Joi.number().min(0).required(),
  feedback:      Joi.string().max(2000).optional(),
});

// ─── Test ─────────────────────────────────────────────────────────────────────
const createTestSchema = Joi.object({
  title:             Joi.string().min(3).max(200).required(),
  description:       Joi.string().max(2000).optional(),
  subjectId:         Joi.string().uuid().required(),
  durationMinutes:   Joi.number().integer().min(5).max(300).default(60),
  totalMarks:        Joi.number().integer().min(1).default(100),
  passingMarks:      Joi.number().integer().min(1).default(40),
  startTime:         Joi.date().iso().optional(),
  endTime:           Joi.date().iso().optional(),
  randomizeQuestions: Joi.boolean().default(true),
});

const addQuestionsSchema = Joi.object({
  questions: Joi.array().items(
    Joi.object({
      questionText:  Joi.string().min(3).required(),
      questionType:  Joi.string().valid("MCQ","SHORT_ANSWER","LONG_ANSWER","TRUE_FALSE").default("MCQ"),
      options:       Joi.array().items(Joi.string()).when("questionType", { is: "MCQ", then: Joi.array().length(4).required() }),
      correctAnswer: Joi.string().required(),
      marks:         Joi.number().min(0.5).default(1),
      explanation:   Joi.string().optional(),
    })
  ).min(1).required(),
});

// ─── Timetable ────────────────────────────────────────────────────────────────
const createSlotSchema = Joi.object({
  classId:         Joi.string().uuid().required(),
  subjectId:       Joi.string().uuid().required(),
  teacherProfileId: Joi.string().uuid().required(),
  dayOfWeek:       Joi.string().valid("MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY").required(),
  startTime:       Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).required(),
  endTime:         Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/).required(),
  roomNumber:      Joi.string().optional(),
});

// ─── Attendance ───────────────────────────────────────────────────────────────
const markAttendanceSchema = Joi.object({
  classSessionId: Joi.string().uuid().required(),
  records: Joi.array().items(
    Joi.object({
      studentProfileId: Joi.string().uuid().required(),
      status:  Joi.string().valid("PRESENT","ABSENT","LATE","EXCUSED").required(),
      remarks: Joi.string().max(500).optional(),
    })
  ).min(1).required(),
});

// ─── Message ──────────────────────────────────────────────────────────────────
const sendMessageSchema = Joi.object({
  content: Joi.string().min(1).max(4000).required(),
});

module.exports = {
  registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema,
  createAssignmentSchema, gradeSubmissionSchema,
  createTestSchema, addQuestionsSchema,
  createSlotSchema, markAttendanceSchema, sendMessageSchema,
};
