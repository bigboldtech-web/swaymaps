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
        brand: {
          300: "#5ec0f0",   // Light — text on dark bg
          400: "#29a5e5",   // Logo right (sky blue)
          500: "#2192dd",   // Mid-point
          600: "#1a80d5",   // Logo left (darker blue)
          700: "#1568b5",   // Darkest — borders, hover
        },
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
        "glow-sm": "0 0 12px rgba(26,128,213,0.15)",
        "glow-md": "0 0 20px rgba(26,128,213,0.20)",
        "glow-lg": "0 0 40px rgba(26,128,213,0.25)",
        "glow-brand": "0 0 20px rgba(33,146,221,0.20)",
        "glow-emerald": "0 0 20px rgba(16,185,129,0.20)",
        "glow-rose": "0 0 20px rgba(239,68,68,0.20)",
        "glass": "0 8px 32px rgba(0,0,0,0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-out": "fadeOut 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-left": "slideInLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-out-left": "slideOutLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-right": "slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-out-right": "slideOutRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-out": "scaleOut 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "shimmer": "shimmer 2s infinite linear",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "bounce-in": "bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "presence-ping": "presencePing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "toast-in": "toastIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "toast-out": "toastOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideOutLeft: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(-100%)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideOutRight: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(100%)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        scaleOut: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.92)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(26,128,213,0.08)" },
          "50%": { boxShadow: "0 0 24px rgba(26,128,213,0.22)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        presencePing: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
        toastIn: {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        toastOut: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(8px) scale(0.95)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.16, 1, 0.3, 1)",
        "bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        "250": "250ms",
        "350": "350ms",
        "400": "400ms",
      },
    },
  },
  plugins: [],
};

export default config;
