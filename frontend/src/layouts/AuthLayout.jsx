import { useTheme } from "@context/ThemeContext";

export default function AuthLayout({ children }) {
  const { dark } = useTheme();

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#030712" : "#f8fafc",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Outfit',sans-serif", padding: 20, position: "relative", overflow: "hidden" }}>

      {/* Ambient background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -120, left: -120, width: 420, height: 420,
          borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 360, height: 360,
          borderRadius: "50%", background: "radial-gradient(circle,rgba(245,158,11,0.12) 0%,transparent 70%)" }} />
        <div style={{ position: "absolute", top: "50%", right: "20%", width: 200, height: 200,
          borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.08) 0%,transparent 70%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440 }}>
        {children}
      </div>
    </div>
  );
}
