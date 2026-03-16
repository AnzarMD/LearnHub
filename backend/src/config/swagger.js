"use strict";
const swaggerJsdoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "LearnHub EdTech API", version: "1.0.0", description: "Production backend for LearnHub" },
    servers: [{ url: "http://localhost:8000/api/v1", description: "Local" }],
    components: { securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } } },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};
module.exports = swaggerJsdoc(options);
