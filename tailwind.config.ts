import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic — the only colors components should use
        bg: {
          DEFAULT: "var(--color-bg)",
          subtle: "var(--color-bg-subtle)",
          muted: "var(--color-bg-muted)",
        },
        panel: {
          DEFAULT: "var(--color-panel)",
          hover: "var(--color-panel-hover)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
          focus: "var(--color-border-focus)",
        },
        fg: {
          DEFAULT: "var(--color-fg)",
          muted: "var(--color-fg-muted)",
          subtle: "var(--color-fg-subtle)",
          disabled: "var(--color-fg-disabled)",
          inverted: "var(--color-fg-inverted)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          active: "var(--color-accent-active)",
          fg: "var(--color-accent-fg)",
          subtle: "var(--color-accent-subtle)",
          "subtle-hover": "var(--color-accent-subtle-hover)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          subtle: "var(--color-success-subtle)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          subtle: "var(--color-warning-subtle)",
        },
        danger: {
          DEFAULT: "var(--color-danger)",
          subtle: "var(--color-danger-subtle)",
        },
        info: {
          DEFAULT: "var(--color-info)",
          subtle: "var(--color-info-subtle)",
        },

        // Legacy aliases — keep until codemod completes
        brand: {
          300: "var(--color-accent)",
          400: "var(--color-accent)",
          500: "var(--color-accent)",
          600: "var(--color-accent-hover)",
          700: "var(--color-accent-active)",
        },
        surface: {
          base: "var(--color-bg)",
          elevated: "var(--color-panel)",
          overlay: "var(--color-panel)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        eyebrow: ["var(--font-eyebrow)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        // Linear-scale, tight line-heights
        "xs":   ["11px", { lineHeight: "16px", letterSpacing: "0" }],
        "sm":   ["13px", { lineHeight: "20px", letterSpacing: "-0.005em" }],
        "base": ["14px", { lineHeight: "22px", letterSpacing: "-0.005em" }],
        "md":   ["15px", { lineHeight: "24px", letterSpacing: "-0.01em" }],
        "lg":   ["18px", { lineHeight: "28px", letterSpacing: "-0.01em" }],
        "xl":   ["22px", { lineHeight: "30px", letterSpacing: "-0.015em" }],
        "2xl":  ["28px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
        "3xl":  ["36px", { lineHeight: "44px", letterSpacing: "-0.022em" }],
        "4xl":  ["48px", { lineHeight: "56px", letterSpacing: "-0.025em" }],
        "5xl":  ["60px", { lineHeight: "68px", letterSpacing: "-0.03em" }],
        "6xl":  ["72px", { lineHeight: "80px", letterSpacing: "-0.035em" }],
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        overlay: "var(--shadow-overlay)",
        // Legacy aliases neutralized
        "glow-sm": "var(--shadow-sm)",
        "glow-md": "var(--shadow-sm)",
        "glow-lg": "var(--shadow-md)",
        "glow-brand": "var(--shadow-sm)",
        "glow-emerald": "var(--shadow-sm)",
        "glow-rose": "var(--shadow-sm)",
        "glass": "var(--shadow-md)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        spring: "var(--ease-out)",
        bounce: "var(--ease-out)",
        smooth: "var(--ease-out)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        DEFAULT: "var(--dur-base)",
        slow: "var(--dur-slow)",
        "250": "240ms",
        "350": "240ms",
        "400": "240ms",
      },
      animation: {
        "fade-in": "fadeIn 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-out": "fadeOut 120ms cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-up": "slideUp 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-down": "slideDown 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-in-left": "slideInLeft 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-out-left": "slideOutLeft 120ms cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-in-right": "slideInRight 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        "slide-out-right": "slideOutRight 120ms cubic-bezier(0.22, 1, 0.36, 1)",
        "scale-in": "scaleIn 120ms cubic-bezier(0.22, 1, 0.36, 1)",
        "scale-out": "scaleOut 100ms cubic-bezier(0.22, 1, 0.36, 1)",
        // Legacy — neutralized to short fade
        "shimmer": "fadeIn 180ms",
        "glow-pulse": "fadeIn 180ms",
        "spin-slow": "spin 3s linear infinite",
        "bounce-in": "scaleIn 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        "pulse-soft": "fadeIn 180ms",
        "presence-ping": "fadeIn 180ms",
        "toast-in": "slideUp 180ms cubic-bezier(0.22, 1, 0.36, 1)",
        "toast-out": "fadeOut 120ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "float": "fadeIn 180ms",
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
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideOutLeft: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(-8px)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideOutRight: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(8px)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        scaleOut: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.97)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
