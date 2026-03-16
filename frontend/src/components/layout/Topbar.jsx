import { useState } from "react";
import { useAuth }          from "@context/AuthContext";
import { useTheme }         from "@context/ThemeContext";
import { useNotifications } from "@context/NotificationContext";
import { NOTIF_ICONS }      from "@constants/navConfig";

export default function Topbar({ title }) {
  const { user, switchRole }                         = useAuth();
  const { dark, toggle }                             = useTheme();
  const { notifs, unreadCount, markRead, markAllRead } = useNotifications();

  const [showNotifs,  setShowNotifs]  = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const bg     = dark ? "#0d1526" : "#ffffff";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const cardBg = dark ? "#1e293b" : "#f8fafc";

  const close = () => { setShowNotifs(false); setShowProfile(false); };

  return (
    <header style={{ height: 64, background: bg, borderBottom: `1px solid ${border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", position: "sticky", top: 0, zIndex: 5 }}>

      {/* Title */}
      <div>
        <h1 style={{ color: text, fontFamily: "'Outfit',sans-serif", fontSize: 20, fontWeight: 700, margin: 0 }}>{title}</h1>
        <p style={{ color: muted, fontFamily: "'Outfit',sans-serif", fontSize: 11, margin: 0 }}>
          {new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

        {/* Role switcher (dev / demo helper) */}
        <select value={user?.role ?? ""} onChange={(e) => { switchRole(e.target.value); close(); }}
          style={{ padding: "6px 10px", borderRadius: 8, background: cardBg, border: `1px solid ${border}`,
            color: text, fontSize: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
        </select>

        {/* Dark mode toggle */}
        <button onClick={toggle}
          style={{ width: 38, height: 38, borderRadius: 10, background: cardBg, border: `1px solid ${border}`,
            cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {dark ? "☀️" : "🌙"}
        </button>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button onClick={() => { setShowNotifs((s) => !s); setShowProfile(false); }}
            style={{ width: 38, height: 38, borderRadius: 10, background: cardBg, border: `1px solid ${border}`,
              cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            🔔
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: "50%",
                background: "#f43f5e", color: "#fff", fontSize: 9, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif" }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div style={{ position: "absolute", right: 0, top: 46, width: 330, background: dark ? "#1e293b" : "#ffffff",
              border: `1px solid ${border}`, borderRadius: 14, boxShadow: "0 20px 50px rgba(0,0,0,0.3)", zIndex: 100 }}>
              <div style={{ padding: "14px 16px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: text, fontWeight: 700, fontFamily: "'Outfit',sans-serif", fontSize: 14 }}>Notifications</span>
                <button onClick={markAllRead}
                  style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif" }}>
                  Mark all read
                </button>
              </div>
              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {notifs.map((n) => (
                  <div key={n.id} onClick={() => markRead(n.id)}
                    style={{ padding: "12px 16px", display: "flex", gap: 10, cursor: "pointer",
                      background: n.read ? "transparent" : dark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.04)",
                      borderBottom: `1px solid ${border}` }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{NOTIF_ICONS[n.type] ?? "•"}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: text, fontSize: 13, margin: 0, fontFamily: "'Outfit',sans-serif", lineHeight: 1.4 }}>{n.msg}</p>
                      <p style={{ color: muted, fontSize: 11, margin: "3px 0 0", fontFamily: "'Outfit',sans-serif" }}>{n.time}</p>
                    </div>
                    {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1", flexShrink: 0, marginTop: 5 }} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <button onClick={() => { setShowProfile((s) => !s); setShowNotifs(false); }}
          style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", border: "none", fontFamily: "'Outfit',sans-serif" }}>
          {user?.avatar ?? "??"}
        </button>
      </div>
    </header>
  );
}
