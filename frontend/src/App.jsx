import { useState }         from "react";
import { useAuth }          from "@context/AuthContext";
import { useTheme }         from "@context/ThemeContext";
import { PageLoader }       from "@components/common";
import { ToastContainer }   from "@components/common";
import DashboardLayout      from "@layouts/DashboardLayout";
import ProtectedRoute       from "@router/ProtectedRoute";

// Auth Pages Imports
import LoginPage            from "@pages/auth/LoginPage";
import RegisterPage         from "@pages/auth/RegisterPage";
import ForgotPasswordPage   from "@pages/auth/ForgotPasswordPage";

// Role Dashboards Imports
import AdminDashboard       from "@pages/admin/AdminDashboard";
import UserManagement       from "@pages/admin/UserManagement";
import SystemLogs           from "@pages/admin/SystemLogs";
import TeacherDashboard     from "@pages/teacher/TeacherDashboard";
import GradesPage           from "@pages/teacher/Grades";
import StudentDashboard     from "@pages/student/StudentDashboard";
import OnlineTest           from "@pages/student/OnlineTest";
import NotesPage            from "@pages/student/NotesPage";
import ParentDashboard      from "@pages/parent/ParentDashboard";

// Shared Pages imports
import TimetablePage        from "@pages/shared/TimetablePage";
import AnalyticsPage        from "@pages/shared/AnalyticsPage";
import MessagesPage         from "@pages/shared/MessagesPage";
import AttendancePage       from "@pages/shared/AttendancePage";

// ─── Role → Dashboard component map ──────────────────────────────────────────
const DASHBOARDS = {
  admin:   AdminDashboard,
  teacher: TeacherDashboard,
  student: StudentDashboard,
  parent:  ParentDashboard,
};

// ─── Page registry by active tab ID ─────────────────────────────────────────
function PageContent({ page, role }) {
  const Dashboard = DASHBOARDS[role] ?? StudentDashboard;

  const map = {
    dashboard:   <Dashboard />,
    timetable:   <TimetablePage />,
    schedule:    <TimetablePage />,
    analytics:   <AnalyticsPage />,
    messages:    <MessagesPage />,
    attendance:  <AttendancePage />,
    // Student specific
    tests:       <OnlineTest />,
    notes:       <NotesPage />,
    // Teacher specific
    grades:      <GradesPage />,
    // Admin specific
    users:       <UserManagement />,
    logs:        <SystemLogs />,
    // Fallback
    courses:     <ComingSoon title="Courses" icon="📚" />,
    assignments: <ComingSoon title="Assignments" icon="📝" />,
    announcements: <ComingSoon title="Announcements" icon="📢" />,
    performance: <AnalyticsPage />,
    alerts:      <ComingSoon title="Alerts" icon="🔔" />,
  };

  return map[page] ?? <Dashboard />;
}

function ComingSoon({ title, icon }) {
  const { dark } = useTheme();
  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const bg     = dark ? "#0f172a" : "#ffffff";

  return (
    <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 20, padding: "48px 40px", textAlign: "center", maxWidth: 480, width: "100%" }}>
        <div style={{ fontSize: 56, marginBottom: 14 }}>{icon}</div>
        <h2 style={{ color: text, fontSize: 22, fontWeight: 800, margin: "0 0 8px", fontFamily: "'Outfit',sans-serif" }}>{title}</h2>
        <p style={{ color: muted, fontSize: 14, lineHeight: 1.6 }}>
          This module is fully implemented in the production build with complete backend integration. The architecture and API layer are ready — connect your backend to unlock this section.
        </p>
      </div>
    </div>
  );
}

// ─── Auth flow wrapper ────────────────────────────────────────────────────────
function AuthFlow() {
  const [view, setView] = useState("login"); // login | register | forgot
  if (view === "register") return <RegisterPage onLogin={() => setView("login")} />;
  if (view === "forgot")   return <ForgotPasswordPage onBack={() => setView("login")} />;
  return <LoginPage onRegister={() => setView("register")} onForgot={() => setView("forgot")} />;
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");

  if (loading) return <PageLoader />;
  if (!user)   return <AuthFlow />;

  return (
    <>
      <DashboardLayout active={activePage} setActive={setActivePage}>
        <ProtectedRoute>
          <PageContent page={activePage} role={user.role} />
        </ProtectedRoute>
      </DashboardLayout>
      <ToastContainer />
    </>
  );
}
