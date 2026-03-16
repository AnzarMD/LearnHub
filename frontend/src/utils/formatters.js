/**
 * Format a date string to "Mar 3, 2026"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });
};

/**
 * Format a date to a relative string like "2 days ago"
 */
export const timeAgo = (dateStr) => {
  const now   = Date.now();
  const then  = new Date(dateStr).getTime();
  const diff  = Math.floor((now - then) / 1000);

  if (diff < 60)          return `${diff}s ago`;
  if (diff < 3600)        return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)       return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

/**
 * Format seconds to MM:SS countdown string
 */
export const formatCountdown = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

/**
 * Truncate a string to a max length with ellipsis
 */
export const truncate = (str, max = 40) => {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
};

/**
 * Format a number as a compact label: 1200 → "1.2K"
 */
export const compactNumber = (num) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000)     return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

/**
 * Return a letter grade from a numeric score
 */
export const scoreToGrade = (score) => {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  return "F";
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
