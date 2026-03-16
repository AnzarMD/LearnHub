import api from "./api";
import { MOCK_ASSIGNMENTS } from "@constants/mockData";

const MOCK  = import.meta.env.VITE_MOCK_API !== "false";
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export const getAssignments = async (filters = {}) => {
  if (MOCK) { await delay(); return MOCK_ASSIGNMENTS; }
  const { data } = await api.get("/assignments", { params: filters });
  return data;
};

export const getAssignmentById = async (id) => {
  if (MOCK) { await delay(); return MOCK_ASSIGNMENTS.find((a) => a.id === id) ?? null; }
  const { data } = await api.get(`/assignments/${id}`);
  return data;
};

export const createAssignment = async (payload) => {
  if (MOCK) { await delay(); return { ...payload, id: Date.now(), status: "pending" }; }
  const { data } = await api.post("/assignments", payload);
  return data;
};

export const submitAssignment = async (assignmentId, formData) => {
  if (MOCK) { await delay(800); return { message: "Assignment submitted successfully." }; }
  const { data } = await api.post(`/assignments/${assignmentId}/submit`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const gradeAssignment = async (submissionId, payload) => {
  // payload: { score, feedback }
  if (MOCK) { await delay(); return { message: "Graded successfully." }; }
  const { data } = await api.put(`/assignments/submissions/${submissionId}/grade`, payload);
  return data;
};

export const deleteAssignment = async (id) => {
  if (MOCK) { await delay(); return { message: "Assignment deleted." }; }
  const { data } = await api.delete(`/assignments/${id}`);
  return data;
};
