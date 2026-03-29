#!/usr/bin/env node
"use strict";
/**
 * Backup script — dumps the PostgreSQL database to a timestamped .sql file.
 * Run: node scripts/backup.js
 
 */
require("dotenv").config();
const { execSync } = require("child_process");
const path         = require("path");
const fs           = require("fs");

const backupDir = path.join(process.cwd(), "backups");
fs.mkdirSync(backupDir, { recursive: true });

const timestamp  = new Date().toISOString().replace(/[:.]/g, "-");
const outFile    = path.join(backupDir, `learnhub-${timestamp}.sql`);
const url        = new URL(process.env.DATABASE_URL);

const cmd = `pg_dump -h ${url.hostname} -p ${url.port || 5432} -U ${url.username} -d ${url.pathname.slice(1)} -F p -f "${outFile}"`;

console.log("Creating backup:", outFile);
try {
  execSync(cmd, { env: { ...process.env, PGPASSWORD: url.password }, stdio: "inherit" });
  console.log("✅ Backup complete:", outFile);
} catch (e) {
  console.error("❌ Backup failed:", e.message);
  process.exit(1);
}
