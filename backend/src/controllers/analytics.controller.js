"use strict";
const asyncHandler     = require("../utils/asyncHandler");
const { success }      = require("../utils/response");
const analyticsService = require("../services/analytics.service");
const prisma           = require("../config/database");

const getPlatformOverview = asyncHandler(async (req, res) => {
  const data = await analyticsService.getPlatformOverview();
  success(res, data);
});

const getAttendanceTrends = asyncHandler(async (req, res) => {
  const data = await analyticsService.getAttendanceTrends(
    parseInt(req.query.months || "6", 10),
    req.query.classId || null
  );
  success(res, { trends: data });
});

const getMyPerformance = asyncHandler(async (req, res) => {
  const data = await analyticsService.getPerformanceTrends(req.user.id);
  success(res, { performance: data });
});

const getEngagement = asyncHandler(async (req, res) => {
  const data = await analyticsService.getEngagementMetrics(parseInt(req.query.days || "7", 10));
  success(res, { engagement: data });
});

const getSubjectStats = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSubjectStats();
  success(res, { subjects: data });
});

const getActivityLogs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = require("../utils/pagination").parsePagination(req.query);
  const where = {
    ...(req.query.level  && { level: req.query.level }),
    ...(req.query.action && { action: { contains: req.query.action, mode: "insensitive" } }),
  };
  const [total, items] = await Promise.all([
    prisma.activityLog.count({ where }),
    prisma.activityLog.findMany({
      where,
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
  ]);
  require("../utils/response").paginated(res, items, total, page, limit);
});

module.exports = { getPlatformOverview, getAttendanceTrends, getMyPerformance, getEngagement, getSubjectStats, getActivityLogs };
