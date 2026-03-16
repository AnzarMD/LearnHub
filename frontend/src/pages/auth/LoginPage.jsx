import { useState }        from "react";
import { useAuth }         from "@context/AuthContext";
import { useTheme }        from "@context/ThemeContext";
import { useNotifications } from "@context/NotificationContext";
import { DEMO_CREDENTIALS, DEMO_PASSWORD } from "@constants/roles";
import AuthLayout from "@layouts/AuthLayout";

export default function LoginPage({ onRegister, onForgot }) {
  const { login }  = useAuth();
  const { dark }   = useTheme();
  const { toast }  = useNotifications();

  const [email,    setEmail]    = useState("student@learnhub.io");
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const bg     = dark ? "#0f172a" : "#ffffff";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const input  = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${border}`, background: dark ? "#1e293b" : "#f8fafc", color: text, fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (!result.ok) { setError(result.message); toast(result.message, "error"); }
    else toast("Welcome back! Loading your dashboard…", "success");
    setLoading(false);
  };

  return (
    <AuthLayout>
      {/* Brand */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🎓</div>
          <span style={{ fontSize: 28, fontWeight: 800, color: text, letterSpacing: -0.5, fontFamily: "inherit" }}>LearnHub</span>
        </div>
        <p style={{ color: muted, fontSize: 13 }}>Your complete learning ecosystem</p>
      </div>

      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 20, padding: "32px 32px 28px", boxShadow: dark ? "0 25px 60px rgba(0,0,0,0.5)" : "0 10px 40px rgba(0,0,0,0.08)" }}>
        <h2 style={{ color: text, fontSize: 21, fontWeight: 700, margin: "0 0 4px" }}>Welcome back</h2>
        <p style={{ color: muted, fontSize: 13, margin: "0 0 24px" }}>Sign in to continue to your dashboard</p>

        {error && (
          <div style={{ padding: "10px 14px", borderRadius: 9, background: "#f43f5e15", border: "1px solid #f43f5e40", color: "#f43f5e", fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", color: muted, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={input} placeholder="your@email.com" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", color: muted, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ ...input, paddingRight: 44 }} placeholder="Enter password" />
              <button type="button" onClick={() => setShowPass((s) => !s)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: muted, fontSize: 18 }}>
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: 13, borderRadius: 10,
              background: loading ? "#4338ca" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "#fff", fontSize: 16, fontWeight: 700, border: "none",
              cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", letterSpacing: 0.2 }}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button onClick={onForgot} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Forgot password?</button>
          <span style={{ color: muted, margin: "0 8px" }}>·</span>
          <button onClick={onRegister} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Create account</button>
        </div>

        {/* Demo accounts */}
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${border}` }}>
          <p style={{ color: muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, textAlign: "center", margin: "0 0 10px" }}>Quick Demo</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
            {DEMO_CREDENTIALS.map((acc) => (
              <button key={acc.role} onClick={() => { setEmail(acc.email); setPassword(DEMO_PASSWORD); toast(`Switched to ${acc.label} demo`, "info"); }}
                style={{ padding: "7px 10px", borderRadius: 8, background: dark ? "#1e293b" : "#f8fafc", border: `1px solid ${border}`, color: text, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: acc.color, flexShrink: 0 }} />
                {acc.label}
              </button>
            ))}
          </div>
          <p style={{ color: muted, fontSize: 11, textAlign: "center", margin: "8px 0 0" }}>
            Password for all: <strong style={{ color: text }}>demo123</strong>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
