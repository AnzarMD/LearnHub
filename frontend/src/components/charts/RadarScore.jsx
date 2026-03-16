import { RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "@context/ThemeContext";

export default function RadarScore({ data }) {
  const { dark } = useTheme();
  const border   = dark ? "#1e293b" : "#e2e8f0";
  const muted    = dark ? "#64748b" : "#94a3b8";

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke={border} />
        <PolarAngleAxis dataKey="subject" tick={{ fill: muted, fontSize: 12, fontFamily: "'Outfit',sans-serif" }} />
        <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.28} />
        <Tooltip contentStyle={{ background: dark ? "#1e293b" : "#fff", border: `1px solid ${border}`, borderRadius: 8, fontFamily: "'Outfit',sans-serif" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
