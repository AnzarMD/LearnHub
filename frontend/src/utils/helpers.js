/**
 * Deep clone an object / array (JSON-safe values only)
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Debounce a function
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Get initials from a full name ("Priya Menon" → "PM")
 */
export const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

/**
 * Paginate an array
 */
export const paginate = (arr, page = 1, pageSize = 10) => {
  const start = (page - 1) * pageSize;
  return arr.slice(start, start + pageSize);
};

/**
 * Generate a random hex color
 */
export const randomColor = () =>
  "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");

/**
 * Sort array of objects by key
 */
export const sortBy = (arr, key, asc = true) =>
  [...arr].sort((a, b) =>
    asc ? (a[key] > b[key] ? 1 : -1) : (a[key] < b[key] ? 1 : -1)
  );

/**
 * Filter array by search term across given keys
 */
export const searchFilter = (arr, term, keys) => {
  if (!term) return arr;
  const lower = term.toLowerCase();
  return arr.filter((item) =>
    keys.some((k) => String(item[k] ?? "").toLowerCase().includes(lower))
  );
};

/**
 * Build a full name display with role badge label
 */
export const userLabel = (user) =>
  user ? `${user.name} (${user.role})` : "Unknown User";

/**
 * Check if JWT stored in localStorage is still fresh
 * (frontend-only naive check — real check is on the server)
 */
export const isTokenFresh = () => {
  const token = localStorage.getItem(
    import.meta.env.VITE_JWT_KEY || "learnhub_jwt_token"
  );
  return Boolean(token);
};
