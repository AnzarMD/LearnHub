import { useTheme } from "@context/ThemeContext";

export function Spinner({ size = 24, color = "#6366f1" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
      <style>{"@keyframes spin { to { transform: rotate(360deg) } }"}</style>
      <circle cx="12" cy="12" r="10" stroke={color} strokeOpacity="0.25" strokeWidth="3" />
      <path d="M12 2a10 10 0 0110 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function PageLoader() {
  const { dark } = useTheme();
  return (
    <div style={{ minHeight: "100vh", background: dark ? "#030712" : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <Spinner size={40} />
      <p style={{ color: "#64748b", fontFamily: "'Outfit', sans-serif", fontSize: 14 }}>Loading LearnHub…</p>
    </div>
  );
}

export function SkeletonCard({ height = 120 }) {
  const { dark } = useTheme();
  return (
    <div style={{ height, borderRadius: 16, background: dark ? "#1e293b" : "#f1f5f9", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)", animation: "shimmer 1.4s infinite" }} />
      <style>{"@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }"}</style>
    </div>
  );
}

export default Spinner;
