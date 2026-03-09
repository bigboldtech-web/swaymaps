import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          base: "#030712",
          elevated: "#0b1422",
          overlay: "#111827",
        },
        glass: {
          fill: "rgba(11,20,34,0.70)",
          border: "rgba(51,65,85,0.40)",
        },
      },
      backdropBlur: {
        xs: "4px",
        "2xl": "40px",
        "3xl": "64px",
      },
      boxShadow: {
        "glow-sm": "0 0 12px rgba(14,165,233,0.15)",
        "glow-md": "0 0 20px rgba(14,165,233,0.20)",
        "glow-lg": "0 0 40px rgba(14,165,233,0.25)",
        "glow-indigo": "0 0 20px rgba(99,102,241,0.20)",
        "glow-emerald": "0 0 20px rgba(16,185,129,0.20)",
        "glow-rose": "0 0 20px rgba(239,68,68,0.20)",
        "glass": "0 8px 32px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "shimmer": "shimmer 2s infinite linear",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "slide-in-right": "slideInRight 0.25s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(14,165,233,0.10)" },
          "50%": { boxShadow: "0 0 20px rgba(14,165,233,0.25)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
