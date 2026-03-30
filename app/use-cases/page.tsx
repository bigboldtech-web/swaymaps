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

/* ---- MINI MAP COMPONENT ---- */
interface MiniNode {
  label: string;
  type: string;
  color: string;
  x: number;
  y: number;
  tags?: string[];
}

interface MiniEdge {
  from: number;
  to: number;
}

function MiniMap({ nodes, edges }: { nodes: MiniNode[]; edges: MiniEdge[] }) {
  return (
    <div style={{
      background: "var(--bg2)",
      border: "1px solid var(--border)",
      borderRadius: 14,
      position: "relative",
      height: 280,
      overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(26,35,64,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(26,35,64,0.25) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }} />
      {/* Edges SVG */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }} viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map((e, i) => {
          const fromNode = nodes[e.from];
          const toNode = nodes[e.to];
          if (!fromNode || !toNode) return null;
          const mx = (fromNode.x + toNode.x) / 2;
          const my = (fromNode.y + toNode.y) / 2;
          return (
            <path
              key={i}
              d={`M${fromNode.x},${fromNode.y} Q${mx},${fromNode.y} ${toNode.x},${toNode.y}`}
              fill="none"
              stroke="var(--border2)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      {/* Nodes */}
      {nodes.map((n, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${n.x}%`,
          top: `${n.y}%`,
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 14px",
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 600,
          color: "var(--t1)",
          whiteSpace: "nowrap",
          zIndex: 2,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: n.color, flexShrink: 0, boxShadow: `0 0 6px ${n.color}40` }} />
          {n.label}
          {n.tags && n.tags.map((tag) => (
            <span key={tag} style={{
              fontFamily: "var(--font-mono)",
              fontSize: 8,
              fontWeight: 700,
              padding: "1px 5px",
              borderRadius: 3,
              background: "rgba(0,194,255,0.1)",
              border: "1px solid rgba(0,194,255,0.2)",
              color: "var(--accent)",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}>{tag}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---- USE CASE DATA ---- */
const useCases = [
  {
    eyebrow: "ENGINEERING TEAMS",
    title: "Map microservices, APIs, and infrastructure.",
    desc: "See the blast radius of any change before you deploy. Turn tribal knowledge into a living, visual system of record.",
    bullets: [
      "Visualize blast radius before shipping changes",
      "Cut incident response time from hours to minutes",
      "Keep architecture docs always up to date",
    ],
    nodes: [
      { label: "API Gateway", type: "API", color: "var(--node-api)", x: 50, y: 15 },
      { label: "Auth Service", type: "PROCESS", color: "var(--node-process)", x: 25, y: 42 },
      { label: "User DB", type: "DATABASE", color: "var(--node-db)", x: 75, y: 42 },
      { label: "Redis", type: "CACHE", color: "var(--node-cache)", x: 15, y: 72 },
      { label: "Notification Queue", type: "QUEUE", color: "var(--node-queue)", x: 50, y: 72 },
      { label: "Monitoring", type: "CLOUD", color: "var(--node-cloud)", x: 82, y: 72 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 4, to: 5 },
    ],
  },
  {
    eyebrow: "PRODUCT TEAMS",
    title: "Plan features, dependencies, and roadmaps.",
    desc: "Map every feature's dependencies before committing to a timeline. Align engineering, design, and stakeholders around a shared visual plan.",
    bullets: [
      "Map feature dependencies before committing to timelines",
      "Track cross-team dependencies in real time",
      "Align roadmap priorities with visual context",
    ],
    nodes: [
      { label: "Feature Launch", type: "SYSTEM", color: "var(--node-system)", x: 50, y: 15 },
      { label: "User Research", type: "PERSON", color: "var(--node-person)", x: 20, y: 42 },
      { label: "Design Sprint", type: "PROCESS", color: "var(--node-process)", x: 50, y: 42 },
      { label: "A/B Testing", type: "GENERIC", color: "#14b8a6", x: 80, y: 42 },
      { label: "Analytics", type: "DATABASE", color: "var(--node-db)", x: 50, y: 75 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
    ],
  },
  {
    eyebrow: "OPERATIONS TEAMS",
    title: "Track vendors, contracts, and supply chains.",
    desc: "Map every vendor relationship and service dependency. Know exactly who is affected when a third-party goes down.",
    bullets: [
      "Map vendor risk and single points of failure",
      "Track SLA compliance across all providers",
      "Speed up incident response with dependency context",
    ],
    nodes: [
      { label: "AWS", type: "CLOUD", color: "var(--node-cloud)", x: 50, y: 15 },
      { label: "Stripe", type: "VENDOR", color: "var(--node-vendor)", x: 20, y: 42 },
      { label: "Datadog", type: "VENDOR", color: "var(--node-vendor)", x: 50, y: 42 },
      { label: "PagerDuty", type: "SYSTEM", color: "var(--node-system)", x: 80, y: 42 },
      { label: "Internal API", type: "API", color: "var(--node-api)", x: 50, y: 75 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
    ],
  },
  {
    eyebrow: "COMPLIANCE TEAMS",
    title: "Map data flows for SOC2, GDPR, HIPAA.",
    desc: "Trace every path PII takes through your stack. Generate audit-ready documentation and demonstrate compliance with visual evidence.",
    bullets: [
      "Trace PII flows across every service and database",
      "Generate audit-ready compliance documentation",
      "Tag nodes with compliance frameworks (SOC2, GDPR, HIPAA)",
    ],
    nodes: [
      { label: "User Data", type: "PERSON", color: "var(--node-person)", x: 15, y: 20, tags: ["PII"] },
      { label: "API Layer", type: "API", color: "var(--node-api)", x: 42, y: 20 },
      { label: "Encrypted DB", type: "DATABASE", color: "var(--node-db)", x: 75, y: 20, tags: ["SOC2"] },
      { label: "Audit Log", type: "PROCESS", color: "var(--node-process)", x: 30, y: 65 },
      { label: "Analytics", type: "SYSTEM", color: "var(--node-system)", x: 70, y: 65, tags: ["SOC2"] },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
    ],
  },
  {
    eyebrow: "LEADERSHIP",
    title: "Visualize org structure and strategic initiatives.",
    desc: "Give executives a clear, visual view of how teams, initiatives, and dependencies connect. Make decisions with full context.",
    bullets: [
      "See the full org structure at a glance",
      "Track strategic initiatives and their dependencies",
      "Align stakeholders around a shared source of truth",
    ],
    nodes: [
      { label: "CEO", type: "PERSON", color: "var(--node-person)", x: 50, y: 15 },
      { label: "Engineering", type: "TEAM", color: "var(--node-team)", x: 25, y: 42 },
      { label: "Product", type: "TEAM", color: "var(--node-team)", x: 75, y: 42 },
      { label: "Q2 OKRs", type: "GENERIC", color: "#14b8a6", x: 30, y: 75 },
      { label: "Hiring Plan", type: "PROCESS", color: "var(--node-process)", x: 70, y: 75 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 3 },
      { from: 2, to: 4 },
      { from: 1, to: 4 },
    ],
  },
  {
    eyebrow: "PROJECT MANAGEMENT",
    title: "Map project dependencies and milestones.",
    desc: "Stop managing dependencies in spreadsheets. Visualize every milestone, blocker, and critical path on a single canvas.",
    bullets: [
      "Map every dependency between milestones",
      "Identify critical paths and bottlenecks visually",
      "Track risk across workstreams in real time",
    ],
    nodes: [
      { label: "Sprint Planning", type: "PROCESS", color: "var(--node-process)", x: 50, y: 15 },
      { label: "Design Review", type: "PERSON", color: "var(--node-person)", x: 20, y: 42 },
      { label: "Backend Dev", type: "SYSTEM", color: "var(--node-system)", x: 50, y: 42 },
      { label: "QA Testing", type: "PROCESS", color: "var(--node-process)", x: 80, y: 42 },
      { label: "Launch", type: "GENERIC", color: "#14b8a6", x: 50, y: 78 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
    ],
  },
];

/* ============================================================
   USE CASES PAGE
   ============================================================ */
export default function UseCasesPage() {
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
            "name": "Use Cases — SwayMaps",
            "description": "See how engineering, product, operations, compliance, leadership, and project management teams use SwayMaps to visualize dependencies and plan with confidence.",
            "url": "https://swaymaps.com/use-cases",
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

      {/* ====================== HERO ====================== */}
      <section className="lp-hero">
        <div className="lp-container">
          <div className="lp-hero-badge">
            <span className="lp-hero-badge-dot" />
            Built for every team
          </div>
          <h1>
            One platform.<br />
            <span className="lp-hero-grad">Every dependency.</span>
          </h1>
          <p className="lp-hero-sub">
            From microservice architectures to org charts, from compliance audits to project milestones — SwayMaps adapts to how your team thinks and plans.
          </p>
          <div className="lp-hero-ctas">
            <Link href="/auth/signup" className="lp-btn lp-btn--primary lp-btn--lg">
              Start Free — No Credit Card <IconArrowRight size={16} />
            </Link>
            <Link href="/features" className="lp-btn lp-btn--outline-lg">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* ====================== USE CASES ====================== */}
      {useCases.map((uc, i) => {
        const isReversed = i % 2 === 1;
        return (
          <section key={uc.eyebrow} className="lp-features lp-section">
            <div className="lp-container">
              <Reveal>
                <div className={`lp-feature-row ${isReversed ? "lp-feature-row--reverse" : ""}`}>
                  <div className="lp-feature-text">
                    <p className="lp-eyebrow">{uc.eyebrow}</p>
                    <h3 className="lp-feature-title">{uc.title}</h3>
                    <p className="lp-feature-desc">{uc.desc}</p>
                    <ul className="lp-feature-bullets">
                      {uc.bullets.map((b) => (
                        <li key={b} className="lp-feature-bullet">
                          <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lp-feature-visual">
                    <MiniMap nodes={uc.nodes} edges={uc.edges} />
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}

      {/* ====================== CTA ====================== */}
      <section className="lp-cta-section lp-section">
        <div className="lp-cta-glow" />
        <div className="lp-container">
          <Reveal>
            <h2 className="lp-cta-title">
              See what depends on what<br />
              <span className="lp-hero-grad">— for your team.</span>
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
