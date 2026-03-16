import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "@context/ThemeContext";

export default function PerformanceChart({ data }) {
  const { dark } = useTheme();
  const muted    = dark ? "#64748b" : "#94a3b8";
  const border   = dark ? "#1e293b" : "#e2e8f0";

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke={border} />
        <XAxis dataKey="subject" tick={{ fill: muted, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: muted, fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: dark ? "#1e293b" : "#fff", border: `1px solid ${border}`, borderRadius: 8, fontFamily: "'Outfit',sans-serif" }} />
        <Legend wrapperStyle={{ fontFamily: "'Outfit',sans-serif", fontSize: 12 }} />
        <Bar dataKey="score" fill="#6366f1" radius={[4,4,0,0]} name="My Score" />
        <Bar dataKey="avg"   fill="#94a3b8" radius={[4,4,0,0]} name="Class Avg" />
      </BarChart>
    </ResponsiveContainer>
  );
}
