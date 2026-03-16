import { useState }         from "react";
import { useTheme }         from "@context/ThemeContext";
import { useNotifications } from "@context/NotificationContext";
import { ChartCard }        from "@components/common";
import { MOCK_MESSAGES, MOCK_CONTACTS } from "@constants/mockData";

export default function MessagesPage() {
  const { dark }  = useTheme();
  const { toast } = useNotifications();
  const [activeChat, setActiveChat] = useState(0);
  const [msgs,       setMsgs]       = useState(MOCK_MESSAGES);
  const [input,      setInput]       = useState("");

  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const cardBg = dark ? "#0f172a" : "#ffffff";

  const send = () => {
    if (!input.trim()) return;
    const mine = { id: Date.now(), from: "You", mine: true, msg: input, time: "Now" };
    setMsgs((m) => [...m, mine]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { id: Date.now() + 1, from: MOCK_CONTACTS[activeChat].name, mine: false, msg: "Thanks! I'll get back to you shortly.", time: "Just now" }]);
    }, 900);
  };

  return (
    <div style={{ padding: 24, fontFamily: "'Outfit',sans-serif" }}>
      <div style={{ display: "flex", gap: 16, height: 520 }}>
        {/* Contact list */}
        <div style={{ width: 256, background: cardBg, border: `1px solid ${border}`, borderRadius: 16, overflow: "hidden", flexShrink: 0 }}>
          <div style={{ padding: 14, borderBottom: `1px solid ${border}` }}>
            <input placeholder="Search conversations…"
              style={{ width: "100%", padding: "7px 11px", borderRadius: 8, border: `1px solid ${border}`, background: dark ? "#1e293b" : "#f8fafc", color: text, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          {MOCK_CONTACTS.map((c, i) => (
            <div key={c.id} onClick={() => setActiveChat(i)}
              style={{ padding: "13px 16px", cursor: "pointer", background: activeChat === i ? (dark ? "#1e293b" : "#f1f5f9") : "transparent", borderBottom: `1px solid ${border}`, display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>{c.avatar}</div>
                {c.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "#10b981", border: `2px solid ${dark ? "#0f172a" : "#fff"}` }} />}
              </div>
              <div>
                <p style={{ color: text, fontSize: 13, fontWeight: 600, margin: 0, fontFamily: "inherit" }}>{c.name}</p>
                <p style={{ color: muted, fontSize: 11, margin: "2px 0 0", fontFamily: "inherit" }}>{c.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat panel */}
        <div style={{ flex: 1, background: cardBg, border: `1px solid ${border}`, borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12 }}>
              {MOCK_CONTACTS[activeChat].avatar}
            </div>
            <div>
              <p style={{ color: text, fontSize: 14, fontWeight: 700, margin: 0, fontFamily: "inherit" }}>{MOCK_CONTACTS[activeChat].name}</p>
              <p style={{ color: MOCK_CONTACTS[activeChat].online ? "#10b981" : muted, fontSize: 11, margin: 0, fontFamily: "inherit" }}>
                {MOCK_CONTACTS[activeChat].online ? "● Online" : "○ Offline"}
              </p>
            </div>
          </div>
          {/* Messages */}
          <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.map((m) => (
              <div key={m.id} style={{ display: "flex", justifyContent: m.mine ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: m.mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: m.mine ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : dark ? "#1e293b" : "#f1f5f9", color: m.mine ? "#fff" : text }}>
                  {!m.mine && <p style={{ fontSize: 11, color: "#6366f1", fontWeight: 600, margin: "0 0 4px", fontFamily: "inherit" }}>{m.from}</p>}
                  <p style={{ fontSize: 13, margin: 0, lineHeight: 1.5, fontFamily: "inherit" }}>{m.msg}</p>
                  <p style={{ fontSize: 10, margin: "4px 0 0", opacity: 0.55, fontFamily: "inherit" }}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Input */}
          <div style={{ padding: "12px 20px", borderTop: `1px solid ${border}`, display: "flex", gap: 8 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message…"
              style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${border}`, background: dark ? "#1e293b" : "#f8fafc", color: text, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
            <button onClick={send}
              style={{ padding: "10px 18px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
              Send ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
