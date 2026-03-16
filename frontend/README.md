# LearnHub — EdTech Platform Frontend

Production-ready React frontend for a full EdTech platform supporting **Admin**, **Teacher**, **Student**, and **Parent** roles.

---

## 🚀 Quick Start

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Demo Credentials** (password: `demo123`):

| Role    | Email                  |
|---------|------------------------|
| Admin   | admin@learnhub.io      |
| Teacher | teacher@learnhub.io    |
| Student | student@learnhub.io    |
| Parent  | parent@learnhub.io     |

---

## 🗂 Folder Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/           # Shared UI: Button, StatCard, ChartCard, Badge, Modal, Toast, Loader
│   │   ├── layout/           # Sidebar, Topbar
│   │   ├── charts/           # Recharts wrappers: Attendance, Performance, Engagement, Pie, Radar
│   │   └── dashboard/        # Role-specific cards: CourseCard, AssignmentItem, StudentRow
│   ├── pages/
│   │   ├── auth/             # LoginPage, RegisterPage, ForgotPasswordPage
│   │   ├── admin/            # AdminDashboard, UserManagement, SystemLogs
│   │   ├── teacher/          # TeacherDashboard, Grades
│   │   ├── student/          # StudentDashboard, OnlineTest, NotesPage
│   │   ├── parent/           # ParentDashboard
│   │   └── shared/           # TimetablePage, AnalyticsPage, MessagesPage, AttendancePage
│   ├── layouts/
│   │   ├── AuthLayout.jsx    # Centered card layout with ambient background
│   │   └── DashboardLayout.jsx # Sidebar + Topbar shell
│   ├── hooks/
│   │   ├── useAuth.js        # Re-export from AuthContext
│   │   ├── useTheme.js       # Re-export from ThemeContext
│   │   ├── useNotifications.js
│   │   ├── useTimer.js       # Countdown timer for tests
│   │   └── useLocalStorage.js
│   ├── services/             # Axios-based API layer (mock-ready)
│   │   ├── api.js            # Axios base config + interceptors
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── attendanceService.js
│   │   ├── assignmentService.js
│   │   ├── testService.js
│   │   └── notificationService.js
│   ├── store/
│   │   ├── index.js          # Redux store root
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── uiSlice.js
│   │       ├── notificationSlice.js
│   │       └── courseSlice.js
│   ├── context/
│   │   ├── ThemeContext.jsx  # Dark/light mode
│   │   ├── AuthContext.jsx   # JWT auth state
│   │   └── NotificationContext.jsx # Toasts + in-app notifs
│   ├── router/
│   │   └── ProtectedRoute.jsx
│   ├── utils/
│   │   ├── formatters.js     # Date, countdown, grade helpers
│   │   ├── validators.js     # Form validation
│   │   └── helpers.js        # Debounce, paginate, search filter
│   ├── constants/
│   │   ├── mockData.js       # All mock data
│   │   ├── roles.js          # Role enums, colors, demo creds
│   │   ├── routes.js         # Route path constants
│   │   └── navConfig.js      # Role-based nav items, subject colors
│   ├── App.jsx               # Root with page routing
│   ├── main.jsx              # React + Redux entry point
│   └── index.css             # Tailwind + global styles
├── index.html
├── vite.config.js            # Path aliases (@components, @pages, etc.)
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env.example
└── README.md
```

---

## 🧰 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + Vite | UI framework + dev server |
| TailwindCSS | Utility-first styling |
| Redux Toolkit | Global state management |
| React Context | Auth, Theme, Notifications |
| Axios | HTTP client with interceptors |
| Recharts | Analytics charts |
| Socket.io-client | Real-time (mock-ready) |

---

## 👥 Role-Based Features

### 🔑 Admin
- Stats overview dashboard
- User management (CRUD table with search/filter)
- Engagement & enrollment analytics
- System logs viewer with level filtering
- Timetable, attendance, announcements

### 👨‍🏫 Teacher
- Class performance & attendance charts
- Course cards with Start Class / Upload actions
- Grading panel with score submission
- Assignment management, test creation
- Schedule, messages

### 🎓 Student
- Radar chart for subject scores
- Assignment tracker with submission
- Full timed online test (5 min, auto-submit, shuffle, review)
- Notes & resources with subject filter
- Today's live class schedule with Join button

### 👪 Parent
- Child academic overview banner
- Attendance & performance charts
- Alert panel (low attendance, late submissions)
- Teacher messaging
- Timetable view

---

## 🔌 Connecting to Backend

All API calls live in `src/services/`. Each service has two modes:

```js
// When VITE_MOCK_API=true  → returns mock data instantly
// When VITE_MOCK_API=false → calls real REST endpoint via Axios
```

To switch to real API:
1. Set `VITE_MOCK_API=false` in `.env`
2. Set `VITE_API_BASE_URL=https://your-api.com/api`
3. Each service function maps 1:1 to a REST endpoint

### API endpoint map

| Service | Endpoint |
|---------|----------|
| `loginUser` | `POST /auth/login` |
| `registerUser` | `POST /auth/register` |
| `getAllStudents` | `GET /users?role=student` |
| `markAttendance` | `POST /attendance/mark` |
| `submitAssignment` | `POST /assignments/:id/submit` |
| `submitTest` | `POST /tests/:id/submit` |
| `getNotifications` | `GET /notifications` |

### Socket.io (real-time)

```js
// src/services/notificationService.js
subscribeToNotifications(socket, userId, callback)
```

Set `VITE_ENABLE_SOCKET=true` and `VITE_SOCKET_URL` to activate.

---

## 🎨 Theming

Dark mode is the default. Toggle via the ☀️/🌙 button in the topbar. Preference persists in `localStorage`.

Custom theme tokens live in `tailwind.config.js` under `theme.extend.colors`.

---

## 🏗 Path Aliases

Configured in `vite.config.js`:

```js
"@"            → src/
"@components"  → src/components/
"@pages"       → src/pages/
"@layouts"     → src/layouts/
"@hooks"       → src/hooks/
"@services"    → src/services/
"@store"       → src/store/
"@context"     → src/context/
"@utils"       → src/utils/
"@constants"   → src/constants/
```

---

## 📦 Build

```bash
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

---

## 🔮 What's Next (Backend)

When you're ready to generate the backend, it should expose:
- REST API at `/api` (Node/Express or FastAPI recommended)
- JWT auth with refresh tokens
- Mongoose/PostgreSQL models for: User, Course, Assignment, Test, Attendance, Notification, Message
- Socket.io server for real-time notifications and class chat
- File upload endpoint (Multer/S3) for notes and assignment submissions

---

*Frontend only — backend generation pending explicit instruction.*
