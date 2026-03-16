import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "@context/ThemeContext";

export default function AttendanceChart({ data }) {
  const { dark } = useTheme();
  const muted    = dark ? "#64748b" : "#94a3b8";
  const border   = dark ? "#1e293b" : "#e2e8f0";

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="gradPresent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
          </linearGradient>
          <linearGradient id="gradAbsent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={border} />
        <XAxis dataKey="month" tick={{ fill: muted, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: muted, fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: dark ? "#1e293b" : "#fff", border: `1px solid ${border}`, borderRadius: 8, fontFamily: "'Outfit',sans-serif" }} />
        <Area type="monotone" dataKey="present" stroke="#10b981" fill="url(#gradPresent)" strokeWidth={2.5} name="Present" />
        <Area type="monotone" dataKey="absent"  stroke="#f43f5e" fill="url(#gradAbsent)"  strokeWidth={2} strokeDasharray="5 5" name="Absent" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
