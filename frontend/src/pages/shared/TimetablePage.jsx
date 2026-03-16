import { useTheme }         from "@context/ThemeContext";
import { ChartCard }        from "@components/common";
import { MOCK_TIMETABLE }   from "@constants/mockData";
import { SUBJECT_COLORS }   from "@constants/navConfig";

const DAYS        = ["mon", "tue", "wed", "thu", "fri"];
const DAY_LABELS  = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetablePage() {
  const { dark } = useTheme();
  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const border = dark ? "#1e293b" : "#e2e8f0";

  return (
    <div style={{ padding: 24, fontFamily: "'Outfit',sans-serif" }}>
      <ChartCard title="Weekly Timetable">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ padding: "8px 12px", color: muted, fontSize: 12, fontWeight: 600, textAlign: "left", width: 72 }}>Time</th>
                {DAY_LABELS.map((d) => (
                  <th key={d} style={{ padding: "8px 12px", color: text, fontSize: 13, fontWeight: 700, textAlign: "center" }}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TIMETABLE.map((row, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${border}` }}>
                  <td style={{ padding: "10px 12px", color: muted, fontSize: 12, fontWeight: 600 }}>{row.time}</td>
                  {DAYS.map((d) => {
                    const cls   = row[d];
                    const color = SUBJECT_COLORS[cls] ?? "#64748b";
                    const isFree  = cls === "Free";
                    const isLunch = cls === "Lunch";
                    return (
                      <td key={d} style={{ padding: "6px 8px", textAlign: "center" }}>
                        {!isFree && !isLunch ? (
                          <div style={{ padding: "7px 10px", borderRadius: 8, background: `${color}20`, border: `1px solid ${color}40`, color, fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                            {cls}
                          </div>
                        ) : (
                          <div style={{ padding: "7px 10px", borderRadius: 8, background: dark ? "#1e293b" : "#f8fafc", color: muted, fontSize: 11, fontFamily: "inherit" }}>
                            {cls}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
