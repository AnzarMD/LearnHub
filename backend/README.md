# LearnHub — Backend API

Production-ready Node.js/Express REST API + Socket.io backend for the LearnHub EdTech Platform.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Database | PostgreSQL 16 |
| ORM | Prisma 5 |
| Auth | JWT (access + refresh tokens) |
| Passwords | bcryptjs |
| Validation | Joi |
| Real-time | Socket.io 4 |
| File upload | Multer |
| Email | Nodemailer |
| Logging | Winston + Morgan |
| Docs | Swagger/OpenAPI 3.0 |
| Security | Helmet, CORS, Rate Limiting |
| Container | Docker + docker-compose |

---

## Quick Start (Local — No Docker)

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 16 running locally
- (Optional) Redis

### 2. Create database

```sql
psql -U postgres
CREATE USER learnhub WITH PASSWORD 'learnhub123';
CREATE DATABASE learnhub_db OWNER learnhub;
GRANT ALL PRIVILEGES ON DATABASE learnhub_db TO learnhub;
```

### 3. Setup

```bash
cd backend
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT secrets
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

API is live at: **http://localhost:8000/api/v1**
Swagger docs at: **http://localhost:8000/api/v1/docs**

---

## Quick Start (Docker)

```bash
cd backend
cp .env.example .env
docker-compose up --build
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend API on port 8000

Run migrations and seed inside Docker:
```bash
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend node prisma/seed.js
```

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@learnhub.io | demo123 |
| Teacher | teacher@learnhub.io | demo123 |
| Student | student@learnhub.io | demo123 |
| Parent | parent@learnhub.io | demo123 |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `PORT` | Server port | 8000 |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `JWT_ACCESS_SECRET` | Access token secret | — |
| `JWT_REFRESH_SECRET` | Refresh token secret | — |
| `JWT_ACCESS_EXPIRES` | Access token TTL | 15m |
| `JWT_REFRESH_EXPIRES` | Refresh token TTL | 7d |
| `SMTP_HOST` | Email SMTP host | — |
| `SMTP_USER` | Email address | — |
| `SMTP_PASS` | Email app password | — |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 |
| `CORS_ORIGINS` | Allowed frontend URLs | http://localhost:5173 |
| `SWAGGER_ENABLED` | Show Swagger UI | true |

---

## API Reference

### Auth `POST /api/v1/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /register | Register new user |
| POST | /login | Login → access + refresh token |
| POST | /refresh | Refresh access token |
| POST | /logout | Revoke refresh token |
| GET | /verify-email?token= | Verify email address |
| POST | /forgot-password | Send reset email |
| POST | /reset-password | Reset with token |
| POST | /change-password | Change password (auth required) |

### Users `GET /api/v1/users`

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | /me | All | My profile |
| PATCH | /me/avatar | All | Upload avatar |
| GET | / | Admin | List all users |
| GET | /:id | Admin | Get user |
| PATCH | /:id | Admin | Update user |
| DELETE | /:id | Admin | Soft-delete user |
| POST | /assign-class | Admin | Assign student to class |
| POST | /link-parent | Admin | Link parent to student |

### Classes `GET /api/v1/classes`

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | / | All | List classes |
| GET | /:id | All | Class detail + students |
| POST | / | Admin | Create class |
| PATCH | /:id | Admin | Update class |
| POST | /:id/teachers | Admin | Assign teacher |

### Timetable `GET /api/v1/timetable`

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | /me | All | My schedule |
| GET | /class/:classId | All | Class timetable |
| POST | / | Admin | Create timetable |
| POST | /:id/slots | Admin | Add slot (conflict detection) |
| POST | /sessions | Teacher | Create class session |
| PATCH | /sessions/:id/start | Teacher | Start live class |
| PATCH | /sessions/:id/end | Teacher | End live class |

### Attendance `GET /api/v1/attendance`

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | /me | Student | My attendance summary |
| GET | /session/:id | Teacher/Admin | Session attendance |
| GET | /student/:profileId | Teacher/Admin/Parent | Student summary |
| POST | /mark | Teacher/Admin | Mark attendance records |

### Assignments `GET /api/v1/assignments`

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | / | All | List assignments |
| GET | /mine | Student | My submissions |
| GET | /:id | All | Assignment detail |
| POST | / | Teacher | Create (with file upload) |
| POST | /:id/submit | Student | Submit (with file upload) |
| PATCH | /submissions/:id/grade | Teacher | Grade submission |
| DELETE | /:id | Teacher | Soft-delete |

### Tests `GET /api/v1/tests`

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | / | All | List tests |
| GET | /:id | Student | Get test (no answers) |
| GET | /:id/result | Student | My attempt result |
| POST | / | Teacher | Create test |
| POST | /:id/questions | Teacher | Add questions |
| POST | /:id/publish | Teacher | Publish test |
| POST | /:id/start | Student | Start attempt |
| POST | /:id/submit | Student | Submit answers |

### Analytics `GET /api/v1/analytics`

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | /overview | Admin | Platform KPIs |
| GET | /attendance | All | Attendance trends |
| GET | /performance | Student | My subject performance |
| GET | /engagement | Admin/Teacher | Daily engagement |
| GET | /subjects | Admin/Teacher | Subject completion rates |
| GET | /logs | Admin | Activity audit log |

### Notifications `GET /api/v1/notifications`

| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | / | All | My notifications |
| PATCH | /:id/read | All | Mark one as read |
| PATCH | /read-all | All | Mark all as read |
| POST | /announce | Teacher/Admin | Send class announcement |

### Messages `GET /api/v1/messages`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /conversations | My conversations |
| POST | /conversations/direct | Get or create DM |
| GET | /conversations/:id | Get messages |
| POST | /conversations/:id/send | Send message |
| DELETE | /messages/:id | Delete (soft) |

---

## Socket.io Events

Connect with: `{ auth: { token: "<accessToken>" } }`

### Live Class

| Event (emit) | Payload | Description |
|--------------|---------|-------------|
| `class:start` | `{ sessionId }` | Teacher starts class |
| `class:join` | `{ sessionId }` | Student joins (auto-attendance) |
| `class:leave` | `{ sessionId }` | Student leaves |
| `class:end` | `{ sessionId }` | Teacher ends class |
| `class:message` | `{ sessionId, content }` | Class group chat |

| Event (on) | Description |
|------------|-------------|
| `class:started` | Class went live |
| `class:student-joined` | Student joined |
| `class:student-left` | Student left |
| `class:ended` | Class ended |

### Private Chat

| Event (emit) | Payload | Description |
|--------------|---------|-------------|
| `chat:join` | `{ conversationId }` | Join room |
| `chat:send` | `{ conversationId, content }` | Send message |
| `chat:typing` | `{ conversationId }` | Typing indicator |
| `chat:read` | `{ conversationId }` | Mark read |

| Event (on) | Description |
|------------|-------------|
| `message:new` | New message received |
| `chat:typing` | Other user is typing |

### Notifications

| Event (on) | Description |
|------------|-------------|
| `notification:new` | Push notification |

---

## Folder Structure

```
backend/
├── src/
│   ├── app.js                  Express app config
│   ├── config/
│   │   ├── database.js         Prisma client
│   │   ├── logger.js           Winston logger
│   │   └── swagger.js          OpenAPI config
│   ├── controllers/            Route handlers
│   ├── services/               Business logic
│   ├── routes/                 Express routers
│   ├── middleware/
│   │   ├── auth.js             JWT authenticate + authorize
│   │   ├── validate.js         Joi validation
│   │   ├── upload.js           Multer file handling
│   │   ├── rateLimiter.js      Rate limiting
│   │   ├── errorHandler.js     Global error handler
│   │   └── activityLogger.js   Audit trail
│   ├── models/
│   │   └── schemas.js          All Joi schemas
│   ├── sockets/
│   │   ├── index.js            Socket.io init + auth
│   │   ├── class.socket.js     Live class events
│   │   ├── chat.socket.js      Private messaging
│   │   └── notification.socket.js
│   └── utils/
│       ├── asyncHandler.js     Async route wrapper
│       ├── response.js         Standardised responses
│       ├── jwt.js              Token helpers
│       ├── email.js            Nodemailer helpers
│       ├── pagination.js       Page/limit helpers
│       └── grade.js            Grade + attendance calc
├── prisma/
│   ├── schema.prisma           Database schema
│   └── seed.js                 Demo data seeder
├── scripts/
│   ├── backup.js               pg_dump backup
│   └── restore.js              pg_restore from file
├── uploads/                    File storage
├── server.js                   HTTP server entry point
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## Database Schema Overview

```
User → StudentProfile / TeacherProfile / ParentProfile / AdminProfile
User → RefreshToken

StudentProfile → Class
StudentProfile → Attendance
StudentProfile → Submission → Assignment
StudentProfile → TestAttempt → QuestionResponse → Question → Test
StudentProfile ← ParentStudentLink → ParentProfile

TeacherProfile → TimetableSlot → ClassSession → Attendance
TeacherProfile → Assignment
TeacherProfile → Test

Class → TimetableSlot
Subject → Assignment / Test / Grade / TimetableSlot

Notification → User
Message → Conversation → ConversationParticipant
ActivityLog → User
```

---

## Useful Commands

```bash
# Development
npm run dev               # Start with nodemon

# Database
npm run db:migrate        # Run pending migrations
npm run db:generate       # Regenerate Prisma client
npm run db:seed           # Seed demo data
npm run db:studio         # Open Prisma Studio (browser GUI)
npm run db:reset          # Drop + recreate + seed

# Maintenance
node scripts/backup.js    # Backup database
node scripts/restore.js backups/file.sql  # Restore backup
```

---

## Connecting to the Frontend

Update the frontend `.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_SOCKET_URL=http://localhost:8000
VITE_MOCK_API=false
VITE_ENABLE_SOCKET=true
```

The frontend auth service will:
1. `POST /api/v1/auth/login` → receive `accessToken` in response body
2. Store `accessToken` in memory / `localStorage`
3. Attach `Authorization: Bearer <token>` to every request
4. Call `POST /api/v1/auth/refresh` when a 401 is received
5. Connect Socket.io with `{ auth: { token } }`
