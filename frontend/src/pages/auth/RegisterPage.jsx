import { useState }         from "react";
import { useTheme }          from "@context/ThemeContext";
import { useNotifications }  from "@context/NotificationContext";
import AuthLayout            from "@layouts/AuthLayout";

export default function RegisterPage({ onLogin }) {
  const { dark }  = useTheme();
  const { toast } = useNotifications();

  const [form, setForm]       = useState({ name: "", email: "", role: "student", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const bg     = dark ? "#0f172a" : "#ffffff";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${border}`, background: dark ? "#1e293b" : "#f8fafc", color: text, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast("Passwords do not match.", "error"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast("Account created! Please verify your email.", "success");
    setLoading(false);
    onLogin?.();
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
        <h2 style={{ color: text, fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>Create Account</h2>
        <p style={{ color: muted, fontSize: 13, margin: "0 0 22px" }}>Join LearnHub today — it's free</p>

        <form onSubmit={submit}>
          {[
            { key: "name",     label: "Full Name",     type: "text",     placeholder: "Your full name" },
            { key: "email",    label: "Email Address", type: "email",    placeholder: "your@email.com" },
            { key: "password", label: "Password",      type: "password", placeholder: "Min 8 characters" },
            { key: "confirm",  label: "Confirm Password", type: "password", placeholder: "Repeat password" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", color: muted, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>
              <input type={type} value={form[key]} onChange={handle(key)} placeholder={placeholder} style={inputStyle} required />
            </div>
          ))}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", color: muted, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Role</label>
            <select value={form.role} onChange={handle("role")} style={{ ...inputStyle }}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: 13, borderRadius: 10, background: loading ? "#059669" : "linear-gradient(135deg,#10b981,#059669)",
              color: "#fff", fontSize: 15, fontWeight: 700, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p style={{ color: muted, fontSize: 13, textAlign: "center", marginTop: 16 }}>
          Already have an account?{" "}
          <button onClick={onLogin} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Sign in</button>
        </p>
      </div>
    </AuthLayout>
  );
}
