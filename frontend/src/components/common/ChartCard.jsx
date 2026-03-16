import { useTheme } from "@context/ThemeContext";

export default function ChartCard({ title, children, action, style = {} }) {
  const { dark } = useTheme();

  const bg     = dark ? "#0f172a" : "#ffffff";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const text   = dark ? "#f1f5f9" : "#0f172a";

  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: "20px 22px", boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.05)", ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ color: text, fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 700, margin: 0 }}>{title}</h3>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}
