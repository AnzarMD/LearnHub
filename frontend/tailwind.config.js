/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          900: "#1e1b4b",
        },
        surface: {
          900: "#030712",
          800: "#0a0f1e",
          700: "#0d1526",
          600: "#0f172a",
          500: "#1e293b",
          400: "#334155",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.25)",
        "card-hover": "0 8px 32px rgba(99,102,241,0.15)",
      },
      animation: {
        "slide-in": "slideIn 0.3s ease",
        "fade-in": "fadeIn 0.2s ease",
      },
      keyframes: {
        slideIn: {
          from: { transform: "translateX(100px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
