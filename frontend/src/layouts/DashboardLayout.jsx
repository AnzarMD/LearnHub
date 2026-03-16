import { useState } from "react";
import { useTheme }  from "@context/ThemeContext";
import { Sidebar }   from "@components/layout";
import { Topbar }    from "@components/layout";
import { ToastContainer } from "@components/common";

const PAGE_TITLES = {
  dashboard:     "Dashboard",
  users:         "User Management",
  courses:       "Courses",
  timetable:     "Timetable",
  schedule:      "My Schedule",
  attendance:    "Attendance",
  analytics:     "Analytics",
  messages:      "Messages",
  announcements: "Announcements",
  logs:          "System Logs",
  assignments:   "Assignments",
  tests:         "Online Tests",
  grades:        "Grades",
  notes:         "Notes & Resources",
  performance:   "Performance",
  alerts:        "Alerts",
  profile:       "Profile",
};

export default function DashboardLayout({ active, setActive, children }) {
  const { dark } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const bg = dark ? "#060d1f" : "#f1f5f9";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg, fontFamily: "'Outfit',sans-serif" }}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <Topbar title={PAGE_TITLES[active] ?? "Dashboard"} />
        <main style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
