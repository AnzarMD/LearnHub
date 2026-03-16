import { useEffect } from "react";
import { useTheme } from "@context/ThemeContext";

export default function Modal({ open, onClose, title, children, maxWidth = 520 }) {
  const { dark } = useTheme();

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  const bg     = dark ? "#0f172a" : "#ffffff";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }} />
      {/* Panel */}
      <div style={{ position: "relative", background: bg, border: `1px solid ${border}`, borderRadius: 20, width: "100%", maxWidth, padding: 28, boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: text, fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: muted, fontSize: 22, lineHeight: 1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
