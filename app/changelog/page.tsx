"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import "../landing/landing.css";

/* ---- SVG ICONS ---- */
function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8h9M8.5 4l4 4-4 4" />
    </svg>
  );
}

function IconTwitter() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ---- LOGO ---- */
function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
      <path d="M 28 10 C 12 10, 12 20, 20 20 C 28 20, 28 30, 12 30" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="10" r="3.5" fill="white" />
      <circle cx="20" cy="20" r="2.5" fill="white" opacity="0.6" />
      <circle cx="12" cy="30" r="3.5" fill="white" />
    </svg>
  );
}

/* ---- SCROLL REVEAL ---- */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`lp-reveal ${className}`}>
      {children}
    </div>
  );
}

/* ---- CHANGELOG DATA ---- */
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

/* ---- COMPONENT ---- */
export default function ChangelogPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lp-root">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "SwayMaps Changelog",
        "description": "Follow SwayMaps development: new features, improvements, and fixes. See our latest releases including AI generation, YAML DSL, version history, and more.",
        "url": "https://swaymaps.com/changelog",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://swaymaps.com" },
            { "@type": "ListItem", "position": 2, "name": "Changelog", "item": "https://swaymaps.com/changelog" }
          ]
        }
      }) }} />

      {/* BACKGROUND */}
      <div className="lp-bg">
        <div className="lp-orb lp-orb--1" />
        <div className="lp-orb lp-orb--2" />
        <div className="lp-orb lp-orb--3" />
      </div>

      {/* NAVBAR */}
      <nav className={`lp-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="lp-nav-inner">
          <Link href="/" className="lp-nav-logo">
            <span className="lp-nav-logo-icon">
              <Logo size={20} />
            </span>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
              <span>SwayMaps</span>
              <span style={{ fontSize: ".55rem", fontWeight: 500, color: "var(--t3)", letterSpacing: ".04em", marginTop: "2px" }}>Shows The Way</span>
            </span>
          </Link>

          <ul className="lp-nav-links">
            <li><Link href="/features">Features</Link></li>
            <li><Link href="/use-cases">Use Cases</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/docs">Docs</Link></li>
          </ul>

          <div className="lp-nav-ctas">
            <Link href="/auth/signin" className="lp-btn lp-btn--ghost">Sign In</Link>
            <Link href="/auth/signup" className="lp-btn lp-btn--primary">
              Get Started <IconArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-section" style={{ paddingBottom: 60 }}>
        <div className="lp-container" style={{ textAlign: "center" }}>
          <Reveal>
            <div className="lp-eyebrow">Changelog</div>
            <h1 className="lp-section-title" style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}>
              What&apos;s new in SwayMaps
            </h1>
            <p className="lp-section-subtitle" style={{ margin: "0 auto", maxWidth: 560 }}>
              Follow our journey as we build the visual dependency intelligence platform.
            </p>
          </Reveal>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{ padding: "0 0 120px", position: "relative", zIndex: 1 }}>
        <div className="lp-container" style={{ maxWidth: 900 }}>
          <div style={{ position: "relative" }}>
            {/* vertical line */}
            <div style={{
              position: "absolute",
              left: 130,
              top: 0,
              bottom: 0,
              width: 1,
              background: "var(--border)",
            }} />

            {changelogEntries.map((entry, idx) => (
              <Reveal key={entry.version}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: 40,
                  marginBottom: idx < changelogEntries.length - 1 ? 48 : 0,
                  position: "relative",
                }}>
                  {/* LEFT -- date */}
                  <div style={{ textAlign: "right", paddingTop: 24 }}>
                    <div style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.78rem",
                      color: "var(--t3)",
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}>
                      {entry.date}
                    </div>
                  </div>

                  {/* DOT on the line */}
                  <div style={{
                    position: "absolute",
                    left: 124,
                    top: 28,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: idx === 0 ? "var(--accent)" : "var(--border)",
                    border: idx === 0 ? "2px solid var(--accent)" : "2px solid var(--border2)",
                    zIndex: 2,
                    boxShadow: idx === 0 ? "0 0 12px rgba(0,194,255,0.3)" : "none",
                  }} />

                  {/* RIGHT -- card */}
                  <div
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: "28px 32px",
                      transition: "border-color 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--border2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                  >
                    {/* version badge + title */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                      flexWrap: "wrap",
                    }}>
                      <span style={{
                        display: "inline-block",
                        padding: "3px 12px",
                        borderRadius: 100,
                        background: idx === 0 ? "rgba(0,194,255,0.12)" : "rgba(0,194,255,0.06)",
                        color: "var(--accent)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                      }}>
                        {entry.version}
                      </span>
                      <h3 style={{
                        fontSize: "1.15rem",
                        fontWeight: 800,
                        color: "var(--t1)",
                        letterSpacing: "-0.02em",
                      }}>
                        {entry.title}
                      </h3>
                    </div>

                    {/* description */}
                    <p style={{
                      fontSize: "0.9rem",
                      color: "var(--t2)",
                      lineHeight: 1.7,
                      marginBottom: 20,
                    }}>
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
                            color: "var(--t1)",
                          }}
                        >
                          <span style={{
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
                          }}>
                            {change.type}
                          </span>
                          <span style={{ color: "var(--t2)" }}>{change.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingTop: 0, paddingBottom: 120, position: "relative", zIndex: 1 }}>
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <h2 style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--t1)",
                marginBottom: 12,
              }}>
                Stay up to date
              </h2>
              <p style={{
                fontSize: "0.95rem",
                color: "var(--t2)",
                lineHeight: 1.7,
                marginBottom: 28,
              }}>
                Follow along as we ship new features, improvements, and fixes every week.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                <a
                  href="https://twitter.com/swaymaps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lp-btn lp-btn--ghost"
                  style={{ padding: "12px 24px" }}
                >
                  Follow on Twitter
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12L12 4m0 0H5.5m6.5 0V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a
                  href="https://discord.gg/swaymaps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lp-btn lp-btn--ghost"
                  style={{ padding: "12px 24px" }}
                >
                  Join Discord
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12L12 4m0 0H5.5m6.5 0V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <Link href="/" className="lp-footer-brand-logo">
                <span className="lp-nav-logo-icon">
                  <Logo size={20} />
                </span>
                SwayMaps
              </Link>
              <p className="lp-footer-brand-desc">
                The visual planning and dependency mapping platform for every team.
              </p>
            </div>

            <div>
              <div className="lp-footer-col-title">Product</div>
              <ul className="lp-footer-links">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/use-cases">Use Cases</Link></li>
                <li><Link href="/changelog">Changelog</Link></li>
              </ul>
            </div>

            <div>
              <div className="lp-footer-col-title">Resources</div>
              <ul className="lp-footer-links">
                <li><Link href="/docs">Docs</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/use-cases">Use Cases</Link></li>
              </ul>
            </div>

            <div>
              <div className="lp-footer-col-title">Company</div>
              <ul className="lp-footer-links">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>

            <div>
              <div className="lp-footer-col-title">Legal</div>
              <ul className="lp-footer-links">
                <li><Link href="/legal/terms">Terms</Link></li>
                <li><Link href="/legal/privacy">Privacy</Link></li>
              </ul>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <span className="lp-footer-copy">&copy; 2026 SwayMaps. All rights reserved.</span>
            <div className="lp-footer-socials">
              <a href="https://twitter.com/swaymaps" target="_blank" rel="noopener noreferrer"><IconTwitter /></a>
              <a href="https://github.com/swaymaps" target="_blank" rel="noopener noreferrer"><IconGitHub /></a>
              <a href="https://linkedin.com/company/swaymaps" target="_blank" rel="noopener noreferrer"><IconLinkedIn /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
