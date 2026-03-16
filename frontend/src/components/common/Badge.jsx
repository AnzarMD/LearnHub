import { STATUS_COLORS } from "@constants/navConfig";

export default function Badge({ label, status, color, size = "sm" }) {
  const bg  = color ?? STATUS_COLORS[status] ?? "#64748b";
  const pad = size === "sm" ? "2px 8px" : "4px 12px";
  const fs  = size === "sm" ? 11 : 13;

  return (
    <span style={{ padding: pad, borderRadius: 20, fontSize: fs, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
      background: `${bg}20`, color: bg, whiteSpace: "nowrap" }}>
      {label ?? status}
    </span>
  );
}
