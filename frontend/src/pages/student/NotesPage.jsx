import { useState }         from "react";
import { useTheme }         from "@context/ThemeContext";
import { useNotifications } from "@context/NotificationContext";
import { ChartCard, Badge } from "@components/common";
import { MOCK_NOTES }       from "@constants/mockData";

export default function NotesPage() {
  const { dark }  = useTheme();
  const { toast } = useNotifications();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const cardBg = dark ? "#0d1526" : "#f8fafc";

  const subjects = ["All", ...new Set(MOCK_NOTES.map((n) => n.subject))];
  const shown    = MOCK_NOTES.filter((n) => {
    const matchSubject = filter === "All" || n.subject === filter;
    const matchSearch  = n.title.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  return (
    <div style={{ padding: 24, fontFamily: "'Outfit',sans-serif" }}>
      <ChartCard title="Notes & Resources">
        {/* Filter bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes…"
            style={{ flex: 1, minWidth: 200, padding: "8px 12px", borderRadius: 9, border: `1px solid ${border}`, background: dark ? "#1e293b" : "#f8fafc", color: text, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
          {subjects.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${border}`, background: filter === s ? "#6366f1" : "transparent", color: filter === s ? "#fff" : muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              {s}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
          {shown.map((n) => (
            <div key={n.id} style={{ padding: 16, borderRadius: 12, border: `1px solid ${border}`, background: cardBg }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <Badge label={n.subject} color={n.color} />
                <span style={{ fontSize: 10, color: muted, fontFamily: "inherit", background: dark ? "#1e293b" : "#f1f5f9", padding: "2px 7px", borderRadius: 5 }}>{n.version}</span>
              </div>
              <p style={{ color: text, fontSize: 14, fontWeight: 600, margin: "0 0 4px", lineHeight: 1.4, fontFamily: "inherit" }}>{n.title}</p>
              <p style={{ color: muted, fontSize: 12, margin: "0 0 12px", fontFamily: "inherit" }}>
                {n.type} · {n.size} · {n.date}
              </p>
              <div style={{ display: "flex", gap: 7 }}>
                <button onClick={() => toast(`Previewing: ${n.title}`, "info")}
                  style={{ flex: 1, padding: "7px 0", borderRadius: 8, background: `${n.color}18`, border: "none", color: n.color, fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                  👁 Preview
                </button>
                <button onClick={() => toast(`Downloading: ${n.title}`, "success")}
                  style={{ flex: 1, padding: "7px 0", borderRadius: 8, background: dark ? "#1e293b" : "#f1f5f9", border: "none", color: muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                  ⬇ Download
                </button>
              </div>
            </div>
          ))}
          {shown.length === 0 && (
            <div style={{ gridColumn: "1/-1", padding: "40px 0", textAlign: "center" }}>
              <p style={{ color: muted, fontSize: 14 }}>No notes match your filter.</p>
            </div>
          )}
        </div>
      </ChartCard>
    </div>
  );
}
