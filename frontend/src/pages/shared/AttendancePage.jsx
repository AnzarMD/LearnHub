import { useTheme }         from "@context/ThemeContext";
import { useNotifications } from "@context/NotificationContext";
import { ChartCard, StatCard } from "@components/common";
import { AttendanceChart }  from "@components/charts";
import { MOCK_ATTENDANCE, MOCK_STUDENTS } from "@constants/mockData";

export default function AttendancePage() {
  const { dark }  = useTheme();
  const { toast } = useNotifications();

  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const border = dark ? "#1e293b" : "#e2e8f0";

  const totalDays   = MOCK_ATTENDANCE.reduce((a, m) => a + m.present + m.absent, 0);
  const presentDays = MOCK_ATTENDANCE.reduce((a, m) => a + m.present, 0);
  const pct         = Math.round((presentDays / totalDays) * 100);

  return (
    <div style={{ padding: 24, fontFamily: "'Outfit',sans-serif" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard label="Overall %"      value={`${pct}%`}         sub="6-month period"           icon="📊" color="#6366f1" trend={pct} />
        <StatCard label="Present Days"   value={String(presentDays)} sub={`of ${totalDays} total`} icon="✅" color="#10b981" trend={80} />
        <StatCard label="Absent Days"    value={String(totalDays - presentDays)} sub="Total absences" icon="❌" color="#f43f5e" trend={20} />
        <StatCard label="Low Attendance" value="2 students" sub="Below 75% threshold" icon="⚠️" color="#f59e0b" trend={10} />
      </div>

      <ChartCard title="Monthly Attendance Breakdown" style={{ marginBottom: 20 }}>
        <AttendanceChart data={MOCK_ATTENDANCE} />
      </ChartCard>

      <ChartCard title="Student Attendance Status"
        action={
          <button onClick={() => toast("Downloading attendance report…", "success")} style={{ padding: "6px 14px", borderRadius: 8, background: "#6366f120", border: "none", color: "#6366f1", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            ⬇ Download Report
          </button>
        }>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Student", "Grade", "Attendance %", "Status", "Action"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_STUDENTS.map((s) => {
                const barColor = s.attendance >= 85 ? "#10b981" : s.attendance >= 75 ? "#f59e0b" : "#f43f5e";
                const badge    = s.attendance >= 85 ? { label: "Good",    color: "#10b981" } : s.attendance >= 75 ? { label: "Warning", color: "#f59e0b" } : { label: "Low", color: "#f43f5e" };
                return (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: "12px", color: text, fontSize: 14, fontWeight: 500 }}>{s.name}</td>
                    <td style={{ padding: "12px", color: muted, fontSize: 13 }}>{s.grade}</td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: dark ? "#1e293b" : "#f1f5f9", borderRadius: 3 }}>
                          <div style={{ width: `${s.attendance}%`, height: "100%", borderRadius: 3, background: barColor }} />
                        </div>
                        <span style={{ color: text, fontSize: 13, minWidth: 36 }}>{s.attendance}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${badge.color}20`, color: badge.color }}>{badge.label}</span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      {s.attendance < 75 && (
                        <button onClick={() => toast(`Sending alert to parents of ${s.name}`, "warning")} style={{ padding: "4px 10px", borderRadius: 6, background: "#f59e0b20", border: "none", color: "#f59e0b", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Alert Parent</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
