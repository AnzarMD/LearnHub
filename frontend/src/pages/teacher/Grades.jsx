import { useState }         from "react";
import { useTheme }         from "@context/ThemeContext";
import { useNotifications } from "@context/NotificationContext";
import { ChartCard, Badge } from "@components/common";

const SUBMISSIONS = [
  { id: 1, student: "Rahul Singh",  assignment: "Calculus Set 4",       submitted: "Mar 2", score: null,  file: "set4.pdf"     },
  { id: 2, student: "Kavya Nair",   assignment: "Calculus Set 4",       submitted: "Mar 2", score: 88,    file: "kavya_s4.pdf"  },
  { id: 3, student: "Aditya Rao",   assignment: "Lab Report: Motion",   submitted: "Mar 3", score: null,  file: "aditya_lr.pdf" },
  { id: 4, student: "Sneha Patel",  assignment: "Lab Report: Motion",   submitted: "Mar 1", score: 94,    file: "sneha_lr.pdf"  },
  { id: 5, student: "Vikram Joshi", assignment: "Essay: Ind. Revolution",submitted: "Mar 3", score: null,  file: "vikram_e.pdf"  },
];

export default function GradesPage() {
  const { dark }  = useTheme();
  const { toast } = useNotifications();
  const [scores, setScores] = useState({});

  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const inputBg = dark ? "#1e293b" : "#f8fafc";

  return (
    <div style={{ padding: 24, fontFamily: "'Outfit',sans-serif" }}>
      <ChartCard title="Submissions & Grading">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["Student", "Assignment", "Submitted", "File", "Score", "Action"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUBMISSIONS.map((s) => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${border}` }}>
                  <td style={{ padding: "12px", color: text, fontSize: 14, fontWeight: 500 }}>{s.student}</td>
                  <td style={{ padding: "12px", color: muted, fontSize: 13 }}>{s.assignment}</td>
                  <td style={{ padding: "12px", color: muted, fontSize: 13 }}>{s.submitted}</td>
                  <td style={{ padding: "12px" }}>
                    <button onClick={() => toast(`Opening ${s.file}`, "info")} style={{ padding: "4px 10px", borderRadius: 6, background: "#6366f115", border: "none", color: "#6366f1", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                      📎 {s.file}
                    </button>
                  </td>
                  <td style={{ padding: "12px" }}>
                    {s.score !== null ? (
                      <span style={{ color: "#10b981", fontWeight: 700, fontSize: 15 }}>{s.score}/100</span>
                    ) : (
                      <input type="number" min="0" max="100" value={scores[s.id] ?? ""} onChange={(e) => setScores((sc) => ({ ...sc, [s.id]: e.target.value }))}
                        placeholder="0–100"
                        style={{ width: 70, padding: "5px 8px", borderRadius: 7, border: `1px solid ${border}`, background: inputBg, color: text, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {s.score === null && (
                      <button onClick={() => toast(`Graded ${s.student}: ${scores[s.id] ?? "N/A"}/100`, "success")}
                        style={{ padding: "5px 12px", borderRadius: 7, background: "linear-gradient(135deg,#10b981,#059669)", border: "none", color: "#fff", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                        Submit Grade
                      </button>
                    )}
                    {s.score !== null && <Badge label="Graded" status="submitted" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
