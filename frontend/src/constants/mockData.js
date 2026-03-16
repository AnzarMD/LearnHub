// ─── Mock Users ───────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  { id: 1, name: "Arjun Sharma",  role: "admin",   email: "admin@learnhub.io",   avatar: "AS", phone: "+91 98765 43210" },
  { id: 2, name: "Priya Menon",   role: "teacher",  email: "teacher@learnhub.io", avatar: "PM", phone: "+91 91234 56789", subject: "Physics" },
  { id: 3, name: "Rohan Kapoor",  role: "student",  email: "student@learnhub.io", avatar: "RK", phone: "+91 87654 32109", grade: "10A" },
  { id: 4, name: "Sunita Verma",  role: "parent",   email: "parent@learnhub.io",  avatar: "SV", phone: "+91 76543 21098", childId: 3 },
];

// ─── Mock Analytics ───────────────────────────────────────────────────────────
export const MOCK_ATTENDANCE = [
  { month: "Aug", present: 22, absent: 3, percentage: 88 },
  { month: "Sep", present: 24, absent: 2, percentage: 92 },
  { month: "Oct", present: 20, absent: 5, percentage: 80 },
  { month: "Nov", present: 25, absent: 1, percentage: 96 },
  { month: "Dec", present: 18, absent: 4, percentage: 82 },
  { month: "Jan", present: 23, absent: 3, percentage: 88 },
];

export const MOCK_PERFORMANCE = [
  { subject: "Math",    score: 88, avg: 72, grade: "A" },
  { subject: "Science", score: 92, avg: 78, grade: "A+" },
  { subject: "English", score: 76, avg: 70, grade: "B+" },
  { subject: "History", score: 84, avg: 68, grade: "A" },
  { subject: "CS",      score: 95, avg: 80, grade: "A+" },
];

export const MOCK_ENGAGEMENT = [
  { day: "Mon", logins: 142, completions: 88,  submissions: 34 },
  { day: "Tue", logins: 178, completions: 102, submissions: 51 },
  { day: "Wed", logins: 165, completions: 95,  submissions: 47 },
  { day: "Thu", logins: 198, completions: 118, submissions: 63 },
  { day: "Fri", logins: 155, completions: 87,  submissions: 42 },
  { day: "Sat", logins: 90,  completions: 55,  submissions: 18 },
  { day: "Sun", logins: 72,  completions: 41,  submissions: 12 },
];

export const MOCK_ENROLLMENT_PIE = [
  { name: "Math",    value: 320, color: "#f59e0b" },
  { name: "Science", value: 280, color: "#10b981" },
  { name: "English", value: 250, color: "#6366f1" },
  { name: "History", value: 190, color: "#f43f5e" },
  { name: "CS",      value: 360, color: "#0ea5e9" },
];

export const MOCK_RADAR = [
  { subject: "Math",    A: 88 },
  { subject: "Science", A: 92 },
  { subject: "English", A: 76 },
  { subject: "History", A: 84 },
  { subject: "CS",      A: 95 },
  { subject: "Art",     A: 70 },
];

// ─── Mock Courses ─────────────────────────────────────────────────────────────
export const MOCK_COURSES = [
  { id: 1, name: "Advanced Mathematics",  teacher: "Dr. Mehta",  students: 42, progress: 68, status: "active", color: "#f59e0b", subject: "Math" },
  { id: 2, name: "Physics Fundamentals",  teacher: "Ms. Priya",  students: 38, progress: 45, status: "active", color: "#10b981", subject: "Science" },
  { id: 3, name: "World History",         teacher: "Mr. Sharma", students: 55, progress: 82, status: "active", color: "#6366f1", subject: "History" },
  { id: 4, name: "Computer Science",      teacher: "Dr. Gupta",  students: 61, progress: 30, status: "active", color: "#0ea5e9", subject: "CS" },
];

// ─── Mock Assignments ─────────────────────────────────────────────────────────
export const MOCK_ASSIGNMENTS = [
  { id: 1, title: "Calculus Problem Set 4",      course: "Advanced Math", due: "2026-03-08", status: "pending",   priority: "high",   marks: 20 },
  { id: 2, title: "Lab Report: Motion Dynamics", course: "Physics",       due: "2026-03-10", status: "submitted", priority: "medium", marks: 15 },
  { id: 3, title: "Essay: Industrial Revolution", course: "History",      due: "2026-03-05", status: "late",      priority: "high",   marks: 25 },
  { id: 4, title: "Python OOP Project",          course: "CS",            due: "2026-03-15", status: "pending",   priority: "low",    marks: 30 },
];

// ─── Mock Timetable ───────────────────────────────────────────────────────────
export const MOCK_TIMETABLE = [
  { time: "08:00", mon: "Math 10A",    tue: "Science 9B",  wed: "Math 10A",    thu: "Science 9B",  fri: "Math 10A"    },
  { time: "09:00", mon: "Free",        tue: "Math 10A",    wed: "History 11A", thu: "Math 10A",    fri: "CS 12B"      },
  { time: "10:00", mon: "Science 9B",  tue: "Free",        wed: "Science 9B",  thu: "History 11A", fri: "Free"        },
  { time: "11:00", mon: "CS 12B",      tue: "History 11A", wed: "Free",        thu: "CS 12B",      fri: "Science 9B"  },
  { time: "12:00", mon: "Lunch",       tue: "Lunch",       wed: "Lunch",       thu: "Lunch",       fri: "Lunch"       },
  { time: "13:00", mon: "History 11A", tue: "CS 12B",      wed: "Math 10A",    thu: "Free",        fri: "Math 10A"    },
  { time: "14:00", mon: "Free",        tue: "Science 9B",  wed: "CS 12B",      thu: "Science 9B",  fri: "History 11A" },
];

// ─── Mock Notifications ───────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  { id: 1, type: "assignment",   msg: "New assignment posted in Advanced Math",          time: "2m ago",  read: false },
  { id: 2, type: "grade",        msg: "Your Physics Lab Report has been graded: A-",    time: "1h ago",  read: false },
  { id: 3, type: "class",        msg: "Online class starts in 15 minutes — Physics 9B", time: "14m ago", read: false },
  { id: 4, type: "announcement", msg: "School closed on March 14 (Holi)",               time: "3h ago",  read: true  },
  { id: 5, type: "alert",        msg: "Attendance below 75% in History class",           time: "1d ago",  read: true  },
];

// ─── Mock Messages ────────────────────────────────────────────────────────────
export const MOCK_MESSAGES = [
  { id: 1, from: "Ms. Priya Menon", role: "teacher", msg: "Rohan, please submit the assignment by tomorrow.",    time: "10:32 AM", mine: false },
  { id: 2, from: "You",             role: "student", msg: "Yes Ma'am, I'll submit it tonight.",                  time: "10:45 AM", mine: true  },
  { id: 3, from: "Ms. Priya Menon", role: "teacher", msg: "Great! Also check the new notes I uploaded for you.", time: "10:47 AM", mine: false },
  { id: 4, from: "You",             role: "student", msg: "Sure, will do. Thanks!",                              time: "10:50 AM", mine: true  },
];

// ─── Mock Students ────────────────────────────────────────────────────────────
export const MOCK_STUDENTS = [
  { id: 1, name: "Rahul Singh",   grade: "10A", attendance: 92, gpa: 3.8, status: "active"  },
  { id: 2, name: "Kavya Nair",    grade: "10A", attendance: 88, gpa: 3.5, status: "active"  },
  { id: 3, name: "Aditya Rao",    grade: "9B",  attendance: 71, gpa: 2.9, status: "warning" },
  { id: 4, name: "Sneha Patel",   grade: "11A", attendance: 95, gpa: 4.0, status: "active"  },
  { id: 5, name: "Vikram Joshi",  grade: "12B", attendance: 68, gpa: 2.6, status: "alert"   },
  { id: 6, name: "Meera Iyer",    grade: "10A", attendance: 90, gpa: 3.6, status: "active"  },
  { id: 7, name: "Aryan Kapoor",  grade: "11A", attendance: 78, gpa: 3.2, status: "active"  },
];

// ─── Mock Test Questions ──────────────────────────────────────────────────────
export const MOCK_TEST_QUESTIONS = [
  { id: 1, q: "What is the derivative of sin(x)?",    options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],                correct: 0 },
  { id: 2, q: "Which planet is closest to the Sun?",  options: ["Venus", "Earth", "Mercury", "Mars"],                   correct: 2 },
  { id: 3, q: "The speed of light is approximately:", options: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], correct: 0 },
  { id: 4, q: "Who wrote 'Pride and Prejudice'?",     options: ["C. Brontë", "J. Austen", "G. Eliot", "V. Woolf"],      correct: 1 },
  { id: 5, q: "What does CPU stand for?",             options: ["Central Process Unit", "Computer Processing Unit", "Central Processing Unit", "Core Processing Unit"], correct: 2 },
  { id: 6, q: "Newton's second law states F = ?",     options: ["m/a", "ma", "m+a", "m²a"],                             correct: 1 },
  { id: 7, q: "The SI unit of electric current is:", options: ["Volt", "Ohm", "Ampere", "Watt"],                        correct: 2 },
];

// ─── Mock Notes ───────────────────────────────────────────────────────────────
export const MOCK_NOTES = [
  { id: 1, subject: "Mathematics", title: "Calculus – Differentiation Rules",  type: "PDF",   size: "2.4 MB", date: "Mar 1",  color: "#f59e0b", version: "v3" },
  { id: 2, subject: "Physics",     title: "Newton's Laws of Motion",           type: "PDF",   size: "1.8 MB", date: "Feb 28", color: "#10b981", version: "v2" },
  { id: 3, subject: "Physics",     title: "Lab Recording – Wave Optics",       type: "Video", size: "128 MB", date: "Feb 25", color: "#10b981", version: "v1" },
  { id: 4, subject: "History",     title: "Industrial Revolution Notes",       type: "PDF",   size: "3.1 MB", date: "Feb 22", color: "#6366f1", version: "v4" },
  { id: 5, subject: "CS",          title: "Python OOP Guide",                  type: "PDF",   size: "1.2 MB", date: "Feb 20", color: "#0ea5e9", version: "v2" },
  { id: 6, subject: "English",     title: "Essay Writing Techniques",          type: "PDF",   size: "0.9 MB", date: "Feb 18", color: "#f43f5e", version: "v1" },
];

// ─── Mock System Logs ─────────────────────────────────────────────────────────
export const MOCK_LOGS = [
  { id: 1, level: "info",    msg: "User login: admin@learnhub.io",                  time: "2026-03-03 09:14:22", ip: "192.168.1.10" },
  { id: 2, level: "warning", msg: "Failed login attempt: unknown@email.com",        time: "2026-03-03 09:18:05", ip: "103.45.67.89" },
  { id: 3, level: "info",    msg: "New course created: Python Advanced",            time: "2026-03-03 09:45:11", ip: "192.168.1.22" },
  { id: 4, level: "error",   msg: "File upload failed: max size exceeded",          time: "2026-03-03 10:12:33", ip: "192.168.1.15" },
  { id: 5, level: "info",    msg: "Attendance report exported by teacher@...",      time: "2026-03-03 10:30:00", ip: "192.168.1.11" },
  { id: 6, level: "info",    msg: "Student Rohan Kapoor joined class: Physics 9B",  time: "2026-03-03 10:45:22", ip: "192.168.1.30" },
];

// ─── Mock Contacts ────────────────────────────────────────────────────────────
export const MOCK_CONTACTS = [
  { id: 1, name: "Ms. Priya Menon",   role: "Teacher · Physics",   avatar: "PM", online: true  },
  { id: 2, name: "Class Group 10A",   role: "42 members",           avatar: "10", online: true  },
  { id: 3, name: "Dr. Mehta",         role: "Teacher · Math",       avatar: "DM", online: false },
  { id: 4, name: "Mr. Sharma",        role: "Teacher · History",    avatar: "SS", online: false },
  { id: 5, name: "Sunita Verma",      role: "Parent · Rohan K.",    avatar: "SV", online: true  },
];
