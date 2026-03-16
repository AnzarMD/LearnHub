/**
 * authService.js
 * All authentication-related API calls.
 * Mock promises return immediately — swap api.post() calls in when backend is live.
 */
import api from "./api";
import { MOCK_USERS } from "@constants/mockData";

const MOCK = import.meta.env.VITE_MOCK_API !== "false";
const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// ─── Login ────────────────────────────────────────────────────────────────────
export const loginUser = async ({ email, password }) => {
  if (MOCK) {
    await delay();
    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user || password !== "demo123")
      throw new Error("Invalid email or password.");
    const token = `mock.${btoa(JSON.stringify({ id: user.id, role: user.role }))}.sig`;
    return { token, user };
  }
  const { data } = await api.post("/auth/login", { email, password });
  return data; // { token, user }
};

// ─── Register ─────────────────────────────────────────────────────────────────
export const registerUser = async (payload) => {
  if (MOCK) {
    await delay();
    return { message: "Registration successful. Please check your email." };
  }
  const { data } = await api.post("/auth/register", payload);
  return data;
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
export const forgotPassword = async ({ email }) => {
  if (MOCK) {
    await delay();
    return { message: "Reset link sent to " + email };
  }
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

// ─── Reset Password ───────────────────────────────────────────────────────────
export const resetPassword = async ({ token, password }) => {
  if (MOCK) {
    await delay();
    return { message: "Password reset successfully." };
  }
  const { data } = await api.post("/auth/reset-password", { token, password });
  return data;
};

// ─── Get current user profile ─────────────────────────────────────────────────
export const getMe = async () => {
  if (MOCK) {
    await delay(300);
    return MOCK_USERS[0];
  }
  const { data } = await api.get("/auth/me");
  return data;
};

// ─── Logout ───────────────────────────────────────────────────────────────────
export const logoutUser = async () => {
  if (MOCK) {
    await delay(200);
    return { message: "Logged out." };
  }
  const { data } = await api.post("/auth/logout");
  return data;
};
