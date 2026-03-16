import api from "./api";
import { MOCK_USERS, MOCK_STUDENTS } from "@constants/mockData";

const MOCK  = import.meta.env.VITE_MOCK_API !== "false";
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

export const getAllUsers = async () => {
  if (MOCK) { await delay(); return MOCK_USERS; }
  const { data } = await api.get("/users");
  return data;
};

export const getUserById = async (id) => {
  if (MOCK) { await delay(); return MOCK_USERS.find((u) => u.id === id) ?? null; }
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const createUser = async (payload) => {
  if (MOCK) { await delay(); return { ...payload, id: Date.now() }; }
  const { data } = await api.post("/users", payload);
  return data;
};

export const updateUser = async (id, payload) => {
  if (MOCK) { await delay(); return { id, ...payload }; }
  const { data } = await api.put(`/users/${id}`, payload);
  return data;
};

export const deleteUser = async (id) => {
  if (MOCK) { await delay(); return { message: "User deleted." }; }
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

export const getAllStudents = async () => {
  if (MOCK) { await delay(); return MOCK_STUDENTS; }
  const { data } = await api.get("/users?role=student");
  return data;
};
