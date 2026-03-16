import { useTheme }         from "@context/ThemeContext";
import { useNotifications } from "@context/NotificationContext";
import Badge from "@components/common/Badge";

export default function AssignmentItem({ assignment }) {
  const { dark }  = useTheme();
  const { toast } = useNotifications();
  const { title, course, due, status } = assignment;

  const bg     = dark ? "#0d1526" : "#f8fafc";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";

  return (
    <div style={{ padding: "12px 14px", borderRadius: 10, background: bg, border: `1px solid ${border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <p style={{ color: text, fontSize: 13, fontWeight: 600, margin: "0 0 3px", fontFamily: "'Outfit',sans-serif" }}>{title}</p>
          <p style={{ color: muted, fontSize: 11, margin: 0, fontFamily: "'Outfit',sans-serif" }}>{course} · Due {due}</p>
        </div>
        <Badge status={status} />
      </div>
      {status === "pending" && (
        <button onClick={() => toast(`Submitting: ${title}`, "success")}
          style={{ marginTop: 10, width: "100%", padding: "6px", borderRadius: 7,
            background: "#6366f120", border: "none", color: "#818cf8",
            fontSize: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>
          Submit Assignment →
        </button>
      )}
    </div>
  );
}
