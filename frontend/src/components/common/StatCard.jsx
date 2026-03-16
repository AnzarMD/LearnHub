import { useTheme } from "@context/ThemeContext";

export default function StatCard({ label, value, sub, icon, color = "#6366f1", trend }) {
  const { dark } = useTheme();

  const bg     = dark ? "#0f172a" : "#ffffff";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";

  const trendColor = trend > 0 ? "#10b981" : trend < 0 ? "#f43f5e" : muted;
  const barWidth   = Math.min(100, Math.abs(trend ?? 60));

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: "20px 22px", boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ color: muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px", fontFamily: "'Outfit', sans-serif" }}>{label}</p>
          <p style={{ color: text, fontSize: 28, fontWeight: 800, margin: "0 0 4px", fontFamily: "'Outfit', sans-serif" }}>{value}</p>
          {sub && <p style={{ color: trendColor, fontSize: 12, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{sub}</p>}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
          {icon}
        </div>
      </div>
      <div style={{ height: 3, borderRadius: 2, background: dark ? "#1e293b" : "#f1f5f9", marginTop: 16 }}>
        <div style={{ height: "100%", width: `${barWidth}%`, borderRadius: 2, background: `linear-gradient(90deg, ${color}, ${color}88)`, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}
