# LearnHub — Full-Stack EdTech Platform

A production-ready, full-stack EdTech platform built with **React + Node.js + PostgreSQL**.  
Supports **Admin**, **Teacher**, **Student**, and **Parent** roles with real-time features, analytics, online tests, attendance tracking, and messaging.

---



## Project Overview

LearnHub is a complete EdTech platform. The codebase is split into two separate projects:

```
LearnHub/
├── learnhub-frontend/
│   └── frontend/         ← React + Vite + TailwindCSS + Redux
└── learnhub-backend/
    └── backend/          ← Node.js + Express + PostgreSQL + Prisma
```

Both run independently on different ports and communicate over HTTP (REST API) and WebSocket (Socket.io).

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api/v1 |
| Swagger Docs | http://localhost:8000/api/v1/docs |
| Prisma Studio | http://localhost:5555 |

---

## Tech Stack

### Frontend
| Category | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| State Management | Redux Toolkit |
| Routing | React Router (in App.jsx) |
| Styling | TailwindCSS 3 |
| Charts | Recharts |
| HTTP Client | Axios |
| Real-time | Socket.io-client |
| Font | Outfit (Google Fonts) |

### Backend
| Category | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js 4 |
| Database | PostgreSQL 15+ |
| ORM | Prisma 5 |
| Authentication | JWT (access + refresh tokens) |
| Password Hashing | bcryptjs |
| Validation | Joi |
| Real-time | Socket.io 4 |
| File Uploads | Multer |
| Email | Nodemailer |
| Logging | Winston + Morgan |
| API Docs | Swagger / OpenAPI 3.0 |
| Security | Helmet, CORS, express-rate-limit |
| Containers | Docker + Docker Compose |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                             │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐    │
│   │              React Frontend  :5173                    │    │
│   │                                                       │    │
│   │   Redux Store ──► Axios ──────────────► REST API      │    │
│   │   ThemeContext                                        │    │
│   │   AuthContext  ──► Socket.io ─────────► WebSocket     │    │
│   └───────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                           │ HTTP / WS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Node.js Backend  :8000                      │
│                                                                 │
│  Express App                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Routes  │  │Middleware│  │Controllers│  │   Services   │   │
│  │  /api/v1 │─►│ JWT Auth │─►│ (thin)   │─►│ (all logic)  │   │
│  │          │  │ Validate │  │          │  │              │   │
│  │          │  │ RateLimit│  │          │  │              │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────┬───────┘   │
│                                                    │           │
│  Socket.io                                         ▼           │
│  ┌─────────────────────────┐              ┌──────────────┐     │
│  │  class.socket           │              │  Prisma ORM  │     │
│  │  chat.socket            │              └──────┬───────┘     │
│  │  notification.socket    │                     │             │
│  └─────────────────────────┘                     ▼             │
└─────────────────────────────────────────────────────────────────┘
                                             │
                    ┌────────────────────────┘
                    ▼
        ┌─────────────────────┐
        │   PostgreSQL  :5432  │
        │   learnhub_db        │
        └─────────────────────┘
```

---

## Prerequisites

Install these before starting:

| Tool | Version | Download |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | comes with Node |
| PostgreSQL | 15+ | https://www.postgresql.org/download |
| Git | any | https://git-scm.com |

To verify your installations:
```bash
node --version     # should print v18.x.x or higher
npm --version      # should print 9.x.x or higher
psql --version     # should print psql (PostgreSQL) 15.x or higher
```

---

## Project Structure

### Backend
```
backend/
├── src/
│   ├── app.js                    ← Express app, all middleware + routes mounted
│   ├── config/
│   │   ├── database.js           ← Prisma client instance
│   │   ├── logger.js             ← Winston logger (console + file)
│   │   └── swagger.js            ← OpenAPI 3.0 spec config
│   │
│   ├── controllers/              ← Thin HTTP handlers, no business logic
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── assignment.controller.js
│   │   ├── attendance.controller.js
│   │   ├── test.controller.js
│   │   ├── timetable.controller.js
│   │   ├── notification.controller.js
│   │   ├── message.controller.js
│   │   └── analytics.controller.js
│   │
│   ├── services/                 ← All business logic lives here
│   │   ├── auth.service.js       ← register, login, tokens, password reset
│   │   ├── user.service.js       ← CRUD, class assignment, parent linking
│   │   ├── assignment.service.js ← create, submit, grade
│   │   ├── attendance.service.js ← mark, auto-mark via socket, alerts
│   │   ├── test.service.js       ← create, publish, attempt, auto-submit, grade
│   │   ├── timetable.service.js  ← slots with conflict detection, sessions
│   │   ├── notification.service.js ← send, push via socket, mark read
│   │   ├── message.service.js    ← conversations, send, push via socket
│   │   └── analytics.service.js  ← overview, trends, engagement, grades
│   │
│   ├── routes/                   ← Express routers with RBAC per endpoint
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── class.routes.js
│   │   ├── subject.routes.js
│   │   ├── timetable.routes.js
│   │   ├── attendance.routes.js
│   │   ├── assignment.routes.js
│   │   ├── test.routes.js
│   │   ├── note.routes.js
│   │   ├── notification.routes.js
│   │   ├── message.routes.js
│   │   └── analytics.routes.js
│   │
│   ├── middleware/
│   │   ├── auth.js               ← authenticate (JWT) + authorize(roles)
│   │   ├── validate.js           ← Joi schema validation
│   │   ├── upload.js             ← Multer disk storage + file filter
│   │   ├── rateLimiter.js        ← default + auth + upload limiters
│   │   ├── errorHandler.js       ← global error handler + Prisma error codes
│   │   └── activityLogger.js     ← non-blocking audit trail middleware
│   │
│   ├── models/
│   │   └── schemas.js            ← All Joi validation schemas
│   │
│   ├── sockets/
│   │   ├── index.js              ← Socket.io init, JWT auth, room assignment
│   │   ├── class.socket.js       ← start/join/leave/end class, auto-attendance
│   │   ├── chat.socket.js        ← join/send/typing/read in conversations
│   │   └── notification.socket.js ← mark-read events
│   │
│   └── utils/
│       ├── asyncHandler.js       ← wraps async route fns, eliminates try/catch
│       ├── response.js           ← success(), created(), paginated(), error()
│       ├── jwt.js                ← signAccess, signRefresh, verify helpers
│       ├── email.js              ← Nodemailer: verify, reset, low-attendance alert
│       ├── pagination.js         ← parsePagination(), buildSearch()
│       └── grade.js              ← scoreToGrade(), calcAttendancePct()
│
├── prisma/
│   ├── schema.prisma             ← 18 models, full relations, indexes, enums
│   └── seed.js                   ← Seeds all 4 roles, class, timetable, tests, grades
│
├── scripts/
│   ├── backup.js                 ← pg_dump to timestamped .sql file
│   └── restore.js                ← pg_restore from backup file
│
├── uploads/                      ← Uploaded files (gitignored)
│   ├── notes/
│   ├── assignments/
│   ├── submissions/
│   └── avatars/
│
├── server.js                     ← HTTP server, Socket.io init, graceful shutdown
├── Dockerfile
├── docker-compose.yml            ← PostgreSQL + Redis + Backend
├── .env.example
└── package.json
```

### Frontend
```
frontend/
├── src/
│   ├── App.jsx                   ← Role-based routing, page mapping
│   ├── main.jsx                  ← React root, all providers
│   ├── index.css                 ← Tailwind + custom animations
│   │
│   ├── constants/
│   │   ├── mockData.js           ← All mock data (used when VITE_MOCK_API=true)
│   │   ├── roles.js              ← ROLES enum, demo credentials, colors
│   │   ├── routes.js             ← Route name constants
│   │   └── navConfig.js          ← Sidebar nav items per role
│   │
│   ├── context/
│   │   ├── AuthContext.jsx       ← User state, login/logout, role switching
│   │   ├── ThemeContext.jsx      ← Dark/light mode with localStorage
│   │   └── NotificationContext.jsx ← Toast API, in-app notifications
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   ├── useNotifications.js
│   │   ├── useTimer.js           ← Countdown timer for online tests
│   │   └── useLocalStorage.js
│   │
│   ├── services/
│   │   ├── api.js                ← Axios instance, auth interceptor, 401 handler
│   │   ├── authService.js        ← login, register, logout, refresh
│   │   ├── userService.js        ← CRUD, avatar
│   │   ├── attendanceService.js  ← summary, mark, export
│   │   ├── assignmentService.js  ← list, submit, grade
│   │   ├── testService.js        ← list, start, submit
│   │   └── notificationService.js ← list, mark-read
│   │
│   ├── store/
│   │   ├── index.js              ← Redux configureStore
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── uiSlice.js
│   │       ├── notificationSlice.js
│   │       └── courseSlice.js
│   │
│   ├── layouts/
│   │   ├── AuthLayout.jsx        ← Centered auth pages with gradient blobs
│   │   └── DashboardLayout.jsx   ← Sidebar + Topbar + main content
│   │
│   ├── components/
│   │   ├── common/               ← Button, StatCard, ChartCard, Badge, Modal, Toast, Loader
│   │   ├── layout/               ← Sidebar, Topbar
│   │   ├── charts/               ← AttendanceChart, PerformanceChart, EngagementChart, etc.
│   │   └── dashboard/            ← CourseCard, AssignmentItem, StudentRow
│   │
│   └── pages/
│       ├── auth/                 ← LoginPage, RegisterPage, ForgotPasswordPage
│       ├── admin/                ← AdminDashboard, UserManagement, SystemLogs
│       ├── teacher/              ← TeacherDashboard, Grades
│       ├── student/              ← StudentDashboard, OnlineTest, NotesPage
│       ├── parent/               ← ParentDashboard
│       └── shared/               ← TimetablePage, AnalyticsPage, MessagesPage, AttendancePage
│
├── public/
├── index.html
├── vite.config.js                ← Path aliases (@components, @pages, etc.)
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── package.json
```

---
