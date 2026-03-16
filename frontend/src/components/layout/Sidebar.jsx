import { useAuth }    from "@context/AuthContext";
import { useTheme }   from "@context/ThemeContext";
import { NAV_CONFIG } from "@constants/navConfig";

export default function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const { dark }         = useTheme();
  const nav = NAV_CONFIG[user?.role] ?? [];

  const bg        = dark ? "#0a0f1e" : "#1e293b";
  const activeBg  = "rgba(99,102,241,0.18)";
  const hoverBg   = "rgba(255,255,255,0.05)";

  return (
    <aside style={{ width: collapsed ? 64 : 240, minHeight: "100vh", background: bg,
      display: "flex", flexDirection: "column", transition: "width 0.25s ease",
      borderRight: "1px solid rgba(255,255,255,0.06)", flexShrink: 0, position: "relative", zIndex: 10 }}>

      {/* Logo */}
      <div style={{ padding: collapsed ? "20px 14px" : "20px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10, height: 64 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎓</div>
        {!collapsed && (
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: -0.3, fontFamily: "'Outfit',sans-serif" }}>LearnHub</span>
        )}
      </div>

      {/* Navigation links */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {nav.map((item) => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)}
              title={collapsed ? item.label : undefined}
              style={{ width: "100%", padding: collapsed ? "11px" : "11px 14px", borderRadius: 10, border: "none",
                background: isActive ? activeBg : "transparent",
                color: isActive ? "#818cf8" : "rgba(255,255,255,0.55)",
                cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                fontFamily: "'Outfit',sans-serif", fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                marginBottom: 2, transition: "all 0.15s", textAlign: "left",
                borderLeft: isActive ? "3px solid #6366f1" : "3px solid transparent",
                justifyContent: collapsed ? "center" : "flex-start" }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = hoverBg; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
              <span style={{ fontSize: 17, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* User card + controls */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {!collapsed && user && (
          <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.04)", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>
                {user.avatar}
              </div>
              <div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>{user.name}</div>
                <div style={{ color: "#6366f1", fontSize: 11, textTransform: "capitalize", fontFamily: "'Outfit',sans-serif" }}>{user.role}</div>
              </div>
            </div>
          </div>
        )}

        <button onClick={logout}
          style={{ width: "100%", padding: collapsed ? "10px" : "10px 14px", borderRadius: 10, background: "transparent",
            border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8, fontFamily: "'Outfit',sans-serif", fontSize: 13,
            justifyContent: collapsed ? "center" : "flex-start" }}>
          <span style={{ fontSize: 16 }}>⏻</span>
          {!collapsed && "Logout"}
        </button>

        <button onClick={() => setCollapsed((c) => !c)}
          style={{ width: "100%", padding: collapsed ? "10px" : "10px 14px", borderRadius: 10, background: "transparent",
            border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8, fontFamily: "'Outfit',sans-serif", fontSize: 13,
            justifyContent: collapsed ? "center" : "flex-start" }}>
          <span style={{ fontSize: 14, transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>◀</span>
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}
