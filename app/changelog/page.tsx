"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import "../landing/landing.css";

/* ═══ LOGO SVG ═══ */
function LogoMark() {
  return (
    <div className="logo-mark">
      <svg viewBox="0 0 40 40" fill="none" style={{ width: 24, height: 24 }}>
        <path d="M 28 10 C 12 10, 12 20, 20 20 C 28 20, 28 30, 12 30" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <circle cx="28" cy="10" r="3.5" fill="white" />
        <circle cx="20" cy="20" r="2.5" fill="white" opacity="0.6" />
        <circle cx="12" cy="30" r="3.5" fill="white" />
      </svg>
    </div>
  );
}

/* ═══ CHANGELOG DATA ═══ */
type ChangeType = "Added" | "Improved" | "Fixed";

interface ChangeItem {
  type: ChangeType;
  text: string;
}

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: ChangeItem[];
}

const changelogEntries: ChangelogEntry[] = [
  {
    version: "v2.4.0",
    date: "March 25, 2026",
    title: "AI Generation & Command Palette",
    description:
      "Two major productivity features: generate maps from natural language descriptions, and navigate your entire workspace with Cmd+K.",
    changes: [
      { type: "Added", text: "AI-powered map generation from text prompts" },
      { type: "Added", text: "Command palette with Cmd+K shortcut" },
      { type: "Added", text: "AI brainstorm mode for expanding maps" },
      { type: "Improved", text: "Node creation speed by 40%" },
    ],
  },
  {
    version: "v2.3.0",
    date: "March 10, 2026",
    title: "YAML DSL & Diagram as Code",
    description:
      "Define your dependency maps in YAML, version-control them in Git, and apply changes to the visual canvas.",
    changes: [
      { type: "Added", text: "YAML DSL editor with syntax validation" },
      { type: "Added", text: "Export maps to YAML format" },
      { type: "Added", text: "Import YAML to canvas" },
      { type: "Fixed", text: "Edge routing for complex layouts" },
    ],
  },
  {
    version: "v2.2.0",
    date: "February 20, 2026",
    title: "Version History & Diff Viewer",
    description:
      "Every change is now tracked. Compare versions side-by-side and restore any previous state with one click.",
    changes: [
      { type: "Added", text: "Auto-save version snapshots every 5 minutes" },
      { type: "Added", text: "Visual diff viewer for comparing versions" },
      { type: "Added", text: "One-click version restore" },
      { type: "Improved", text: "Save performance for large maps" },
    ],
  },
  {
    version: "v2.1.0",
    date: "February 5, 2026",
    title: "Slack & Teams Integrations",
    description:
      "Get notified when maps change. SwayMaps now sends rich notifications to Slack and Microsoft Teams.",
    changes: [
      { type: "Added", text: "Slack webhook integration with Block Kit formatting" },
      { type: "Added", text: "Microsoft Teams webhook with MessageCard format" },
      { type: "Added", text: "Custom webhook support for any endpoint" },
      { type: "Fixed", text: "Notification delivery reliability" },
    ],
  },
  {
    version: "v2.0.0",
    date: "January 15, 2026",
    title: "Templates Library & Health Dashboard",
    description:
      "Launch of 25+ ready-to-use templates and a dependency health scoring system.",
    changes: [
      { type: "Added", text: "25+ templates across 6 categories" },
      { type: "Added", text: "Health dashboard with 0-100 scoring" },
      { type: "Added", text: "Orphan node and circular dependency detection" },
      { type: "Improved", text: "Template browser with search and filtering" },
    ],
  },
  {
    version: "v1.0.0",
    date: "December 1, 2025",
    title: "SwayMaps Launch",
    description:
      "The visual dependency mapping platform is live. Map systems, trace impact, ship with confidence.",
    changes: [
      { type: "Added", text: "Visual canvas with 11 node types" },
      { type: "Added", text: "Drag-and-drop map editor" },
      { type: "Added", text: "Export to PNG, SVG, PDF, JSON" },
      { type: "Added", text: "Public sharing via unique links" },
      { type: "Added", text: "Workspace collaboration with roles" },
    ],
  },
];

const badgeColors: Record<ChangeType, { bg: string; text: string }> = {
  Added: { bg: "rgba(34,197,94,0.12)", text: "#22c55e" },
  Improved: { bg: "rgba(0,194,255,0.12)", text: "#00c2ff" },
  Fixed: { bg: "rgba(245,158,11,0.12)", text: "#f59e0b" },
};

export default function ChangelogPage() {
  const [scrolled, setScrolled] = useState(false);
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    revealRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const addReveal = useCallback((el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  }, []);

  return (
    <div className="landing-root">
      {/* ═══ BACKGROUND ═══ */}
      <div className="map-bg">
        <div className="grid-layer" />
        <div className="scan" />
        <div className="orb a" />
        <div className="orb b" />
        <div className="orb c" />
      </div>

      {/* ═══ NAV ═══ */}
      <nav className={`landing-nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" className="logo">
            <LogoMark />
            <span className="logo-text">SwayMaps</span>
          </Link>
          <div className="nav-links">
            <Link href="/landing#features">Features</Link>
            <Link href="/landing#usecases">Use Cases</Link>
            <Link href="/landing#pricing">Pricing</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="nav-actions">
            <Link href="/auth/signin" className="btn btn-ghost">Sign In</Link>
            <Link href="/auth/signup" className="btn btn-primary">Start Free</Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero" style={{ paddingBottom: 60 }}>
        <div className="container">
          <div className="eyebrow">Changelog</div>
          <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}>
            What&#39;s new in SwayMaps
          </h1>
          <p className="hero-sub">
            Follow our journey as we build the visual dependency intelligence platform.
          </p>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section style={{ padding: "0 0 120px" }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ position: "relative" }}>
            {/* vertical line */}
            <div
              style={{
                position: "absolute",
                left: 130,
                top: 0,
                bottom: 0,
                width: 1,
                background: "#1a2340",
              }}
            />

            {changelogEntries.map((entry, idx) => (
              <div
                key={entry.version}
                ref={addReveal}
                className="reveal"
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: 40,
                  marginBottom: idx < changelogEntries.length - 1 ? 48 : 0,
                  position: "relative",
                }}
              >
                {/* LEFT — date */}
                <div
                  style={{
                    textAlign: "right",
                    paddingTop: 24,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "0.78rem",
                      color: "#4a5a7a",
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}
                  >
                    {entry.date}
                  </div>
                </div>

                {/* DOT on the line */}
                <div
                  style={{
                    position: "absolute",
                    left: 124,
                    top: 28,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: idx === 0 ? "#00c2ff" : "#1a2340",
                    border: idx === 0 ? "2px solid #00c2ff" : "2px solid #253060",
                    zIndex: 2,
                    boxShadow: idx === 0 ? "0 0 12px rgba(0,194,255,0.3)" : "none",
                  }}
                />

                {/* RIGHT — card */}
                <div
                  style={{
                    background: "#0f1629",
                    border: "1px solid #1a2340",
                    borderRadius: 14,
                    padding: "28px 32px",
                    transition: "border-color 0.25s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#253060";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#1a2340";
                  }}
                >
                  {/* version badge + title */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 12px",
                        borderRadius: 100,
                        background: idx === 0 ? "rgba(0,194,255,0.12)" : "rgba(0,194,255,0.06)",
                        color: "#00c2ff",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {entry.version}
                    </span>
                    <h3
                      style={{
                        fontSize: "1.15rem",
                        fontWeight: 800,
                        color: "#e4e9f4",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {entry.title}
                    </h3>
                  </div>

                  {/* description */}
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#8091b3",
                      lineHeight: 1.7,
                      marginBottom: 20,
                    }}
                  >
                    {entry.description}
                  </p>

                  {/* change items */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {entry.changes.map((change, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          fontSize: "0.84rem",
                          color: "#e4e9f4",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 10px",
                            borderRadius: 5,
                            background: badgeColors[change.type].bg,
                            color: badgeColors[change.type].text,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            flexShrink: 0,
                            minWidth: 68,
                            textAlign: "center",
                          }}
                        >
                          {change.type}
                        </span>
                        <span style={{ color: "#8091b3" }}>{change.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="final-cta" ref={addReveal}>
        <div className="container reveal" ref={addReveal}>
          <h2>Stay up to date</h2>
          <p>
            Follow along as we ship new features, improvements, and fixes every week.
          </p>
          <div className="fca">
            <a
              href="https://twitter.com/swaymaps"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
            >
              Follow us on Twitter
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4m0 0H5.5m6.5 0V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="https://discord.gg/swaymaps"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
            >
              Join Discord
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4m0 0H5.5m6.5 0V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="landing-footer">
        <div className="container-w">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/" className="logo" style={{ marginBottom: 14, display: "inline-flex" }}>
                <LogoMark />
                <span className="logo-text">SwayMaps</span>
              </Link>
              <p>
                The visual dependency intelligence platform. Map systems, trace impact, ship with confidence.
              </p>
            </div>

            <div className="footer-col">
              <h4>Product</h4>
              <Link href="/landing#features">Features</Link>
              <Link href="/landing#pricing">Pricing</Link>
              <Link href="/landing#usecases">Use Cases</Link>
              <Link href="/landing#compare">Comparison</Link>
            </div>

            <div className="footer-col">
              <h4>Resources</h4>
              <Link href="/landing#yaml">Diagram as Code</Link>
              <a href="#">Documentation</a>
              <Link href="/changelog">Changelog</Link>
              <a href="#">API Reference</a>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <Link href="/contact">Contact</Link>
            </div>

            <div className="footer-col">
              <h4>Legal</h4>
              <Link href="/legal/terms">Terms of Service</Link>
              <Link href="/legal/privacy">Privacy Policy</Link>
              <a href="#">Security</a>
              <a href="#">Status</a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>2026 SwayMaps. All rights reserved.</span>
            <div className="footer-bottom-links">
              <Link href="/legal/terms">Terms</Link>
              <Link href="/legal/privacy">Privacy</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ RESPONSIVE OVERRIDE ═══ */}
      <style jsx>{`
        @media (max-width: 768px) {
          .timeline-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
