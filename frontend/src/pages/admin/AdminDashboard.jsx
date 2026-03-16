import { useTheme }         from "@context/ThemeContext";
import { useNotifications } from "@context/NotificationContext";
import { StatCard, ChartCard } from "@components/common";
import { EngagementChart, EnrollmentPie } from "@components/charts";
import { StudentRow }          from "@components/dashboard";
import { MOCK_STUDENTS, MOCK_ENGAGEMENT, MOCK_ENROLLMENT_PIE } from "@constants/mockData";

export default function AdminDashboard() {
  const { dark }  = useTheme();
  const { toast } = useNotifications();

  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const cardBg = dark ? "#0f172a" : "#ffffff";

  return (
    <div style={{ padding: 24, fontFamily: "'Outfit',sans-serif" }}>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Students" value="1,284" sub="↑ 12% this month"  icon="🎓" color="#6366f1" trend={12} />
        <StatCard label="Active Teachers" value="48"   sub="↑ 3 new this term"  icon="👨‍🏫" color="#10b981" trend={5} />
        <StatCard label="Courses Running" value="86"   sub="↑ 8 from last month" icon="📚" color="#f59e0b" trend={8} />
        <StatCard label="Avg Attendance"  value="88.4%" sub="↓ 1.2% this week"  icon="✅" color="#0ea5e9" trend={-1.2} />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 }}>
        <ChartCard title="Weekly Platform Engagement">
          <EngagementChart data={MOCK_ENGAGEMENT} />
        </ChartCard>
        <ChartCard title="Enrollment by Subject">
          <EnrollmentPie data={MOCK_ENROLLMENT_PIE} />
        </ChartCard>
      </div>

      {/* Student table */}
      <ChartCard title="Student Overview"
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => toast("Exporting PDF report…", "info")} style={{ padding: "6px 14px", borderRadius: 8, background: "#6366f120", border: "none", color: "#6366f1", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>⬇ Export PDF</button>
            <button onClick={() => toast("Add user modal would open here", "info")} style={{ padding: "6px 14px", borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>+ Add Student</button>
          </div>
        }>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Student", "Grade", "Attendance", "GPA", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, fontFamily: "inherit" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_STUDENTS.map((s) => <StudentRow key={s.id} student={s} />)}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
