import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "@context/ThemeContext";

export default function EnrollmentPie({ data }) {
  const { dark } = useTheme();
  const border   = dark ? "#1e293b" : "#e2e8f0";
  const muted    = dark ? "#64748b" : "#94a3b8";

  return (
    <>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={82} paddingAngle={3} dataKey="value">
            {data.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Pie>
          <Tooltip contentStyle={{ background: dark ? "#1e293b" : "#fff", border: `1px solid ${border}`, borderRadius: 8, fontFamily: "'Outfit',sans-serif" }} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {data.map((e) => (
          <span key={e.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: muted, fontFamily: "'Outfit',sans-serif" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: e.color, display: "inline-block" }} />
            {e.name}
          </span>
        ))}
      </div>
    </>
  );
}
