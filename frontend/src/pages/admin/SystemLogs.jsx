import { useState }         from "react";
import { useTheme }         from "@context/ThemeContext";
import { ChartCard, Badge } from "@components/common";
import { MOCK_LOGS }        from "@constants/mockData";

const LEVEL_COLORS = { info: "#6366f1", warning: "#f59e0b", error: "#f43f5e" };

export default function SystemLogs() {
  const { dark } = useTheme();
  const [filter, setFilter] = useState("all");

  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const rowBg  = dark ? "#0d1526" : "#f8fafc";

  const shown = filter === "all" ? MOCK_LOGS : MOCK_LOGS.filter((l) => l.level === filter);

  return (
    <div style={{ padding: 24, fontFamily: "'Outfit',sans-serif" }}>
      <ChartCard title="System Logs">
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {["all", "info", "warning", "error"].map((l) => (
            <button key={l} onClick={() => setFilter(l)}
              style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${border}`, background: filter === l ? (LEVEL_COLORS[l] ?? "#6366f1") : "transparent", color: filter === l ? "#fff" : muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
              {l === "all" ? "All" : l}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {shown.map((log) => (
            <div key={log.id} style={{ padding: "12px 16px", borderRadius: 10, background: rowBg, border: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18 }}>{log.level === "info" ? "ℹ️" : log.level === "warning" ? "⚠️" : "❌"}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: text, fontSize: 13, fontWeight: 500, margin: 0, fontFamily: "inherit" }}>{log.msg}</p>
                <p style={{ color: muted, fontSize: 11, margin: "3px 0 0", fontFamily: "inherit" }}>{log.time} · IP {log.ip}</p>
              </div>
              <Badge status={log.level} color={LEVEL_COLORS[log.level]} />
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
