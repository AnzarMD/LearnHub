import { useNotifications } from "@context/NotificationContext";

const COLORS = { success: "#10b981", error: "#f43f5e", info: "#6366f1", warning: "#f59e0b" };
const ICONS  = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };

export default function ToastContainer() {
  const { toasts, removeToast } = useNotifications();

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => (
        <div key={t.id} onClick={() => removeToast(t.id)}
          style={{ background: "#1e293b", border: `1px solid ${COLORS[t.type] ?? "#334155"}`,
            borderLeft: `4px solid ${COLORS[t.type] ?? "#6366f1"}`,
            borderRadius: 10, padding: "12px 18px", color: "#f1f5f9",
            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
            fontFamily: "'Outfit', sans-serif", fontSize: 14, minWidth: 280, maxWidth: 380,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "slideIn 0.3s ease" }}>
          <span style={{ color: COLORS[t.type], fontWeight: 700, fontSize: 16 }}>
            {ICONS[t.type] ?? "•"}
          </span>
          <span style={{ flex: 1, lineHeight: 1.4 }}>{t.msg}</span>
          <span style={{ opacity: 0.4, fontSize: 12 }}>✕</span>
        </div>
      ))}
    </div>
  );
}
