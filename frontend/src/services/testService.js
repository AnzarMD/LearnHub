import api from "./api";
import { MOCK_TEST_QUESTIONS } from "@constants/mockData";

const MOCK  = import.meta.env.VITE_MOCK_API !== "false";
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export const getTests = async () => {
  if (MOCK) {
    await delay();
    return [
      { id: 1, title: "Math & Science Quiz",    subject: "Mixed",   questions: 7, duration: 300, status: "available" },
      { id: 2, title: "History Chapter 4 Test", subject: "History", questions: 10, duration: 600, status: "upcoming"  },
      { id: 3, title: "Physics Unit Test",      subject: "Physics", questions: 15, duration: 900, status: "completed", score: 82 },
    ];
  }
  const { data } = await api.get("/tests");
  return data;
};

export const getTestQuestions = async (testId) => {
  if (MOCK) {
    await delay();
    // Shuffle for variety
    return [...MOCK_TEST_QUESTIONS].sort(() => Math.random() - 0.5);
  }
  const { data } = await api.get(`/tests/${testId}/questions`);
  return data;
};

export const createTest = async (payload) => {
  if (MOCK) { await delay(); return { ...payload, id: Date.now() }; }
  const { data } = await api.post("/tests", payload);
  return data;
};

export const submitTest = async (testId, answers) => {
  // answers: { [questionId]: selectedOptionIndex }
  if (MOCK) {
    await delay(700);
    const correct = MOCK_TEST_QUESTIONS.filter((q) => answers[q.id] === q.correct).length;
    const total   = MOCK_TEST_QUESTIONS.length;
    return { score: correct, total, percentage: Math.round((correct / total) * 100) };
  }
  const { data } = await api.post(`/tests/${testId}/submit`, { answers });
  return data;
};

export const getTestResults = async (testId, userId) => {
  if (MOCK) { await delay(); return { score: 5, total: 7, percentage: 71 }; }
  const { data } = await api.get(`/tests/${testId}/results/${userId}`);
  return data;
};
