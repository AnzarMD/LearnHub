"use strict";
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt           = require("bcryptjs");

const prisma = new PrismaClient();
const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);

async function main() {
  console.log("🌱 Seeding LearnHub database...");

  // ── Academic Year ──────────────────────────────────────────────────────────
  const year = await prisma.academicYear.upsert({
    where:  { id: "year-2025" },
    update: {},
    create: {
      id:        "year-2025",
      name:      "2025-26",
      startDate: new Date("2025-06-01"),
      endDate:   new Date("2026-03-31"),
      isCurrent: true,
    },
  });
  console.log("✅ Academic year:", year.name);

  // ── Subjects ──────────────────────────────────────────────────────────────
  const subjects = await Promise.all([
    prisma.subject.upsert({ where: { code: "MATH10" }, update: {}, create: { code: "MATH10", name: "Mathematics", description: "Advanced Math", credits: 5 } }),
    prisma.subject.upsert({ where: { code: "SCI10"  }, update: {}, create: { code: "SCI10",  name: "Science",     description: "Physics & Chemistry", credits: 4 } }),
    prisma.subject.upsert({ where: { code: "ENG10"  }, update: {}, create: { code: "ENG10",  name: "English",     description: "Language & Literature", credits: 4 } }),
    prisma.subject.upsert({ where: { code: "HIST10" }, update: {}, create: { code: "HIST10", name: "History",     description: "World History", credits: 3 } }),
    prisma.subject.upsert({ where: { code: "CS10"   }, update: {}, create: { code: "CS10",   name: "Computer Science", description: "Programming & Logic", credits: 4 } }),
  ]);
  console.log("✅ Subjects:", subjects.map((s) => s.name).join(", "));

  // ── Class ─────────────────────────────────────────────────────────────────
  const cls = await prisma.class.upsert({
    where:  { name_academicYearId: { name: "10A", academicYearId: year.id } },
    update: {},
    create: { name: "10A", grade: "10", section: "A", academicYearId: year.id, roomNumber: "R-101" },
  });
  console.log("✅ Class:", cls.name);

  const hash = await bcrypt.hash("demo123", ROUNDS);

  // ── Admin ─────────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where:  { email: "admin@learnhub.io" },
    update: {},
    create: {
      email: "admin@learnhub.io", password: hash,
      firstName: "Alex", lastName: "Admin",
      role: "ADMIN", isEmailVerified: true, isActive: true,
      adminProfile: { create: { department: "IT" } },
    },
  });

  // ── Teacher ───────────────────────────────────────────────────────────────
  const teacher = await prisma.user.upsert({
    where:  { email: "teacher@learnhub.io" },
    update: {},
    create: {
      email: "teacher@learnhub.io", password: hash,
      firstName: "Taylor", lastName: "Smith",
      role: "TEACHER", isEmailVerified: true, isActive: true,
      teacherProfile: {
        create: {
          employeeId:   "EMP-001",
          qualification: "M.Sc. Mathematics",
          subjects: {
            create: subjects.map((s) => ({ subjectId: s.id })),
          },
        },
      },
    },
    include: { teacherProfile: true },
  });

  // ── Student ───────────────────────────────────────────────────────────────
  const student = await prisma.user.upsert({
    where:  { email: "student@learnhub.io" },
    update: {},
    create: {
      email: "student@learnhub.io", password: hash,
      firstName: "Sam", lastName: "Student",
      role: "STUDENT", isEmailVerified: true, isActive: true,
      studentProfile: {
        create: {
          rollNumber: "ROLL-2025-001",
          classId:    cls.id,
          dateOfBirth: new Date("2010-05-15"),
          gender:     "MALE",
        },
      },
    },
    include: { studentProfile: true },
  });

  // ── Parent ────────────────────────────────────────────────────────────────
  const parent = await prisma.user.upsert({
    where:  { email: "parent@learnhub.io" },
    update: {},
    create: {
      email: "parent@learnhub.io", password: hash,
      firstName: "Pat", lastName: "Parent",
      role: "PARENT", isEmailVerified: true, isActive: true,
      parentProfile: { create: { relationship: "Father", occupation: "Engineer" } },
    },
    include: { parentProfile: true },
  });

  // Link parent to student
  if (parent.parentProfile && student.studentProfile) {
    await prisma.parentStudentLink.upsert({
      where: {
        parentProfileId_studentProfileId: {
          parentProfileId:  parent.parentProfile.id,
          studentProfileId: student.studentProfile.id,
        },
      },
      update: {},
      create: {
        parentProfileId:  parent.parentProfile.id,
        studentProfileId: student.studentProfile.id,
      },
    });
  }

  console.log("✅ Users seeded (admin, teacher, student, parent) — password: demo123");

  // ── Timetable ─────────────────────────────────────────────────────────────
  if (teacher.teacherProfile) {
    const timetable = await prisma.timetable.upsert({
      where:  { id: "timetable-2025" },
      update: {},
      create: {
        id:             "timetable-2025",
        academicYearId: year.id,
        name:           "Standard 2025-26",
        effectiveFrom:  new Date("2025-06-01"),
        isActive:       true,
      },
    });

    const slots = [
      { day: "MONDAY",    start: "08:00", end: "09:00", subjectIndex: 0 },
      { day: "MONDAY",    start: "09:00", end: "10:00", subjectIndex: 2 },
      { day: "TUESDAY",   start: "08:00", end: "09:00", subjectIndex: 1 },
      { day: "TUESDAY",   start: "09:00", end: "10:00", subjectIndex: 4 },
      { day: "WEDNESDAY", start: "08:00", end: "09:00", subjectIndex: 0 },
      { day: "THURSDAY",  start: "08:00", end: "09:00", subjectIndex: 3 },
      { day: "FRIDAY",    start: "08:00", end: "09:00", subjectIndex: 4 },
    ];

    for (const slot of slots) {
      await prisma.timetableSlot.create({
        data: {
          timetableId:     timetable.id,
          classId:         cls.id,
          subjectId:       subjects[slot.subjectIndex].id,
          teacherProfileId: teacher.teacherProfile.id,
          dayOfWeek:       slot.day,
          startTime:       slot.start,
          endTime:         slot.end,
          roomNumber:      "R-101",
        },
      }).catch(() => {}); // skip duplicates
    }
    console.log("✅ Timetable slots seeded");
  }

  // ── Assignment ────────────────────────────────────────────────────────────
  if (teacher.teacherProfile) {
    await prisma.assignment.upsert({
      where:  { id: "asgn-seed-001" },
      update: {},
      create: {
        id:              "asgn-seed-001",
        title:           "Mathematics Chapter 1 Exercises",
        description:     "Complete exercises 1–20 from Chapter 1.",
        subjectId:       subjects[0].id,
        teacherProfileId: teacher.teacherProfile.id,
        dueDate:         new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalMarks:      50,
        status:          "PUBLISHED",
      },
    });
    console.log("✅ Sample assignment seeded");

    // ── Test ──────────────────────────────────────────────────────────────
    const test = await prisma.test.upsert({
      where:  { id: "test-seed-001" },
      update: {},
      create: {
        id:              "test-seed-001",
        title:           "Mathematics Unit Test 1",
        description:     "Covers Chapter 1 and 2",
        subjectId:       subjects[0].id,
        teacherProfileId: teacher.teacherProfile.id,
        durationMinutes: 30,
        totalMarks:      20,
        passingMarks:    10,
        status:          "PUBLISHED",
      },
    });

    const questions = [
      { text: "What is 2 + 2?",           options: ["3","4","5","6"],             answer: "1", marks: 2 },
      { text: "What is the square root of 144?", options: ["10","11","12","13"],  answer: "2", marks: 2 },
      { text: "Solve: 5x = 25, x = ?",    options: ["3","4","5","6"],             answer: "2", marks: 2 },
      { text: "What is 15% of 200?",       options: ["20","25","30","35"],         answer: "2", marks: 2 },
      { text: "Area of a circle = π × r². If r=7, area ≈ ?",
                                           options: ["154","144","164","174"],     answer: "0", marks: 4 },
    ];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      await prisma.question.create({
        data: {
          testId:        test.id,
          questionText:  q.text,
          questionType:  "MCQ",
          options:       q.options,
          correctAnswer: q.answer,
          marks:         q.marks,
          orderIndex:    i,
        },
      }).catch(() => {});
    }
    console.log("✅ Sample test & questions seeded");
  }

  // ── Activity logs ─────────────────────────────────────────────────────────
  await prisma.activityLog.createMany({
    data: [
      { userId: admin.id,   action: "USER_LOGIN",  entity: "User", description: "Admin logged in",   level: "INFO"    },
      { userId: teacher.id, action: "TEST_CREATED", entity: "Test", description: "Created unit test", level: "INFO"    },
      { userId: admin.id,   action: "USER_CREATED", entity: "User", description: "New user created",  level: "INFO"    },
    ],
    skipDuplicates: true,
  });
  console.log("✅ Activity logs seeded");

  console.log("\n🎉 Seed complete! You can login with:");
  console.log("   admin@learnhub.io   / demo123  (Admin)");
  console.log("   teacher@learnhub.io / demo123  (Teacher)");
  console.log("   student@learnhub.io / demo123  (Student)");
  console.log("   parent@learnhub.io  / demo123  (Parent)");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
