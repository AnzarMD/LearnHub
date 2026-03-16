import { useState }         from "react";
import { useTheme }          from "@context/ThemeContext";
import { useNotifications }  from "@context/NotificationContext";
import AuthLayout            from "@layouts/AuthLayout";

export default function ForgotPasswordPage({ onBack }) {
  const { dark }  = useTheme();
  const { toast } = useNotifications();
  const [email, setEmail]   = useState("");
  const [sent,  setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  const bg     = dark ? "#0f172a" : "#ffffff";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setSent(true);
    toast("Reset link sent — check your inbox.", "success");
    setLoading(false);
  };

  return (
    <AuthLayout>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🎓</div>
          <span style={{ fontSize: 26, fontWeight: 800, color: text }}>LearnHub</span>
        </div>
      </div>

      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 20, padding: "28px 32px", boxShadow: dark ? "0 25px 60px rgba(0,0,0,0.5)" : "0 10px 40px rgba(0,0,0,0.08)" }}>
        {!sent ? (
          <>
            <div style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>🔑</div>
            <h2 style={{ color: text, fontSize: 20, fontWeight: 700, textAlign: "center", margin: "0 0 6px" }}>Reset Password</h2>
            <p style={{ color: muted, fontSize: 13, textAlign: "center", margin: "0 0 24px" }}>Enter your email to receive reset instructions</p>
            <form onSubmit={submit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", color: muted, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${border}`, background: dark ? "#1e293b" : "#f8fafc", color: text, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  placeholder="your@email.com" />
              </div>
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: 13, borderRadius: 10, background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#fff", fontSize: 15, fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>📧</div>
            <h2 style={{ color: text, fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>Check your email</h2>
            <p style={{ color: muted, fontSize: 14 }}>A reset link was sent to <strong style={{ color: text }}>{email}</strong>. It expires in 15 minutes.</p>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
            ← Back to sign in
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
