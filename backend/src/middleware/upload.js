"use strict";
const multer = require("multer");
const path   = require("path");
const fs     = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const map = {
      notes:      "uploads/notes/",
      submission: "uploads/submissions/",
      avatar:     "uploads/avatars/",
      assignment: "uploads/assignments/",
    };
    const dir = map[file.fieldname] || "uploads/assignments/";
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt|png|jpg|jpeg|gif|mp4|zip/;
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  if (allowed.test(ext)) return cb(null, true);
  cb(new Error("File type not allowed: " + ext));
};

const MAX_MB = parseInt(process.env.MAX_FILE_SIZE_MB || "20", 10);

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
});

module.exports = upload;
