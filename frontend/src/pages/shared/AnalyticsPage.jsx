import { useTheme }         from "@context/ThemeContext";
import { ChartCard }        from "@components/common";
import { AttendanceChart, PerformanceChart, EngagementChart, EnrollmentPie } from "@components/charts";
import { MOCK_ATTENDANCE, MOCK_PERFORMANCE, MOCK_ENGAGEMENT, MOCK_ENROLLMENT_PIE } from "@constants/mockData";

export default function AnalyticsPage() {
  return (
    <div style={{ padding: 24, fontFamily: "'Outfit',sans-serif" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <ChartCard title="Attendance Trends (6 months)">
          <AttendanceChart data={MOCK_ATTENDANCE} />
        </ChartCard>
        <ChartCard title="Performance by Subject">
          <PerformanceChart data={MOCK_PERFORMANCE} />
        </ChartCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <ChartCard title="Weekly Engagement Metrics">
          <EngagementChart data={MOCK_ENGAGEMENT} />
        </ChartCard>
        <ChartCard title="Course Completion">
          <EnrollmentPie data={[
            { name: "Completed",   value: 68, color: "#10b981" },
            { name: "In Progress", value: 24, color: "#f59e0b" },
            { name: "Not Started", value: 8,  color: "#f43f5e" },
          ]} />
        </ChartCard>
      </div>
    </div>
  );
}
