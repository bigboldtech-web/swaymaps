"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import "../landing/landing.css";

/* ─── USE CASE DATA ─── */

const useCases = [
  {
    id: "cto",
    badge: "CTO / VP Engineering",
    badgeColor: "var(--n-system)",
    title: "System & Microservice Dependency Mapping",
    description:
      "Map every service, database, and API in your stack. See the blast radius of any change before you deploy. A single outage at a Fortune 500 costs $100K-$1M/hour -- SwayMaps prevents cascading failures.",
    bullets: [
      "Visualize service-to-service dependencies in real time",
      "Simulate blast radius before shipping changes",
      "Keep architecture docs always up to date",
      "Reduce incident response time from hours to minutes",
    ],
    nodes: [
      { label: "API Gateway", badge: "API", color: "var(--n-api)", status: "var(--healthy)" },
      { label: "Auth Service", badge: "SERVICE", color: "var(--n-system)", status: "var(--healthy)" },
      { label: "PostgreSQL", badge: "DATABASE", color: "var(--n-db)", status: "var(--healthy)" },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
    ],
  },
  {
    id: "em",
    badge: "Engineering Managers",
    badgeColor: "var(--n-process)",
    title: "Change Impact Analysis",
    description:
      "Before any deployment, see exactly which systems and teams are affected. Color-code risk levels. Reduces failed deployments by 60%+ and eliminates 'we didn't know X depended on Y' incidents.",
    bullets: [
      "See affected systems before every release",
      "Color-code nodes by risk level and priority",
      "Tag systems with team ownership",
      "Track dependency changes over time with version history",
    ],
    nodes: [
      { label: "Payment API", badge: "API", color: "var(--n-api)", status: "var(--warning)" },
      { label: "Order Service", badge: "SERVICE", color: "var(--n-system)", status: "var(--healthy)" },
      { label: "Billing DB", badge: "DATABASE", color: "var(--n-db)", status: "var(--warning)" },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
    ],
  },
  {
    id: "platform",
    badge: "Platform Teams",
    badgeColor: "var(--n-cloud)",
    title: "Full Infrastructure Mapping",
    description:
      "Map every service, database, API, cache, and queue -- queryable, tagged, and always current. Import from existing tools and keep your service catalog visual.",
    bullets: [
      "Full inventory of all infrastructure components",
      "Tag and filter by team priority or compliance scope",
      "Import from Draw.io Lucidchart and Miro",
      "Define infrastructure as code with YAML DSL",
    ],
    nodes: [
      { label: "AWS ECS", badge: "CLOUD", color: "var(--n-cloud)", status: "var(--healthy)" },
      { label: "Load Balancer", badge: "SYSTEM", color: "var(--n-system)", status: "var(--healthy)" },
      { label: "RDS", badge: "DATABASE", color: "var(--n-db)", status: "var(--healthy)" },
      { label: "ElastiCache", badge: "CACHE", color: "var(--n-cache)", status: "var(--healthy)" },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
    ],
  },
  {
    id: "ciso",
    badge: "CISO / Compliance",
    badgeColor: "var(--n-db)",
    title: "Data Flow & Compliance Mapping",
    description:
      "Trace where PII flows across every system boundary. Visual proof for SOC2, GDPR, HIPAA auditors, ready in minutes not weeks.",
    bullets: [
      "Map PII flow across every system boundary",
      "Tag nodes with compliance scopes and data classifications",
      "Generate audit-ready exports as PDF or JSON",
      "Version history provides audit trail of changes",
    ],
    nodes: [
      { label: "User API", badge: "PII", color: "var(--n-person)", status: "var(--warning)" },
      { label: "Auth Gateway", badge: "SOC2", color: "var(--n-system)", status: "var(--healthy)" },
      { label: "Encrypted Store", badge: "ENCRYPT", color: "var(--n-process)", status: "var(--healthy)" },
      { label: "Analytics", badge: "PII-FREE", color: "var(--n-api)", status: "var(--healthy)" },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 1, to: 3 },
    ],
  },
  {
    id: "hr",
    badge: "HR / People Ops",
    badgeColor: "var(--n-team)",
    title: "Organizational Knowledge Maps",
    description:
      "Onboard new hires in weeks not months. Map tribal knowledge, team ownership, and institutional dependencies visually. When people leave, their knowledge stays.",
    bullets: [
      "Visual org and knowledge dependency maps",
      "Cut onboarding time from 3 months to 2 weeks",
      "Preserve institutional knowledge when people leave",
      "Share read-only links with stakeholders",
    ],
    nodes: [
      { label: "CTO", badge: "PERSON", color: "var(--n-person)", status: "var(--healthy)" },
      { label: "Platform Team", badge: "TEAM", color: "var(--n-team)", status: "var(--healthy)" },
      { label: "Product Team", badge: "TEAM", color: "var(--n-team)", status: "var(--healthy)" },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
    ],
  },
  {
    id: "procurement",
    badge: "Procurement / Risk",
    badgeColor: "var(--n-vendor)",
    title: "Vendor & Supply Chain Dependency Mapping",
    description:
      "Map all third-party dependencies. When a vendor has an outage or breach, instantly see your exposure. SolarWinds and Log4j taught everyone they don't know their dependency graph.",
    bullets: [
      "Map all third-party vendor dependencies",
      "Instantly see exposure during vendor incidents",
      "Track vendor SLA and contract dependencies",
      "Color-code vendors by risk level",
    ],
    nodes: [
      { label: "Stripe", badge: "VENDOR", color: "var(--n-vendor)", status: "var(--healthy)" },
      { label: "AWS", badge: "VENDOR", color: "var(--n-vendor)", status: "var(--warning)" },
      { label: "Datadog", badge: "VENDOR", color: "var(--n-vendor)", status: "var(--healthy)" },
    ],
    edges: [],
  },
];

/* ─── LOGO ─── */

function LogoMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="6" r="2.5" fill="white" opacity="0.9" />
      <circle cx="18" cy="6" r="2.5" fill="white" opacity="0.9" />
      <circle cx="12" cy="18" r="2.5" fill="white" opacity="0.9" />
      <line x1="8" y1="7" x2="16" y2="7" stroke="white" strokeWidth="1.2" opacity="0.5" />
      <line x1="7" y1="8" x2="11" y2="16" stroke="white" strokeWidth="1.2" opacity="0.5" />
      <line x1="17" y1="8" x2="13" y2="16" stroke="white" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

/* ─── USE CASE VISUAL COMPONENT ─── */

function UseCaseVisual({
  nodes,
  edges,
}: {
  nodes: { label: string; badge: string; color: string; status: string }[];
  edges: { from: number; to: number }[];
}) {
  return (
    <div className="uc-visual">
      <div className="uc-vn">
        {nodes.map((node, i) => (
          <div key={i} className="ucn">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 3,
                background: node.color,
                flexShrink: 0,
              }}
            />
            <span>{node.label}</span>
            <span
              className="badge"
              style={{ background: node.color }}
            >
              {node.badge}
            </span>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: node.status,
                marginLeft: 4,
                flexShrink: 0,
              }}
            />
          </div>
        ))}
        {edges.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginTop: 8,
              paddingTop: 12,
              borderTop: "1px solid var(--border)",
            }}
          >
            {edges.map((edge, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: "0.72rem",
                  color: "var(--t3)",
                  fontFamily: "var(--mono)",
                }}
              >
                <span style={{ color: nodes[edge.from].color, fontWeight: 600 }}>
                  {nodes[edge.from].label}
                </span>
                <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
                  <line
                    x1="0"
                    y1="4"
                    x2="16"
                    y2="4"
                    stroke="var(--t3)"
                    strokeWidth="1"
                    strokeDasharray="3 2"
                  />
                  <polygon points="16,1 20,4 16,7" fill="var(--t3)" />
                </svg>
                <span style={{ color: nodes[edge.to].color, fontWeight: 600 }}>
                  {nodes[edge.to].label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── USE CASE SECTION ─── */

function UseCaseSection({
  uc,
  index,
}: {
  uc: (typeof useCases)[number];
  index: number;
}) {
  const reversed = index % 2 === 1;
  const bgClass = index % 2 === 0 ? "" : "uc-section-alt";

  return (
    <div
      className={`uc-section ${bgClass}`}
      style={{
        background: index % 2 === 0 ? "var(--bg)" : "var(--bg2)",
        padding: "100px 0",
        borderTop: index > 0 ? "1px solid var(--border)" : "none",
      }}
    >
      <div className="container">
        <div
          className="reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div style={{ order: reversed ? 2 : 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 14px",
                borderRadius: 100,
                background: `color-mix(in srgb, ${uc.badgeColor} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${uc.badgeColor} 20%, transparent)`,
                fontSize: "0.76rem",
                fontWeight: 600,
                color: uc.badgeColor,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: uc.badgeColor,
                }}
              />
              {uc.badge}
            </div>
            <h3
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                marginBottom: 16,
                color: "var(--t1)",
              }}
            >
              {uc.title}
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--t2)",
                lineHeight: 1.75,
                marginBottom: 28,
                maxWidth: 500,
              }}
            >
              {uc.description}
            </p>
            <ul className="uc-checklist">
              {uc.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
          <div style={{ order: reversed ? 1 : 2 }}>
            <UseCaseVisual nodes={uc.nodes} edges={uc.edges} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE ─── */

export default function UseCasesPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  /* scroll reveal */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* nav scroll */
  useEffect(() => {
    const nav = document.querySelector(".landing-nav");
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 40) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing-root" ref={rootRef}>
      {/* ── BG ── */}
      <div className="map-bg">
        <div className="grid-layer" />
        <div className="scan" />
        <div className="orb a" />
        <div className="orb b" />
        <div className="orb c" />
      </div>

      {/* ── NAV ── */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <Link href="/landing" className="logo">
            <div className="logo-mark">
              <LogoMark />
            </div>
            <span className="logo-text">SwayMaps</span>
          </Link>
          <div className="nav-links">
            <Link href="/landing#features">Features</Link>
            <Link href="/use-cases">Use Cases</Link>
            <Link href="/landing#pricing">Pricing</Link>
            <Link href="/landing#faq">FAQ</Link>
          </div>
          <div className="nav-actions">
            <Link href="/auth/signin" className="btn btn-ghost">
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn btn-primary">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" style={{ paddingBottom: 60 }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="eyebrow" style={{ justifyContent: "center" }}>
            Use Cases
          </div>
          <h1>
            Built for teams that can&rsquo;t afford{" "}
            <span className="grad">to guess.</span>
          </h1>
          <p className="hero-sub">
            From engineering to compliance, SwayMaps gives every team visual
            clarity over their dependencies.
          </p>
        </div>
      </section>

      {/* ── USE CASE SECTIONS ── */}
      {useCases.map((uc, i) => (
        <UseCaseSection key={uc.id} uc={uc} index={i} />
      ))}

      {/* ── FINAL CTA ── */}
      <section className="final-cta">
        <div className="container">
          <div className="reveal">
            <h2>
              See what depends on what —{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                before it breaks.
              </span>
            </h2>
            <p>
              Map dependencies visually. Understand blast radius instantly. Ship
              with confidence.
            </p>
            <div className="fca">
              <Link href="/auth/signup" className="btn btn-primary btn-lg">
                Start Free
              </Link>
              <a
                href="mailto:hello@swaymaps.com"
                className="btn btn-outline btn-lg"
              >
                Book a Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="container-w">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/landing" className="logo" style={{ marginBottom: 12 }}>
                <div className="logo-mark">
                  <LogoMark />
                </div>
                <span className="logo-text">SwayMaps</span>
              </Link>
              <p>
                The visual dependency intelligence platform for engineering
                teams.
              </p>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <Link href="/landing#features">Features</Link>
              <Link href="/use-cases">Use Cases</Link>
              <Link href="/landing#pricing">Pricing</Link>
              <a href="#">Templates</a>
              <a href="#">Changelog</a>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">API Reference</a>
              <a href="#">Blog</a>
              <a href="#">Guides</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="mailto:hello@swaymaps.com">Contact</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link href="/legal/privacy">Privacy Policy</Link>
              <Link href="/legal/terms">Terms of Service</Link>
              <a href="mailto:security@swaymaps.com">Security</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2026 SwayMaps. All rights reserved.</span>
            <div className="footer-bottom-links">
              <Link href="/legal/privacy">Privacy</Link>
              <Link href="/legal/terms">Terms</Link>
              <a href="mailto:security@swaymaps.com">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
