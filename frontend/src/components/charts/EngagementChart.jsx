import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "@context/ThemeContext";

export default function EngagementChart({ data }) {
  const { dark } = useTheme();
  const muted    = dark ? "#64748b" : "#94a3b8";
  const border   = dark ? "#1e293b" : "#e2e8f0";

  const series = [
    { key: "logins",      color: "#6366f1", label: "Logins"      },
    { key: "completions", color: "#10b981", label: "Completions" },
    { key: "submissions", color: "#f59e0b", label: "Submissions" },
  ];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <defs>
          {series.map(({ key, color }) => (
            <linearGradient key={key} id={`eg_${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0}    />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={border} />
        <XAxis dataKey="day" tick={{ fill: muted, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: muted, fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: dark ? "#1e293b" : "#fff", border: `1px solid ${border}`, borderRadius: 8, fontFamily: "'Outfit',sans-serif" }} />
        <Legend wrapperStyle={{ fontFamily: "'Outfit',sans-serif", fontSize: 12 }} />
        {series.map(({ key, color, label }) => (
          <Area key={key} type="monotone" dataKey={key} stroke={color} fill={`url(#eg_${key})`} strokeWidth={2} name={label} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
