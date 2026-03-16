"use strict";
require("dotenv").config();
const http   = require("http");
const app    = require("./src/app");
const { initSocket } = require("./src/sockets");
const logger = require("./src/config/logger");
const prisma = require("./src/config/database");

const PORT   = process.env.PORT || 8000;
const server = http.createServer(app);
initSocket(server);

const shutdown = async (signal) => {
  logger.info(signal + " received. Shutting down...");
  server.close(async () => { await prisma.$disconnect(); process.exit(0); });
  setTimeout(() => process.exit(1), 10000);
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));
process.on("unhandledRejection", (r) => logger.error("UnhandledRejection", r));

server.listen(PORT, async () => {
  try {
    await prisma.$connect();
    logger.info("DB connected. LearnHub API running on port " + PORT);
    logger.info("Swagger: http://localhost:" + PORT + "/api/v1/docs");
  } catch (e) { logger.error(e); process.exit(1); }
});
module.exports = server;
