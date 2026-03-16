import api from "./api";
import { MOCK_ATTENDANCE, MOCK_STUDENTS } from "@constants/mockData";

const MOCK  = import.meta.env.VITE_MOCK_API !== "false";
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export const getAttendanceSummary = async (userId) => {
  if (MOCK) { await delay(); return MOCK_ATTENDANCE; }
  const { data } = await api.get(`/attendance/summary/${userId}`);
  return data;
};

export const getMonthlyAttendance = async (userId, month) => {
  if (MOCK) { await delay(); return MOCK_ATTENDANCE; }
  const { data } = await api.get(`/attendance/${userId}?month=${month}`);
  return data;
};

export const markAttendance = async (payload) => {
  // payload: { classId, date, records: [{ studentId, status }] }
  if (MOCK) { await delay(); return { message: "Attendance marked successfully." }; }
  const { data } = await api.post("/attendance/mark", payload);
  return data;
};

export const getLowAttendanceStudents = async (threshold = 75) => {
  if (MOCK) {
    await delay();
    return MOCK_STUDENTS.filter((s) => s.attendance < threshold);
  }
  const { data } = await api.get(`/attendance/low?threshold=${threshold}`);
  return data;
};

export const exportAttendanceReport = async (classId) => {
  if (MOCK) { await delay(800); return { url: "#", filename: "attendance_report.pdf" }; }
  const { data } = await api.get(`/attendance/export/${classId}`, { responseType: "blob" });
  return data;
};
