"use strict";
const { verifyAccess } = require("../utils/jwt");
const { error }        = require("../utils/response");
const prisma           = require("../config/database");

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) return error(res, "No token provided", 401);
    const token   = header.split(" ")[1];
    const decoded = verifyAccess(token);
    const user    = await prisma.user.findFirst({ where: { id: decoded.id, isActive: true, deletedAt: null } });
    if (!user) return error(res, "User not found or inactive", 401);
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") return error(res, "Token expired", 401);
    return error(res, "Invalid token", 401);
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return error(res, "Unauthenticated", 401);
  if (!roles.includes(req.user.role)) return error(res, "Forbidden: insufficient permissions", 403);
  next();
};

module.exports = { authenticate, authorize };
