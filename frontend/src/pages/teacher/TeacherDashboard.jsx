import { useTheme }         from "@context/ThemeContext";
import { StatCard, ChartCard } from "@components/common";
import { PerformanceChart, AttendanceChart } from "@components/charts";
import { CourseCard }          from "@components/dashboard";
import { MOCK_COURSES, MOCK_PERFORMANCE, MOCK_ATTENDANCE } from "@constants/mockData";

export default function TeacherDashboard() {
  const { dark } = useTheme();

  return (
    <div style={{ padding: 24, fontFamily: "'Outfit',sans-serif" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard label="My Students"     value="186"   sub="Across 4 courses"           icon="🎓" color="#6366f1" trend={72} />
        <StatCard label="Pending Reviews" value="23"    sub="Assignments to grade"         icon="📝" color="#f59e0b" trend={40} />
        <StatCard label="Avg Class Score" value="78.4%" sub="↑ 2.1% this month"           icon="🎯" color="#10b981" trend={78} />
        <StatCard label="Next Class"      value="45m"   sub="Physics 9B · Room 204"        icon="🎥" color="#0ea5e9" trend={60} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <ChartCard title="Class Performance by Subject">
          <PerformanceChart data={MOCK_PERFORMANCE} />
        </ChartCard>
        <ChartCard title="Monthly Attendance Trends">
          <AttendanceChart data={MOCK_ATTENDANCE} />
        </ChartCard>
      </div>

      <ChartCard title="My Courses">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
          {MOCK_COURSES.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      </ChartCard>
    </div>
  );
}
