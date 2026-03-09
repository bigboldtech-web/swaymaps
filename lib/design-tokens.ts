// SwayMaps Design Tokens — Dark Glassmorphism Theme
// Single source of truth for colors, glass effects, shadows, and spacing

export const colors = {
  // Surfaces
  surface: {
    base: "#030712",       // Main background (gray-950)
    elevated: "#0b1422",   // Cards, panels
    overlay: "#111827",    // Modals overlay base
    glass: "rgba(11,20,34,0.70)",     // Glass panel fill
    glassHover: "rgba(11,20,34,0.85)", // Glass panel hover
    glassBorder: "rgba(51,65,85,0.40)", // Glass border (slate-700/40)
  },

  // Text
  text: {
    primary: "#f1f5f9",    // slate-100
    secondary: "#94a3b8",  // slate-400
    muted: "#64748b",      // slate-500
    disabled: "#475569",   // slate-600
    inverse: "#0f172a",    // slate-900
  },

  // Accent — brand gradient from logo
  accent: {
    light: "#29a5e5",      // brand-400 (logo right)
    primary: "#2192dd",    // brand-500 (mid)
    dark: "#1a80d5",       // brand-600 (logo left)
    gradient: "linear-gradient(135deg, #1a80d5, #29a5e5)",
  },

  // Semantic
  success: { base: "#10b981", glow: "rgba(16,185,129,0.20)" },   // emerald-500
  warning: { base: "#f59e0b", glow: "rgba(245,158,11,0.20)" },   // amber-500
  error:   { base: "#ef4444", glow: "rgba(239,68,68,0.20)" },     // red-500
  info:    { base: "#2192dd", glow: "rgba(33,146,221,0.20)" },    // brand-500

  // Borders
  border: {
    subtle: "rgba(51,65,85,0.40)",   // slate-700/40
    medium: "rgba(51,65,85,0.60)",   // slate-700/60
    strong: "#334155",               // slate-700
    glow: "rgba(26,128,213,0.30)",   // brand-600/30
  },

  // Node kind accent colors
  nodeKind: {
    person: "#38bdf8",
    system: "#22c55e",
    process: "#fbbf24",
    generic: "#6366f1",
    database: "#818cf8",
    api: "#0ea5e9",
    queue: "#f59e0b",
    cache: "#ef4444",
    cloud: "#8b5cf6",
    team: "#14b8a6",
    vendor: "#f97316",
  },
} as const;

export const glass = {
  panel: "bg-[#0b1422]/70 backdrop-blur-xl border border-slate-700/40",
  panelHover: "bg-[#0b1422]/85 backdrop-blur-xl border border-slate-700/60",
  card: "bg-slate-900/60 backdrop-blur-lg border border-slate-700/40 rounded-2xl",
  input: "bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm",
  inputFocus: "ring-1 ring-brand-500/50 border-brand-500/50",
  overlay: "bg-black/60 backdrop-blur-sm",
  modal: "bg-[#0b1422]/90 backdrop-blur-2xl border border-slate-700/40 rounded-2xl shadow-2xl",
} as const;

export const shadows = {
  sm: "0 1px 3px rgba(0,0,0,0.3)",
  md: "0 4px 12px rgba(0,0,0,0.4)",
  lg: "0 8px 32px rgba(0,0,0,0.5)",
  glow: {
    brand: "0 0 20px rgba(26,128,213,0.15)",
    brandLight: "0 0 20px rgba(41,165,229,0.15)",
    emerald: "0 0 20px rgba(16,185,129,0.15)",
    rose: "0 0 20px rgba(239,68,68,0.15)",
  },
} as const;
