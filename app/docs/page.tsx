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

/* ---- DATA ---- */
const guides = [
  { slug: "getting-started", icon: "01", title: "Getting Started", desc: "Create your first map in 60 seconds", color: "rgba(0,194,255,0.12)", textColor: "var(--accent)" },
  { slug: "node-types", icon: "NT", title: "Node Types & Metadata", desc: "All 11 node types and their properties", color: "rgba(139,92,246,0.12)", textColor: "#8b5cf6" },
  { slug: "ai-generation", icon: "AI", title: "AI Generation Guide", desc: "Generate maps from natural language", color: "rgba(236,72,153,0.12)", textColor: "#ec4899" },
  { slug: "yaml-dsl", icon: "{}", title: "YAML DSL Reference", desc: "Define maps as code", color: "rgba(34,197,94,0.12)", textColor: "#22c55e" },
  { slug: "collaboration", icon: "WS", title: "Collaboration & Workspaces", desc: "Team setup, roles, and permissions", color: "rgba(249,115,22,0.12)", textColor: "#f97316" },
  { slug: "import-export", icon: "IO", title: "Import & Export", desc: "Supported formats and embedding", color: "rgba(6,182,212,0.12)", textColor: "#06b6d4" },
  { slug: "integrations", icon: "IN", title: "Integrations Setup", desc: "Slack, Teams, and webhook configuration", color: "rgba(99,102,241,0.12)", textColor: "#6366f1" },
  { slug: "api-reference", icon: "AP", title: "API Reference", desc: "REST API documentation", color: "rgba(245,158,11,0.12)", textColor: "#f59e0b" },
];

const popularArticles = [
  { title: "How to set up your first workspace and invite your team", category: "Getting Started", categoryColor: "var(--accent)", slug: "getting-started" },
  { title: "Using AI brainstorm to scaffold microservice architectures", category: "AI Generation", categoryColor: "#ec4899", slug: "ai-generation" },
  { title: "Exporting maps to Confluence and Notion", category: "Import & Export", categoryColor: "#06b6d4", slug: "import-export" },
  { title: "Understanding edge types: sync, async, and data flow", category: "Node Types", categoryColor: "#8b5cf6", slug: "node-types" },
  { title: "Writing your first YAML DSL map definition", category: "YAML DSL", categoryColor: "#22c55e", slug: "yaml-dsl" },
];

/* ---- COMPONENT ---- */
export default function DocsPage() {
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
        "name": "SwayMaps Documentation",
        "description": "Learn SwayMaps: getting started guide, node types reference, AI generation guide, YAML DSL documentation, collaboration setup, import/export guides, and API reference.",
        "url": "https://swaymaps.com/docs",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://swaymaps.com" },
            { "@type": "ListItem", "position": 2, "name": "Documentation", "item": "https://swaymaps.com/docs" }
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
      <section className="lp-section" style={{ paddingBottom: 40 }}>
        <div className="lp-container" style={{ textAlign: "center" }}>
          <Reveal>
            <div className="lp-eyebrow">Documentation</div>
            <h1 className="lp-section-title" style={{ fontSize: "clamp(2.6rem,5vw,3.8rem)" }}>
              Learn SwayMaps
            </h1>
            <p className="lp-section-subtitle" style={{ margin: "0 auto", maxWidth: 560 }}>
              Everything you need to get started and become a power user.
            </p>

            {/* SEARCH BAR */}
            <div style={{ maxWidth: 560, margin: "36px auto 0" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "14px 20px",
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
                    fontFamily: "var(--font-body)",
                    fontSize: "0.95rem",
                    color: "var(--t1)",
                    caretColor: "var(--accent)",
                  }}
                />
                <span style={{
                  fontFamily: "var(--font-mono)",
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
          </Reveal>
        </div>
      </section>

      {/* QUICK START GUIDES */}
      <section style={{ paddingTop: 40, paddingBottom: 100, position: "relative", zIndex: 1 }}>
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="lp-eyebrow">Quick Start</div>
              <h2 className="lp-section-title" style={{ fontSize: 36 }}>Jump right in</h2>
              <p className="lp-section-subtitle" style={{ margin: "0 auto" }}>
                Eight guides to take you from zero to power user.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}>
              {guides.map((g, i) => (
                <Link
                  key={i}
                  href={`/docs/${g.slug}`}
                  style={{
                    display: "block",
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: "28px 24px",
                    textDecoration: "none",
                    transition: "all 0.25s var(--ease)",
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
                    fontFamily: "var(--font-mono)",
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
                    Read guide &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* POPULAR ARTICLES */}
      <section style={{ paddingTop: 0, paddingBottom: 100, position: "relative", zIndex: 1 }}>
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="lp-eyebrow">Popular</div>
              <h2 className="lp-section-title" style={{ fontSize: 36 }}>Frequently read articles</h2>
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              maxWidth: 720,
              margin: "0 auto",
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
            }}>
              {popularArticles.map((a, i) => (
                <Link
                  key={i}
                  href={`/docs/${a.slug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "18px 24px",
                    borderBottom: i < popularArticles.length - 1 ? "1px solid var(--border)" : "none",
                    textDecoration: "none",
                    transition: "background 0.2s var(--ease)",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg4)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
                    <span style={{
                      padding: "3px 10px",
                      borderRadius: 6,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      background: `${a.categoryColor}15`,
                      color: a.categoryColor,
                      whiteSpace: "nowrap",
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
                      whiteSpace: "nowrap",
                    }}>
                      {a.title}
                    </span>
                  </div>
                  <svg width="16" height="16" fill="none" stroke="var(--t3)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path strokeLinecap="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingTop: 0, paddingBottom: 120, position: "relative", zIndex: 1 }}>
        <div className="lp-container">
          <Reveal>
            <div style={{
              textAlign: "center",
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
              <a href="mailto:support@swaymaps.com" className="lp-btn lp-btn--primary lp-btn--lg">
                Contact Support
              </a>
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
