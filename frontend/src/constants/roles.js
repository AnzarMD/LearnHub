export const ROLES = {
  ADMIN:   "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT:  "parent",
};

export const ROLE_LABELS = {
  admin:   "Administrator",
  teacher: "Teacher",
  student: "Student",
  parent:  "Parent",
};

export const ROLE_COLORS = {
  admin:   "#f59e0b",
  teacher: "#10b981",
  student: "#6366f1",
  parent:  "#f43f5e",
};

export const ROLE_ICONS = {
  admin:   "🔑",
  teacher: "👨‍🏫",
  student: "🎓",
  parent:  "👪",
};

export const DEMO_CREDENTIALS = [
  { label: "Admin",   email: "admin@learnhub.io",   role: "admin",   color: "#f59e0b" },
  { label: "Teacher", email: "teacher@learnhub.io", role: "teacher", color: "#10b981" },
  { label: "Student", email: "student@learnhub.io", role: "student", color: "#6366f1" },
  { label: "Parent",  email: "parent@learnhub.io",  role: "parent",  color: "#f43f5e" },
];

export const DEMO_PASSWORD = "demo123";
