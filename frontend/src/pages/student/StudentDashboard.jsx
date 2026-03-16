import { useTheme }         from "@context/ThemeContext";
import { useNotifications } from "@context/NotificationContext";
import { StatCard, ChartCard } from "@components/common";
import { RadarScore }          from "@components/charts";
import { AssignmentItem }      from "@components/dashboard";
import { MOCK_ASSIGNMENTS, MOCK_RADAR } from "@constants/mockData";

const TODAY_SCHEDULE = [
  { time: "08:00", subject: "Mathematics",   teacher: "Dr. Mehta", room: "Room 102", color: "#f59e0b", live: false },
  { time: "10:00", subject: "Physics",       teacher: "Ms. Priya", room: "Room 204", color: "#10b981", live: true  },
  { time: "12:00", subject: "Lunch Break",   teacher: "",          room: "Cafeteria", color: "#64748b", live: false },
  { time: "13:00", subject: "Computer Sci.", teacher: "Dr. Gupta", room: "Lab 3",    color: "#0ea5e9", live: false },
  { time: "15:00", subject: "History",       teacher: "Mr. Sharma",room: "Room 301", color: "#6366f1", live: false },
];

export default function StudentDashboard() {
  const { dark }  = useTheme();
  const { toast } = useNotifications();

  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const border = dark ? "#1e293b" : "#e2e8f0";

  return (
    <div style={{ padding: 24, fontFamily: "'Outfit',sans-serif" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard label="Overall GPA"  value="3.7"   sub="↑ 0.2 this semester" icon="🏆" color="#f59e0b" trend={92} />
        <StatCard label="Attendance"   value="91.2%" sub="23/25 days present"  icon="✅" color="#10b981" trend={91} />
        <StatCard label="Assignments"  value="3 due" sub="2 pending · 1 late"  icon="📝" color="#f43f5e" trend={30} />
        <StatCard label="Test Avg"     value="84.6%" sub="↑ 3.2% this month"  icon="🎯" color="#6366f1" trend={84} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 24 }}>
        <ChartCard title="Subject Performance (Radar)">
          <RadarScore data={MOCK_RADAR} />
        </ChartCard>
        <ChartCard title="Due Assignments">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MOCK_ASSIGNMENTS.map((a) => <AssignmentItem key={a.id} assignment={a} />)}
          </div>
        </ChartCard>
      </div>

      {/* Today's schedule */}
      <ChartCard title="Today's Schedule">
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6 }}>
          {TODAY_SCHEDULE.map((cls, i) => (
            <div key={i} style={{ minWidth: 152, padding: 14, borderRadius: 12, background: dark ? "#0d1526" : "#f8fafc", border: `1.5px solid ${cls.live ? cls.color : border}`, position: "relative", flexShrink: 0 }}>
              {cls.live && <div style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 0 3px #10b98130" }} />}
              <p style={{ color: muted, fontSize: 11, margin: "0 0 5px", fontFamily: "inherit" }}>{cls.time}</p>
              <p style={{ color: text, fontSize: 13, fontWeight: 600, margin: "0 0 3px", fontFamily: "inherit" }}>{cls.subject}</p>
              <p style={{ color: muted, fontSize: 11, margin: "0 0 10px", fontFamily: "inherit" }}>{cls.teacher ? `${cls.teacher} · ` : ""}{cls.room}</p>
              {cls.live && (
                <button onClick={() => toast(`Joining ${cls.subject} class…`, "success")}
                  style={{ width: "100%", padding: "5px 0", borderRadius: 6, background: `${cls.color}20`, border: "none", color: cls.color, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                  ▶ Join Now
                </button>
              )}
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
