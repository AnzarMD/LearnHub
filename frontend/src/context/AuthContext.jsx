import { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS } from "@constants/mockData";

const AuthContext = createContext(null);

const JWT_KEY = import.meta.env.VITE_JWT_KEY || "learnhub_jwt_token";

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(JWT_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(atob(stored.split(".")[1] ?? "e30="));
        const found  = MOCK_USERS.find((u) => u.id === parsed.id);
        if (found) setUser(found);
      } catch (_) {
        localStorage.removeItem(JWT_KEY);
      }
    }
    setLoading(false);
  }, []);

  /**
   * Simulate login — replace with real API call when backend is ready.
   * Returns { ok: true } or { ok: false, message: string }
   */
  const login = async (email, password) => {
    await new Promise((r) => setTimeout(r, 700)); // simulate network

    const found = MOCK_USERS.find((u) => u.email === email);
    if (!found || password !== "demo123") {
      return { ok: false, message: "Invalid email or password." };
    }

    // Create a mock JWT payload (header.payload.signature)
    const payload = btoa(JSON.stringify({ id: found.id, role: found.role, exp: Date.now() + 86400_000 }));
    const mockJwt = `mock.${payload}.sig`;
    localStorage.setItem(JWT_KEY, mockJwt);
    setUser(found);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(JWT_KEY);
    setUser(null);
  };

  /** Dev helper: instantly switch roles without re-login */
  const switchRole = (role) => {
    const found = MOCK_USERS.find((u) => u.role === role);
    if (found) {
      const payload = btoa(JSON.stringify({ id: found.id, role: found.role, exp: Date.now() + 86400_000 }));
      localStorage.setItem(JWT_KEY, `mock.${payload}.sig`);
      setUser(found);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
