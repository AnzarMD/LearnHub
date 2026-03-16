import { useEffect, useState } from "react";
import { useTheme }             from "@context/ThemeContext";
import { useNotifications }     from "@context/NotificationContext";
import { useTimer }             from "@hooks/useTimer";
import { formatCountdown }      from "@utils/formatters";
import { MOCK_TEST_QUESTIONS }  from "@constants/mockData";

const TEST_DURATION = 300; // 5 minutes

export default function OnlineTest() {
  const { dark }  = useTheme();
  const { toast } = useNotifications();

  const [phase,    setPhase]    = useState("lobby"); // lobby | test | result
  const [answers,  setAnswers]  = useState({});
  const [current,  setCurrent]  = useState(0);
  const [questions, setQuestions] = useState([]);
  const [result,   setResult]   = useState(null);

  const { timeLeft, isRunning, start, reset } = useTimer(TEST_DURATION, handleAutoSubmit);

  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const cardBg = dark ? "#0f172a" : "#ffffff";

  function handleAutoSubmit() {
    toast("Time's up! Auto-submitting your test.", "warning");
    finalize();
  }

  function finalize() {
    const qs      = questions.length ? questions : MOCK_TEST_QUESTIONS;
    const correct = qs.filter((q, i) => answers[i] === q.correct).length;
    setResult({ correct, total: qs.length, pct: Math.round((correct / qs.length) * 100) });
    setPhase("result");
  }

  const startTest = () => {
    const shuffled = [...MOCK_TEST_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setAnswers({});
    setCurrent(0);
    reset(TEST_DURATION);
    start();
    setPhase("test");
    toast("Test started — good luck!", "info");
  };

  const retake = () => { reset(TEST_DURATION); setResult(null); setPhase("lobby"); };

  const q = questions[current];
  const urgent = timeLeft < 60;

  return (
    <div style={{ padding: 24, fontFamily: "'Outfit',sans-serif" }}>

      {/* ── LOBBY ── */}
      {phase === "lobby" && (
        <div style={{ maxWidth: 540, margin: "40px auto", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 14 }}>🧪</div>
          <h2 style={{ color: text, fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>Math &amp; Science Quiz</h2>
          <p style={{ color: muted, fontSize: 14, margin: "0 0 28px" }}>
            {MOCK_TEST_QUESTIONS.length} questions · 5 minutes · Auto-submit on timeout
          </p>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 18, padding: 24, marginBottom: 28, textAlign: "left" }}>
            {[["Questions", `${MOCK_TEST_QUESTIONS.length} MCQ`], ["Duration", "5 minutes"], ["Passing Score", "60%"], ["Auto-submit", "On timer end"], ["Randomized", "Yes, questions shuffled"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${border}` }}>
                <span style={{ color: muted, fontSize: 14 }}>{k}</span>
                <span style={{ color: text, fontSize: 14, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={startTest}
            style={{ padding: "14px 44px", borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Start Test →
          </button>
        </div>
      )}

      {/* ── TEST ── */}
      {phase === "test" && q && (
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <span style={{ color: text, fontSize: 14, fontWeight: 600 }}>Question {current + 1} of {questions.length}</span>
            <span style={{ padding: "8px 18px", borderRadius: 9, background: urgent ? "#f43f5e20" : "#f59e0b20", color: urgent ? "#f43f5e" : "#f59e0b", fontWeight: 700, fontSize: 16 }}>
              ⏱ {formatCountdown(timeLeft)}
            </span>
          </div>

          {/* Progress */}
          <div style={{ height: 4, background: dark ? "#1e293b" : "#f1f5f9", borderRadius: 2, marginBottom: 22 }}>
            <div style={{ width: `${((current + 1) / questions.length) * 100}%`, height: "100%", borderRadius: 2, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", transition: "width 0.3s" }} />
          </div>

          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 20, padding: 28 }}>
            <h3 style={{ color: text, fontSize: 17, fontWeight: 700, lineHeight: 1.5, margin: "0 0 22px" }}>{q.q}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt, i) => {
                const selected = answers[current] === i;
                return (
                  <button key={i} onClick={() => setAnswers((a) => ({ ...a, [current]: i }))}
                    style={{ padding: "13px 18px", borderRadius: 12, border: `2px solid ${selected ? "#6366f1" : border}`, background: selected ? "#6366f118" : "transparent", color: selected ? "#818cf8" : text, cursor: "pointer", textAlign: "left", fontSize: 14, fontFamily: "inherit", transition: "all 0.15s", fontWeight: selected ? 600 : 400 }}>
                    <span style={{ marginRight: 10, color: muted, fontWeight: 600 }}>{"ABCD"[i]}.</span>{opt}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
              <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
                style={{ padding: "10px 20px", borderRadius: 10, border: `1px solid ${border}`, background: "transparent", color: text, cursor: current === 0 ? "not-allowed" : "pointer", opacity: current === 0 ? 0.4 : 1, fontFamily: "inherit", fontSize: 14 }}>
                ← Prev
              </button>
              {current < questions.length - 1 ? (
                <button onClick={() => setCurrent((c) => c + 1)}
                  style={{ padding: "10px 22px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}>Next →</button>
              ) : (
                <button onClick={finalize}
                  style={{ padding: "10px 22px", borderRadius: 10, background: "linear-gradient(135deg,#10b981,#059669)", border: "none", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}>Submit ✓</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {phase === "result" && result && (
        <div style={{ maxWidth: 480, margin: "40px auto", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{result.pct >= 60 ? "🎉" : "😔"}</div>
          <h2 style={{ color: text, fontSize: 24, fontWeight: 800, margin: "0 0 6px" }}>Test Submitted!</h2>
          <p style={{ color: muted, fontSize: 14, margin: "0 0 24px" }}>Here's how you did</p>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 20, padding: 32, marginBottom: 24 }}>
            <div style={{ fontSize: 56, fontWeight: 900, color: result.pct >= 60 ? "#10b981" : "#f43f5e", marginBottom: 4 }}>{result.correct}/{result.total}</div>
            <div style={{ color: muted, fontSize: 15, marginBottom: 20 }}>{result.pct}% correct · {result.pct >= 60 ? "Passed 🎯" : "Keep practising 📖"}</div>
            {questions.map((q, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: `1px solid ${border}`, textAlign: "left" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{answers[i] === q.correct ? "✅" : "❌"}</span>
                <div>
                  <p style={{ color: text, fontSize: 13, margin: 0, lineHeight: 1.4 }}>{q.q}</p>
                  {answers[i] !== q.correct && (
                    <p style={{ color: "#10b981", fontSize: 12, margin: "3px 0 0" }}>✓ {q.options[q.correct]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button onClick={retake}
            style={{ padding: "12px 32px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontSize: 15, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            Retake Test
          </button>
        </div>
      )}
    </div>
  );
}
