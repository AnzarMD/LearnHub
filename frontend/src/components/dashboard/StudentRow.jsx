import { useTheme }         from "@context/ThemeContext";
import { useNotifications } from "@context/NotificationContext";
import Badge from "@components/common/Badge";

export default function StudentRow({ student }) {
  const { dark }  = useTheme();
  const { toast } = useNotifications();
  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const border = dark ? "#1e293b" : "#e2e8f0";

  const barColor = student.attendance >= 85 ? "#10b981" : student.attendance >= 75 ? "#f59e0b" : "#f43f5e";

  return (
    <tr style={{ borderBottom: `1px solid ${border}` }}>
      <td style={{ padding: "12px", color: text, fontSize: 14, fontWeight: 500, fontFamily: "'Outfit',sans-serif" }}>{student.name}</td>
      <td style={{ padding: "12px", color: muted, fontSize: 13, fontFamily: "'Outfit',sans-serif" }}>{student.grade}</td>
      <td style={{ padding: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 6, background: dark ? "#1e293b" : "#f1f5f9", borderRadius: 3 }}>
            <div style={{ width: `${student.attendance}%`, height: "100%", borderRadius: 3, background: barColor }} />
          </div>
          <span style={{ color: text, fontSize: 12, minWidth: 38, fontFamily: "'Outfit',sans-serif" }}>{student.attendance}%</span>
        </div>
      </td>
      <td style={{ padding: "12px", color: text, fontSize: 13, fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>{student.gpa}</td>
      <td style={{ padding: "12px" }}><Badge status={student.status} /></td>
      <td style={{ padding: "12px" }}>
        <button onClick={() => toast(`Viewing ${student.name}'s profile`, "info")}
          style={{ padding: "4px 10px", borderRadius: 6, background: "#6366f120", border: "none",
            color: "#6366f1", fontSize: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
          View
        </button>
      </td>
    </tr>
  );
}
