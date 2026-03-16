#!/usr/bin/env node
"use strict";
/**
 * Restore script — restores from a .sql backup file.
 * Run: node scripts/restore.js backups/learnhub-2025-01-01.sql
 */
require("dotenv").config();
const { execSync } = require("child_process");
const path         = require("path");

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/restore.js <backup-file.sql>");
  process.exit(1);
}

const url = new URL(process.env.DATABASE_URL);
const cmd = `psql -h ${url.hostname} -p ${url.port || 5432} -U ${url.username} -d ${url.pathname.slice(1)} -f "${path.resolve(file)}"`;

console.log("Restoring from:", file);
try {
  execSync(cmd, { env: { ...process.env, PGPASSWORD: url.password }, stdio: "inherit" });
  console.log("✅ Restore complete");
} catch (e) {
  console.error("❌ Restore failed:", e.message);
  process.exit(1);
}
