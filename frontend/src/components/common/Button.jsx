import { useTheme } from "@context/ThemeContext";

const VARIANTS = {
  primary:  "bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90",
  success:  "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90",
  danger:   "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:opacity-90",
  warning:  "bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:opacity-90",
  ghost:    "bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-700",
  outline:  "bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10",
};

const SIZES = {
  sm:  "px-3 py-1.5 text-xs rounded-lg",
  md:  "px-4 py-2.5 text-sm rounded-xl",
  lg:  "px-6 py-3   text-base rounded-xl",
  xl:  "px-8 py-4   text-lg rounded-2xl",
};

export default function Button({
  children,
  variant = "primary",
  size    = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  onClick,
  type = "button",
  className = "",
}) {
  const { dark } = useTheme();
  const base = "font-outfit font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : icon ? (
        <span>{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
