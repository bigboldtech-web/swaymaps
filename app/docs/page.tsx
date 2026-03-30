"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import "../landing/landing.css";

/* ─── SCROLL REVEAL HOOK ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("vis"); }),
      { threshold: 0.1 }
    );
    el.querySelectorAll(".reveal").forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── DATA ─── */
const guides = [
  { icon: "01", title: "Getting Started", desc: "Create your first map in 60 seconds", color: "rgba(0,194,255,0.12)", textColor: "var(--accent)" },
  { icon: "NT", title: "Node Types & Metadata", desc: "All 11 node types and their properties", color: "rgba(139,92,246,0.12)", textColor: "#8b5cf6" },
  { icon: "AI", title: "AI Generation Guide", desc: "Generate maps from natural language", color: "rgba(236,72,153,0.12)", textColor: "#ec4899" },
  { icon: "{}", title: "YAML DSL Reference", desc: "Define maps as code", color: "rgba(34,197,94,0.12)", textColor: "#22c55e" },
  { icon: "WS", title: "Collaboration & Workspaces", desc: "Team setup, roles, and permissions", color: "rgba(249,115,22,0.12)", textColor: "#f97316" },
  { icon: "IO", title: "Import & Export", desc: "Supported formats and embedding", color: "rgba(6,182,212,0.12)", textColor: "#06b6d4" },
  { icon: "IN", title: "Integrations Setup", desc: "Slack, Teams, and webhook configuration", color: "rgba(99,102,241,0.12)", textColor: "#6366f1" },
  { icon: "AP", title: "API Reference", desc: "REST API documentation", color: "rgba(245,158,11,0.12)", textColor: "#f59e0b" },
];

const popularArticles = [
  { title: "How to set up your first workspace and invite your team", category: "Getting Started", categoryColor: "var(--accent)" },
  { title: "Using AI brainstorm to scaffold microservice architectures", category: "AI Generation", categoryColor: "#ec4899" },
  { title: "Exporting maps to Confluence and Notion", category: "Import & Export", categoryColor: "#06b6d4" },
  { title: "Understanding edge types: sync, async, and data flow", category: "Node Types", categoryColor: "#8b5cf6" },
  { title: "Writing your first YAML DSL map definition", category: "YAML DSL", categoryColor: "#22c55e" },
];

/* ─── COMPONENT ─── */
export default function DocsPage() {
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing-root" ref={rootRef}>
      {/* ─── BG ─── */}
      <div className="map-bg">
        <div className="grid-layer" />
        <div className="scan" />
        <div className="orb a" />
        <div className="orb b" />
      </div>

      {/* ─── NAV ─── */}
      <nav className={`landing-nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/landing" className="logo">
            <div className="logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 18 C8 18 8 6 12 6 C16 6 16 18 20 18" />
              </svg>
            </div>
            <span className="logo-text">SwayMaps</span>
          </Link>
          <div className="nav-links">
            <Link href="/landing#features">Features</Link>
            <Link href="/landing#pricing">Pricing</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/about">About</Link>
          </div>
          <div className="nav-actions">
            <Link href="/auth/signin" className="btn btn-ghost">Sign In</Link>
            <Link href="/auth/signup" className="btn btn-primary">Start Free</Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">Documentation</div>
          <h1 style={{ fontSize: "clamp(2.6rem,5vw,3.8rem)" }}>Learn SwayMaps</h1>
          <p className="hero-sub">
            Everything you need to get started and become a power user.
          </p>

          {/* ─── SEARCH BAR ─── */}
          <div className="reveal" style={{ maxWidth: 560, margin: "36px auto 0" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "14px 20px",
              transition: "border-color var(--ease)",
            }}>
              <svg width="20" height="20" fill="none" stroke="var(--t3)" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search documentation..."
                readOnly
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: "var(--font)",
                  fontSize: "0.95rem",
                  color: "var(--t1)",
                  caretColor: "var(--accent)",
                }}
              />
              <span style={{
                fontFamily: "var(--mono)",
                fontSize: "0.72rem",
                color: "var(--t3)",
                padding: "3px 8px",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 5,
                fontWeight: 600,
              }}>/</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── QUICK START GUIDES ─── */}
      <section style={{ paddingTop: 40, paddingBottom: 100 }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="eyebrow">Quick Start</div>
            <h2 className="stitle">Jump right in</h2>
            <p className="sdesc" style={{ margin: "0 auto" }}>
              Eight guides to take you from zero to power user.
            </p>
          </div>

          <div className="reveal" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}>
            {guides.map((g, i) => (
              <a
                key={i}
                href="#"
                style={{
                  display: "block",
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "28px 24px",
                  textDecoration: "none",
                  transition: "all var(--ease)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: 11,
                  background: g.color,
                  color: g.textColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  fontFamily: "var(--mono)",
                  marginBottom: 18,
                }}>
                  {g.icon}
                </div>
                <h3 style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--t1)",
                  marginBottom: 6,
                }}>{g.title}</h3>
                <p style={{
                  fontSize: "0.84rem",
                  color: "var(--t2)",
                  lineHeight: 1.6,
                  marginBottom: 16,
                }}>{g.desc}</p>
                <span style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--accent)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}>
                  Read guide <span style={{ transition: "transform var(--ease)" }}>&rarr;</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POPULAR ARTICLES ─── */}
      <section style={{ paddingTop: 0, paddingBottom: 100 }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="eyebrow">Popular</div>
            <h2 className="stitle">Frequently read articles</h2>
          </div>

          <div className="reveal" style={{
            maxWidth: 720,
            margin: "0 auto",
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            overflow: "hidden",
          }}>
            {popularArticles.map((a, i) => (
              <a
                key={i}
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "18px 24px",
                  borderBottom: i < popularArticles.length - 1 ? "1px solid var(--border)" : "none",
                  textDecoration: "none",
                  transition: "background var(--ease)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg5)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
                  <span style={{
                    padding: "3px 10px",
                    borderRadius: 6,
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.04em",
                    background: `${a.categoryColor}15`,
                    color: a.categoryColor,
                    whiteSpace: "nowrap" as const,
                    flexShrink: 0,
                  }}>
                    {a.category}
                  </span>
                  <span style={{
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: "var(--t1)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap" as const,
                  }}>
                    {a.title}
                  </span>
                </div>
                <svg width="16" height="16" fill="none" stroke="var(--t3)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ paddingTop: 0, paddingBottom: 120 }}>
        <div className="container reveal" style={{ textAlign: "center" }}>
          <div style={{
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "56px 40px",
            maxWidth: 640,
            margin: "0 auto",
          }}>
            <h2 style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--t1)",
              marginBottom: 12,
            }}>
              Can&apos;t find what you need?
            </h2>
            <p style={{
              fontSize: "0.95rem",
              color: "var(--t2)",
              lineHeight: 1.7,
              marginBottom: 28,
            }}>
              Our team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
            </p>
            <a href="mailto:support@swaymaps.com" className="btn btn-primary btn-lg">
              Contact Support
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="landing-footer">
        <div className="container-w">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/landing" className="logo" style={{ marginBottom: 12 }}>
                <div className="logo-mark" style={{ width: 28, height: 28, borderRadius: 7 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ width: 18, height: 18 }}>
                    <path d="M4 18 C8 18 8 6 12 6 C16 6 16 18 20 18" />
                  </svg>
                </div>
                <span className="logo-text" style={{ fontSize: "1.1rem" }}>SwayMaps</span>
              </Link>
              <p>Visual dependency mapping for engineering teams.</p>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <Link href="/landing#features">Features</Link>
              <Link href="/landing#pricing">Pricing</Link>
              <a href="#">Templates</a>
              <a href="#">Changelog</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <Link href="/about">About</Link>
              <Link href="/blog">Blog</Link>
              <a href="#">Careers</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link href="/legal/privacy">Privacy</Link>
              <Link href="/legal/terms">Terms</Link>
              <a href="mailto:security@swaymaps.com">Security</a>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <Link href="/docs">Docs</Link>
              <a href="mailto:hello@swaymaps.com">Contact</a>
              <a href="#">Status</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2026 SwayMaps. All rights reserved.</span>
            <div className="footer-bottom-links">
              <Link href="/legal/privacy">Privacy</Link>
              <Link href="/legal/terms">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
