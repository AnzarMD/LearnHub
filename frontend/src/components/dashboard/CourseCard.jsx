import { useTheme }         from "@context/ThemeContext";
import { useNotifications } from "@context/NotificationContext";

export default function CourseCard({ course }) {
  const { dark }  = useTheme();
  const { toast } = useNotifications();
  const { name, teacher, students, progress, color } = course;

  const bg     = dark ? "#0d1526" : "#f8fafc";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";

  return (
    <div style={{ background: bg, borderRadius: 14, padding: 16, border: `1px solid ${border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 9, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>📚</div>
        <span style={{ fontSize: 11, color: muted, fontFamily: "'Outfit',sans-serif" }}>{students} students</span>
      </div>
      <h4 style={{ color: text, fontSize: 14, fontWeight: 600, margin: "0 0 3px", fontFamily: "'Outfit',sans-serif" }}>{name}</h4>
      <p style={{ color: muted, fontSize: 12, margin: "0 0 12px", fontFamily: "'Outfit',sans-serif" }}>{teacher}</p>
      {/* Progress bar */}
      <div style={{ height: 5, background: dark ? "#1e293b" : "#e2e8f0", borderRadius: 3 }}>
        <div style={{ width: `${progress}%`, height: "100%", borderRadius: 3, background: color, transition: "width 0.4s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 11, color: muted, fontFamily: "'Outfit',sans-serif" }}>Progress</span>
        <span style={{ fontSize: 11, color, fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>{progress}%</span>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        <button onClick={() => toast(`Starting class: ${name}`, "success")}
          style={{ flex: 1, padding: "6px 0", borderRadius: 7, background: `${color}20`, border: "none",
            color, fontSize: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>▶ Start</button>
        <button onClick={() => toast(`Upload panel opened: ${name}`, "info")}
          style={{ padding: "6px 10px", borderRadius: 7, background: dark ? "#1e293b" : "#f1f5f9",
            border: "none", color: muted, fontSize: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>⬆</button>
      </div>
    </div>
  );
}
