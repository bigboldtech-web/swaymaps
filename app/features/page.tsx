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

function IconCheck({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6.5l3 3 5-6" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8L8 14 2 9.2h7.6z" />
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
const nodeTypes = [
  { name: "Person", color: "#ec4899", desc: "Stakeholders, users, team members" },
  { name: "System", color: "#3b82f6", desc: "Applications, services, platforms" },
  { name: "API", color: "#06b6d4", desc: "REST endpoints, GraphQL, gRPC" },
  { name: "Database", color: "#8b5cf6", desc: "PostgreSQL, MongoDB, Redis stores" },
  { name: "Queue", color: "#2563eb", desc: "Kafka, RabbitMQ, SQS topics" },
  { name: "Cache", color: "#ef4444", desc: "Redis, Memcached, CDN layers" },
  { name: "Process", color: "#22c55e", desc: "Workflows, pipelines, CI/CD steps" },
  { name: "Generic", color: "#14b8a6", desc: "Anything else — fully flexible" },
  { name: "Cloud", color: "#6366f1", desc: "AWS, GCP, Azure resources" },
  { name: "Vendor", color: "#f59e0b", desc: "Stripe, Datadog, third-party SaaS" },
  { name: "Team", color: "#f97316", desc: "Departments, squads, working groups" },
];

const templateCards = [
  { name: "Microservices", category: "Engineering", color: "#3b82f6" },
  { name: "Org Chart", category: "Leadership", color: "#f97316" },
  { name: "CI/CD Pipeline", category: "DevOps", color: "#22c55e" },
  { name: "Data Flow", category: "Data", color: "#8b5cf6" },
  { name: "Compliance Map", category: "Security", color: "#ef4444" },
  { name: "Vendor Dependencies", category: "Operations", color: "#f59e0b" },
];

/* ============================================================
   FEATURES PAGE
   ============================================================ */
export default function FeaturesPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="lp-root">
      {/* STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Features — SwayMaps",
            "description": "Explore every feature of SwayMaps: 11 node types, AI generation, real-time collaboration, version history, diagram as code, templates, import/export, health dashboard, integrations, and command palette.",
            "url": "https://swaymaps.com/features",
            "isPartOf": { "@type": "WebSite", "name": "SwayMaps", "url": "https://swaymaps.com" },
          }),
        }}
      />

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
            <span className="lp-nav-logo-icon"><Logo size={20} /></span>
            SwayMaps
          </Link>
          <ul className="lp-nav-links">
            <li><Link href="/features">Features</Link></li>
            <li><Link href="/use-cases">Use Cases</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
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

      {/* ====================== HERO ====================== */}
      <section className="lp-hero">
        <div className="lp-container">
          <div className="lp-hero-badge">
            <span className="lp-hero-badge-dot" />
            10 powerful features, one platform
          </div>
          <h1>
            Everything you need to<br />
            <span className="lp-hero-grad">map your world.</span>
          </h1>
          <p className="lp-hero-sub">
            From AI-powered generation to real-time collaboration, SwayMaps gives every team the tools to visualize dependencies, trace impact, and plan with confidence.
          </p>
          <div className="lp-hero-ctas">
            <Link href="/auth/signup" className="lp-btn lp-btn--primary lp-btn--lg">
              Start Free — No Credit Card <IconArrowRight size={16} />
            </Link>
            <Link href="/use-cases" className="lp-btn lp-btn--outline-lg">
              See Use Cases
            </Link>
          </div>
        </div>
      </section>

      {/* ====================== F1: VISUAL CANVAS & NODE TYPES ====================== */}
      <section className="lp-section">
        <div className="lp-container">
          <Reveal>
            <p className="lp-eyebrow">VISUAL CANVAS</p>
            <h2 className="lp-section-title">11 node types for any domain.</h2>
            <p className="lp-section-subtitle">
              An infinite canvas that feels as natural as a whiteboard but with the structure of a database. Every element carries metadata, status, and color-coded context.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginTop: 48 }}>
            {nodeTypes.map((n) => (
              <Reveal key={n.name}>
                <div style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "20px 18px",
                  transition: "border-color 0.3s, transform 0.3s var(--ease)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: n.color,
                      flexShrink: 0,
                      boxShadow: `0 0 8px ${n.color}40`,
                    }} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: "var(--t1)" }}>{n.name}</span>
                  </div>
                  <span style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.5 }}>{n.desc}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== F2: AI GENERATION ====================== */}
      <section className="lp-features lp-section">
        <div className="lp-container">
          <Reveal>
            <div className="lp-feature-row">
              <div className="lp-feature-text">
                <p className="lp-eyebrow">AI GENERATION</p>
                <h3 className="lp-feature-title">Describe it. AI maps it.</h3>
                <p className="lp-feature-desc">
                  Tell SwayMaps what you want to map in plain English. AI generates nodes, edges, and relationships in seconds. Works for any domain.
                </p>
                <ul className="lp-feature-bullets">
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Natural language to dependency map
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    AI suggests connections automatically
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Edit and refine the generated map
                  </li>
                </ul>
              </div>
              <div className="lp-feature-visual">
                <div className="lp-fv-box">
                  <div className="lp-fv-prompt">
                    <span className="lp-fv-prompt-icon"><IconSpark /></span>
                    <span className="lp-fv-prompt-text">&quot;Map our e-commerce checkout flow&quot;</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div className="lp-fv-generated">
                      {[
                        { name: "Cart Service", color: "var(--node-system)" },
                        { name: "Payment API", color: "var(--node-api)" },
                        { name: "Stripe", color: "var(--node-vendor)" },
                        { name: "Inventory DB", color: "var(--node-db)" },
                        { name: "Email Notifications", color: "var(--node-process)" },
                        { name: "Order Queue", color: "var(--node-queue)" },
                      ].map((n) => (
                        <span key={n.name} className="lp-fv-gen-node">
                          <span className="lp-fv-gen-dot" style={{ background: n.color }} />
                          {n.name}
                        </span>
                      ))}
                    </div>
                    {/* Mini edges */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[
                        "Cart Service → Payment API",
                        "Payment API → Stripe",
                        "Cart Service → Inventory DB",
                        "Payment API → Order Queue",
                        "Order Queue → Email Notifications",
                      ].map((e) => (
                        <span key={e} style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          color: "var(--t3)",
                          background: "var(--bg4)",
                          border: "1px solid var(--border)",
                          borderRadius: 4,
                          padding: "2px 8px",
                        }}>{e}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== F3: REAL-TIME COLLABORATION ====================== */}
      <section className="lp-features lp-section">
        <div className="lp-container">
          <Reveal>
            <div className="lp-feature-row lp-feature-row--reverse">
              <div className="lp-feature-text">
                <p className="lp-eyebrow">COLLABORATION</p>
                <h3 className="lp-feature-title">Plan together, in real time.</h3>
                <p className="lp-feature-desc">
                  Invite your entire team. Assign roles, leave comments on any node, share read-only links with stakeholders.
                </p>
                <ul className="lp-feature-bullets">
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    4 workspace roles with granular permissions
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Inline threaded comments on any node
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    One-click public sharing links
                  </li>
                </ul>
              </div>
              <div className="lp-feature-visual">
                <div className="lp-fv-box">
                  {/* Roles */}
                  <div className="lp-fv-roles">
                    {[
                      { name: "Sarah Chen", initials: "SC", role: "Owner", perms: "Full access, billing, delete workspace", color: "var(--node-person)" },
                      { name: "Alex Rivera", initials: "AR", role: "Admin", perms: "Manage members, edit all maps", color: "var(--node-system)" },
                      { name: "Jordan Lee", initials: "JL", role: "Editor", perms: "Create and edit maps", color: "var(--node-process)" },
                      { name: "Morgan Wu", initials: "MW", role: "Viewer", perms: "View maps, add comments", color: "var(--node-cloud)" },
                    ].map((r) => (
                      <div key={r.name} className="lp-fv-role">
                        <div className="lp-fv-role-left">
                          <div className="lp-fv-role-avatar" style={{ background: r.color }}>{r.initials}</div>
                          <div>
                            <span className="lp-fv-role-name">{r.name}</span>
                            <div style={{ fontSize: 11, color: "var(--t3)", marginTop: 2 }}>{r.perms}</div>
                          </div>
                        </div>
                        <span className="lp-fv-role-badge">{r.role}</span>
                      </div>
                    ))}
                  </div>
                  {/* Comment demo */}
                  <div style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "12px 14px",
                    marginTop: 12,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--node-person)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "white" }}>SC</div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--t1)" }}>Sarah Chen</span>
                      <span style={{ fontSize: 10, color: "var(--t3)", fontFamily: "var(--font-mono)" }}>2 min ago</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.5 }}>
                      Can we add a fallback cache layer between the API Gateway and Auth Service? This will help with latency during peak traffic.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== F4: VERSION HISTORY & DIFF ====================== */}
      <section className="lp-features lp-section">
        <div className="lp-container">
          <Reveal>
            <div className="lp-feature-row">
              <div className="lp-feature-text">
                <p className="lp-eyebrow">VERSION HISTORY</p>
                <h3 className="lp-feature-title">Every change, tracked.</h3>
                <p className="lp-feature-desc">
                  SwayMaps auto-saves version snapshots. Compare any two versions with the built-in diff viewer. Restore previous states with one click.
                </p>
                <ul className="lp-feature-bullets">
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Auto-save snapshots on every edit
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Visual diff viewer shows what changed
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    One-click restore to any version
                  </li>
                </ul>
              </div>
              <div className="lp-feature-visual">
                <div className="lp-fv-box">
                  <div className="lp-fv-timeline">
                    {[
                      { label: "Added Redis Cache layer", time: "2 min ago", changes: [{ type: "add", text: "+1 node" }, { type: "add", text: "+2 edges" }] },
                      { label: "Updated Payment API status to warning", time: "12 min ago", changes: [{ type: "mod", text: "1 modified" }] },
                      { label: "Connected Order Queue to Email Service", time: "28 min ago", changes: [{ type: "add", text: "+1 edge" }] },
                      { label: "Removed legacy Auth v1 endpoint", time: "1 hour ago", changes: [{ type: "del", text: "-1 node" }, { type: "del", text: "-3 edges" }] },
                      { label: "Initial checkout flow created", time: "3 hours ago", changes: [{ type: "add", text: "+6 nodes" }, { type: "add", text: "+8 edges" }] },
                    ].map((v, i) => (
                      <div key={i} className="lp-fv-version">
                        <div className="lp-fv-version-info">
                          <div className="lp-fv-version-label">{v.label}</div>
                          <div className="lp-fv-version-meta">{v.time}</div>
                          <div className="lp-fv-version-changes">
                            {v.changes.map((c, ci) => (
                              <span key={ci} className={`lp-fv-change lp-fv-change--${c.type}`}>{c.text}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Diff summary */}
                  <div style={{
                    marginTop: 16,
                    padding: "14px 16px",
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--t1)", marginBottom: 10, fontFamily: "var(--font-mono)" }}>Diff: v3 vs v5 (current)</div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", padding: "3px 10px", borderRadius: 4, color: "var(--status-healthy)", background: "rgba(34,197,94,0.1)" }}>+3 nodes added</span>
                      <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", padding: "3px 10px", borderRadius: 4, color: "var(--status-warning)", background: "rgba(245,158,11,0.1)" }}>2 edges modified</span>
                      <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", padding: "3px 10px", borderRadius: 4, color: "var(--status-critical)", background: "rgba(239,68,68,0.1)" }}>-1 node removed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== F5: DIAGRAM AS CODE ====================== */}
      <section className="lp-features lp-section">
        <div className="lp-container">
          <Reveal>
            <div className="lp-feature-row lp-feature-row--reverse">
              <div className="lp-feature-text">
                <p className="lp-eyebrow">DIAGRAM AS CODE</p>
                <h3 className="lp-feature-title">Define maps in YAML.</h3>
                <p className="lp-feature-desc">
                  Write dependency maps as code. Version-control in Git, generate from CI/CD, review in pull requests. The YAML DSL is simple, expressive, and fully bi-directional.
                </p>
                <ul className="lp-feature-bullets">
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Simple YAML DSL for any map
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Bi-directional: edit code or canvas
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Version-control maps in Git
                  </li>
                </ul>
              </div>
              <div className="lp-feature-visual">
                <div className="lp-fv-box" style={{ padding: 0, overflow: "hidden" }}>
                  {/* Code block */}
                  <div style={{
                    padding: "20px 22px",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    lineHeight: 1.8,
                    borderBottom: "1px solid var(--border)",
                    background: "var(--bg)",
                    overflow: "auto",
                  }}>
                    <div><span style={{ color: "var(--accent)" }}>nodes</span><span style={{ color: "var(--t3)" }}>:</span></div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: "var(--t3)" }}>-</span> <span style={{ color: "var(--node-vendor)" }}>name</span><span style={{ color: "var(--t3)" }}>:</span> <span style={{ color: "var(--status-healthy)" }}>API Gateway</span></div>
                    <div style={{ paddingLeft: 24 }}><span style={{ color: "var(--node-vendor)" }}>type</span><span style={{ color: "var(--t3)" }}>:</span> <span style={{ color: "var(--status-healthy)" }}>api</span></div>
                    <div style={{ paddingLeft: 24 }}><span style={{ color: "var(--node-vendor)" }}>status</span><span style={{ color: "var(--t3)" }}>:</span> <span style={{ color: "var(--status-healthy)" }}>healthy</span></div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: "var(--t3)" }}>-</span> <span style={{ color: "var(--node-vendor)" }}>name</span><span style={{ color: "var(--t3)" }}>:</span> <span style={{ color: "var(--status-healthy)" }}>Auth Service</span></div>
                    <div style={{ paddingLeft: 24 }}><span style={{ color: "var(--node-vendor)" }}>type</span><span style={{ color: "var(--t3)" }}>:</span> <span style={{ color: "var(--status-healthy)" }}>process</span></div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: "var(--t3)" }}>-</span> <span style={{ color: "var(--node-vendor)" }}>name</span><span style={{ color: "var(--t3)" }}>:</span> <span style={{ color: "var(--status-healthy)" }}>User DB</span></div>
                    <div style={{ paddingLeft: 24 }}><span style={{ color: "var(--node-vendor)" }}>type</span><span style={{ color: "var(--t3)" }}>:</span> <span style={{ color: "var(--status-healthy)" }}>database</span></div>
                    <div style={{ marginTop: 8 }}><span style={{ color: "var(--accent)" }}>edges</span><span style={{ color: "var(--t3)" }}>:</span></div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: "var(--t3)" }}>-</span> <span style={{ color: "var(--status-healthy)" }}>API Gateway → Auth Service</span></div>
                    <div style={{ paddingLeft: 16 }}><span style={{ color: "var(--t3)" }}>-</span> <span style={{ color: "var(--status-healthy)" }}>Auth Service → User DB</span></div>
                  </div>
                  {/* Visual result */}
                  <div style={{ position: "relative", height: 140, background: "var(--bg2)" }}>
                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 400 140" preserveAspectRatio="xMidYMid meet">
                      <line x1="100" y1="70" x2="200" y2="70" stroke="var(--border2)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                      <line x1="200" y1="70" x2="310" y2="70" stroke="var(--border2)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                      {/* Arrowheads */}
                      <polygon points="195,66 205,70 195,74" fill="var(--border2)" />
                      <polygon points="305,66 315,70 305,74" fill="var(--border2)" />
                    </svg>
                    <div style={{ position: "absolute", left: 30, top: 50, display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "var(--t1)" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--node-api)" }} />API Gateway
                    </div>
                    <div style={{ position: "absolute", left: 165, top: 50, display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "var(--t1)" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--node-process)" }} />Auth Service
                    </div>
                    <div style={{ position: "absolute", left: 310, top: 50, display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "var(--t1)" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--node-db)" }} />User DB
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== F6: TEMPLATES ====================== */}
      <section className="lp-section">
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <p className="lp-eyebrow">TEMPLATES</p>
              <h2 className="lp-section-title">Start from proven blueprints.</h2>
              <p className="lp-section-subtitle" style={{ margin: "0 auto" }}>
                25+ templates for every team and use case. Pick one, customize it, and ship faster.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 48 }}>
            {templateCards.map((t) => (
              <Reveal key={t.name}>
                <div style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: 24,
                  transition: "border-color 0.3s, transform 0.3s var(--ease)",
                }}>
                  <div style={{
                    height: 100,
                    borderRadius: 10,
                    background: `linear-gradient(135deg, ${t.color}15, ${t.color}05)`,
                    border: `1px solid ${t.color}25`,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[0, 1, 2].map((i) => (
                        <span key={i} style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "var(--bg3)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.color }} />
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="lp-chip" style={{ marginBottom: 8, display: "inline-block" }}>{t.category}</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--t1)" }}>{t.name}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== F7: IMPORT & EXPORT ====================== */}
      <section className="lp-features lp-section">
        <div className="lp-container">
          <Reveal>
            <div className="lp-feature-row">
              <div className="lp-feature-text">
                <p className="lp-eyebrow">IMPORT & EXPORT</p>
                <h3 className="lp-feature-title">Bring your maps. Take them anywhere.</h3>
                <p className="lp-feature-desc">
                  Import from the tools you already use. Export to any format for presentations, documentation, or version control.
                </p>
                <ul className="lp-feature-bullets">
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Import from Draw.io, Lucidchart, Miro
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Export to PNG, SVG, PDF, JSON
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Lossless round-trip with JSON format
                  </li>
                </ul>
              </div>
              <div className="lp-feature-visual">
                <div className="lp-fv-box">
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--t3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Import From</div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                    {["Draw.io (XML)", "Lucidchart (CSV)", "Miro (JSON)"].map((s) => (
                      <span key={s} style={{
                        padding: "10px 16px",
                        background: "var(--bg3)",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--t1)",
                        flex: 1,
                        textAlign: "center",
                      }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--t3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Export As</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {[
                      { name: "PNG", color: "var(--node-system)" },
                      { name: "SVG", color: "var(--node-process)" },
                      { name: "PDF", color: "var(--node-person)" },
                      { name: "JSON", color: "var(--node-vendor)" },
                    ].map((f) => (
                      <span key={f.name} style={{
                        padding: "10px 20px",
                        background: "var(--bg3)",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 700,
                        color: f.color,
                        flex: 1,
                        textAlign: "center",
                        fontFamily: "var(--font-mono)",
                      }}>{f.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== F8: HEALTH DASHBOARD ====================== */}
      <section className="lp-features lp-section">
        <div className="lp-container">
          <Reveal>
            <div className="lp-feature-row lp-feature-row--reverse">
              <div className="lp-feature-text">
                <p className="lp-eyebrow">HEALTH DASHBOARD</p>
                <h3 className="lp-feature-title">Detect issues at a glance.</h3>
                <p className="lp-feature-desc">
                  Every map gets a 0-100 health score. SwayMaps automatically detects orphan nodes, circular dependencies, missing owners, and more.
                </p>
                <ul className="lp-feature-bullets">
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Automatic 0-100 health scoring
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Detect orphan nodes and circular deps
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Actionable issue list with severity
                  </li>
                </ul>
              </div>
              <div className="lp-feature-visual">
                <div className="lp-fv-box">
                  {/* Health score arc */}
                  <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 20 }}>
                    <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
                      <svg viewBox="0 0 100 100" width="100" height="100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="6" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--status-healthy)" strokeWidth="6"
                          strokeDasharray={`${87 * 2.64} ${(100 - 87) * 2.64}`}
                          strokeDashoffset="66"
                          strokeLinecap="round"
                          style={{ transition: "stroke-dasharray 1s var(--ease)" }}
                        />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 28, fontWeight: 800, color: "var(--t1)", lineHeight: 1 }}>87</span>
                        <span style={{ fontSize: 10, color: "var(--t3)", fontFamily: "var(--font-mono)" }}>/100</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--t1)", marginBottom: 4 }}>Good Health</div>
                      <div style={{ fontSize: 13, color: "var(--t2)" }}>4 issues found across 18 nodes</div>
                    </div>
                  </div>
                  {/* Issue list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { text: "2 orphan nodes with no connections", severity: "warning", color: "var(--status-warning)" },
                      { text: "1 circular dependency detected", severity: "critical", color: "var(--status-critical)" },
                      { text: "3 nodes missing assigned owners", severity: "warning", color: "var(--status-warning)" },
                    ].map((issue, i) => (
                      <div key={i} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        background: "var(--bg3)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                      }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: issue.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: "var(--t2)", flex: 1 }}>{issue.text}</span>
                        <span style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: 4,
                          color: issue.color,
                          background: issue.severity === "critical" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)",
                        }}>{issue.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== F9: INTEGRATIONS ====================== */}
      <section className="lp-section">
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <p className="lp-eyebrow">INTEGRATIONS</p>
              <h2 className="lp-section-title">Connected to your workflow.</h2>
              <p className="lp-section-subtitle" style={{ margin: "0 auto" }}>
                Get notified when maps change. Trigger updates from external systems. Keep everyone in the loop.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 48 }}>
            {[
              {
                name: "Slack",
                desc: "Get notified in any channel when maps are updated, comments are added, or health scores change.",
                example: "#platform-team: Sarah added 3 nodes to Checkout Flow map",
                color: "var(--node-process)",
              },
              {
                name: "Microsoft Teams",
                desc: "Same powerful notifications, delivered to your Teams channels. Configure per-map or per-workspace.",
                example: "Platform Team: Map health dropped to 72/100",
                color: "var(--node-system)",
              },
              {
                name: "Webhooks",
                desc: "Push map events to any endpoint. Build custom automations, trigger CI/CD, or sync with internal tools.",
                example: "POST https://api.example.com/hooks/swaymaps",
                color: "var(--node-vendor)",
              },
            ].map((integration) => (
              <Reveal key={integration.name}>
                <div style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: 28,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `color-mix(in srgb, ${integration.color} 15%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${integration.color} 30%, transparent)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                    fontSize: 18,
                    fontWeight: 700,
                    color: integration.color,
                  }}>
                    {integration.name[0]}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "var(--t1)", marginBottom: 6 }}>{integration.name}</div>
                  <div style={{ fontSize: 14, color: "var(--t2)", lineHeight: 1.5, marginBottom: 16, flex: 1 }}>{integration.desc}</div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--t3)",
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "10px 12px",
                    lineHeight: 1.4,
                  }}>{integration.example}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== F10: COMMAND PALETTE ====================== */}
      <section className="lp-features lp-section">
        <div className="lp-container">
          <Reveal>
            <div className="lp-feature-row">
              <div className="lp-feature-text">
                <p className="lp-eyebrow">COMMAND PALETTE</p>
                <h3 className="lp-feature-title">Navigate at the speed of thought.</h3>
                <p className="lp-feature-desc">
                  Press <span style={{ fontFamily: "var(--font-mono)", background: "var(--bg3)", padding: "2px 8px", borderRadius: 4, border: "1px solid var(--border)" }}>{"\u2318"}K</span> to open the command palette. Search nodes, jump to maps, change views, and trigger actions without touching the mouse.
                </p>
                <ul className="lp-feature-bullets">
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Fuzzy search across all nodes and maps
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Quick actions: export, share, duplicate
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Keyboard-first workflow
                  </li>
                </ul>
              </div>
              <div className="lp-feature-visual">
                <div style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border2)",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                }}>
                  {/* Search input */}
                  <div style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="2" strokeLinecap="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span style={{ fontSize: 14, color: "var(--t2)" }}>auth service...</span>
                    <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--t3)", background: "var(--bg3)", padding: "2px 8px", borderRadius: 4, border: "1px solid var(--border)" }}>ESC</span>
                  </div>
                  {/* Results */}
                  <div style={{ padding: "8px 0" }}>
                    {[
                      { name: "Auth Service", type: "PROCESS", color: "var(--node-process)", map: "Checkout Flow" },
                      { name: "Auth Database", type: "DATABASE", color: "var(--node-db)", map: "Checkout Flow" },
                      { name: "Auth v2 Migration", type: "GENERIC", color: "#14b8a6", map: "Q2 Roadmap" },
                    ].map((r, i) => (
                      <div key={r.name} style={{
                        padding: "10px 18px",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        background: i === 0 ? "var(--bg3)" : "transparent",
                        cursor: "pointer",
                      }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--t1)", flex: 1 }}>{r.name}</span>
                        <span style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: "var(--bg4)",
                          border: "1px solid var(--border)",
                          color: "var(--t3)",
                        }}>{r.type}</span>
                        <span style={{ fontSize: 11, color: "var(--t3)" }}>{r.map}</span>
                      </div>
                    ))}
                    <div style={{ height: 1, background: "var(--border)", margin: "4px 18px" }} />
                    {[
                      { label: "Export as PNG", shortcut: "\u2318\u21E7E" },
                      { label: "Share map", shortcut: "\u2318\u21E7S" },
                    ].map((action) => (
                      <div key={action.label} style={{
                        padding: "10px 18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}>
                        <span style={{ fontSize: 13, color: "var(--t2)" }}>{action.label}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--t3)" }}>{action.shortcut}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== CTA ====================== */}
      <section className="lp-cta-section lp-section">
        <div className="lp-cta-glow" />
        <div className="lp-container">
          <Reveal>
            <h2 className="lp-cta-title">
              Ready to map<br />
              <span className="lp-hero-grad">your world?</span>
            </h2>
            <p className="lp-cta-sub">
              Join 500+ teams who use SwayMaps to visualize dependencies, trace impact, and plan with confidence.
            </p>
            <div className="lp-cta-buttons">
              <Link href="/auth/signup" className="lp-btn lp-btn--primary lp-btn--lg">
                Start Free — No Credit Card <IconArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="lp-btn lp-btn--outline-lg">
                View Pricing
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== FOOTER ====================== */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <Link href="/" className="lp-footer-brand-logo">
                <span className="lp-nav-logo-icon"><Logo size={20} /></span>
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
                <li><Link href="/templates-gallery">Templates</Link></li>
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
