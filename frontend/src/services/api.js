import axios from "axios";

const JWT_KEY = import.meta.env.VITE_JWT_KEY || "learnhub_jwt_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// ─── Request interceptor: attach Bearer token ─────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(JWT_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: handle 401 globally ───────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(JWT_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
