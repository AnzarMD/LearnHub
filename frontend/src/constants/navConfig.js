export const NAV_CONFIG = {
  admin: [
    { id: "dashboard",     label: "Dashboard",       icon: "⊞", path: "/dashboard"          },
    { id: "users",         label: "User Management", icon: "👥", path: "/admin/users"         },
    { id: "courses",       label: "Courses",         icon: "📚", path: "/admin/courses"        },
    { id: "timetable",     label: "Timetable",       icon: "📅", path: "/timetable"            },
    { id: "attendance",    label: "Attendance",      icon: "✓",  path: "/attendance"           },
    { id: "analytics",     label: "Analytics",       icon: "📊", path: "/analytics"            },
    { id: "announcements", label: "Announcements",   icon: "📢", path: "/admin/announcements"  },
    { id: "messages",      label: "Messages",        icon: "💬", path: "/messages"             },
    { id: "logs",          label: "System Logs",     icon: "🗂",  path: "/admin/logs"           },
  ],
  teacher: [
    { id: "dashboard",   label: "Dashboard",  icon: "⊞", path: "/dashboard"           },
    { id: "schedule",    label: "Schedule",   icon: "📅", path: "/teacher/schedule"    },
    { id: "courses",     label: "My Courses", icon: "📚", path: "/teacher/courses"     },
    { id: "assignments", label: "Assignments",icon: "📝", path: "/teacher/assignments" },
    { id: "tests",       label: "Tests",      icon: "🧪", path: "/teacher/tests"       },
    { id: "attendance",  label: "Attendance", icon: "✓",  path: "/attendance"          },
    { id: "grades",      label: "Grades",     icon: "🎯", path: "/teacher/grades"      },
    { id: "analytics",   label: "Analytics",  icon: "📊", path: "/analytics"           },
    { id: "messages",    label: "Messages",   icon: "💬", path: "/messages"            },
  ],
  student: [
    { id: "dashboard",   label: "Dashboard",   icon: "⊞", path: "/dashboard"            },
    { id: "timetable",   label: "Timetable",   icon: "📅", path: "/timetable"            },
    { id: "courses",     label: "My Courses",  icon: "📚", path: "/student/courses"      },
    { id: "assignments", label: "Assignments", icon: "📝", path: "/student/assignments"  },
    { id: "tests",       label: "Tests",       icon: "🧪", path: "/student/tests"        },
    { id: "grades",      label: "Grades",      icon: "🎯", path: "/student/grades"       },
    { id: "attendance",  label: "Attendance",  icon: "✓",  path: "/attendance"           },
    { id: "analytics",   label: "Progress",    icon: "📊", path: "/analytics"            },
    { id: "notes",       label: "Notes",       icon: "📁", path: "/student/notes"        },
    { id: "messages",    label: "Messages",    icon: "💬", path: "/messages"             },
  ],
  parent: [
    { id: "dashboard",   label: "Dashboard",   icon: "⊞", path: "/dashboard"            },
    { id: "attendance",  label: "Attendance",  icon: "✓",  path: "/attendance"           },
    { id: "performance", label: "Performance", icon: "🎯", path: "/parent/performance"   },
    { id: "timetable",   label: "Timetable",   icon: "📅", path: "/timetable"            },
    { id: "messages",    label: "Messages",    icon: "💬", path: "/messages"             },
    { id: "alerts",      label: "Alerts",      icon: "🔔", path: "/parent/alerts"        },
  ],
};

export const SUBJECT_COLORS = {
  "Math 10A":    "#f59e0b",
  "Science 9B":  "#10b981",
  "History 11A": "#6366f1",
  "CS 12B":      "#0ea5e9",
  "Free":        "#64748b",
  "Lunch":       "#94a3b8",
};

export const NOTIF_ICONS = {
  assignment:   "📝",
  grade:        "🎯",
  class:        "🎥",
  announcement: "📢",
  alert:        "⚠️",
};

export const STATUS_COLORS = {
  pending:   "#f59e0b",
  submitted: "#10b981",
  late:      "#f43f5e",
  graded:    "#6366f1",
  active:    "#10b981",
  warning:   "#f59e0b",
  alert:     "#f43f5e",
  inactive:  "#64748b",
};
