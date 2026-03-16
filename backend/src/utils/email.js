"use strict";
const nodemailer = require("nodemailer");
const logger     = require("../config/logger");

const createTransport = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await createTransport().sendMail({ from: process.env.EMAIL_FROM || "LearnHub <noreply@learnhub.io>", to, subject, html, text });
    logger.info("Email sent: " + info.messageId);
    return info;
  } catch (err) { logger.error("Email failed:", err); throw err; }
};

const sendVerificationEmail   = (to, token) => sendEmail({ to, subject: "Verify your LearnHub account", html: "<p>Click <a href='" + process.env.FRONTEND_URL + "/verify-email?token=" + token + "'>here</a> to verify your email.</p>" });
const sendPasswordResetEmail  = (to, token) => sendEmail({ to, subject: "Reset your LearnHub password", html: "<p>Click <a href='" + process.env.FRONTEND_URL + "/reset-password?token=" + token + "'>here</a> to reset your password. Expires in 1 hour.</p>" });
const sendLowAttendanceAlert  = (to, name, pct) => sendEmail({ to, subject: "Low Attendance Alert", html: "<p>Your child <b>" + name + "</b> has attendance of <b>" + pct + "%</b> — below the required 75%.</p>" });

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail, sendLowAttendanceAlert };
