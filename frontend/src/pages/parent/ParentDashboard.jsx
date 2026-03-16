import { useTheme }           from "@context/ThemeContext";
import { StatCard, ChartCard } from "@components/common";
import { AttendanceChart, PerformanceChart } from "@components/charts";
import { MOCK_ATTENDANCE, MOCK_PERFORMANCE } from "@constants/mockData";

export default function ParentDashboard() {
  const { dark } = useTheme();

  return (
    <div style={{ padding: 24, fontFamily: "'Outfit',sans-serif" }}>
      {/* Child banner */}
      <div style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 18, padding: "22px 28px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: "0 0 4px" }}>Monitoring progress for</p>
          <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 4px", fontFamily: "inherit" }}>Rohan Kapoor</h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, margin: 0 }}>Grade 10A · Academic Year 2025–26</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "0 0 4px" }}>Current GPA</p>
          <p style={{ color: "#fff", fontSize: 36, fontWeight: 900, margin: 0, fontFamily: "inherit" }}>3.7</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard label="Attendance"     value="91%"  sub="Above 75% minimum"     icon="✅" color="#10b981" trend={91} />
        <StatCard label="Upcoming Tests" value="3"    sub="Next: Math on Mar 8"   icon="🧪" color="#f59e0b" trend={60} />
        <StatCard label="Pending Tasks"  value="2"    sub="Due this week"          icon="📝" color="#f43f5e" trend={40} />
        <StatCard label="Class Rank"     value="#7"   sub="Out of 42 students"    icon="🏅" color="#6366f1" trend={83} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <ChartCard title="Attendance (6 months)">
          <AttendanceChart data={MOCK_ATTENDANCE} />
        </ChartCard>
        <ChartCard title="Subject Scores">
          <PerformanceChart data={MOCK_PERFORMANCE} />
        </ChartCard>
      </div>

      {/* Alerts */}
      <ChartCard title="Alerts" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { icon: "⚠️", msg: "History attendance at 71% — approaching minimum threshold.", level: "warning" },
            { icon: "📝", msg: "Industrial Revolution essay is overdue (was due Mar 5).", level: "error" },
            { icon: "✅", msg: "Physics lab report graded: A− (88/100). Great job!", level: "success" },
          ].map((a, i) => {
            const colors = { warning: "#f59e0b", error: "#f43f5e", success: "#10b981" };
            return (
              <div key={i} style={{ padding: "12px 16px", borderRadius: 10, borderLeft: `4px solid ${colors[a.level]}`, background: `${colors[a.level]}10`, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span>
                <span style={{ color: dark ? "#f1f5f9" : "#0f172a", fontSize: 13, fontFamily: "inherit", flex: 1 }}>{a.msg}</span>
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}
