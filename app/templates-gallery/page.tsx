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

/* ---- TYPES ---- */
type Category = "all" | "architecture" | "devops" | "compliance" | "organization" | "data-flow" | "vendor";

interface Template {
  slug: string;
  name: string;
  description: string;
  category: Exclude<Category, "all">;
  nodes: number;
  edges: number;
  dots: { x: number; y: number; color: string }[];
  lines: [number, number][];
}

/* ---- CATEGORY CONFIG ---- */
const categoryColors: Record<Exclude<Category, "all">, string> = {
  architecture: "#3b82f6",
  devops: "#22c55e",
  compliance: "#8b5cf6",
  organization: "#f97316",
  "data-flow": "#06b6d4",
  vendor: "#f59e0b",
};

const categoryLabels: Record<Category, string> = {
  all: "All",
  architecture: "Architecture",
  devops: "DevOps",
  compliance: "Compliance",
  organization: "Organization",
  "data-flow": "Data Flow",
  vendor: "Vendor",
};

/* ---- TEMPLATE DATA ---- */
const templates: Template[] = [
  {
    slug: "microservices-architecture",
    name: "Microservices Architecture",
    description: "Map service dependencies across your distributed system",
    category: "architecture", nodes: 12, edges: 16,
    dots: [{ x: 30, y: 40, color: "#3b82f6" }, { x: 70, y: 30, color: "#06b6d4" }, { x: 50, y: 70, color: "#8b5cf6" }, { x: 20, y: 75, color: "#3b82f6" }, { x: 80, y: 65, color: "#22c55e" }],
    lines: [[0, 1], [0, 2], [2, 3], [1, 4]],
  },
  {
    slug: "monolith-to-microservices",
    name: "Monolith to Microservices",
    description: "Plan your migration from monolith to distributed services",
    category: "architecture", nodes: 15, edges: 20,
    dots: [{ x: 50, y: 25, color: "#ef4444" }, { x: 25, y: 60, color: "#3b82f6" }, { x: 50, y: 60, color: "#3b82f6" }, { x: 75, y: 60, color: "#3b82f6" }, { x: 50, y: 85, color: "#22c55e" }],
    lines: [[0, 1], [0, 2], [0, 3], [2, 4]],
  },
  {
    slug: "cicd-pipeline",
    name: "CI/CD Pipeline",
    description: "Visualize your build, test, and deployment workflow",
    category: "devops", nodes: 8, edges: 10,
    dots: [{ x: 15, y: 50, color: "#22c55e" }, { x: 35, y: 50, color: "#22c55e" }, { x: 55, y: 50, color: "#f59e0b" }, { x: 75, y: 50, color: "#3b82f6" }, { x: 90, y: 50, color: "#8b5cf6" }],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    slug: "data-flow-diagram",
    name: "Data Flow Diagram",
    description: "Trace how data moves through your systems",
    category: "data-flow", nodes: 10, edges: 12,
    dots: [{ x: 20, y: 30, color: "#06b6d4" }, { x: 50, y: 30, color: "#06b6d4" }, { x: 80, y: 30, color: "#8b5cf6" }, { x: 35, y: 70, color: "#06b6d4" }, { x: 65, y: 70, color: "#22c55e" }],
    lines: [[0, 1], [1, 2], [0, 3], [3, 4], [1, 4]],
  },
  {
    slug: "soc2-compliance-map",
    name: "SOC2 Compliance Map",
    description: "Map controls and evidence for SOC2 audit readiness",
    category: "compliance", nodes: 14, edges: 18,
    dots: [{ x: 50, y: 20, color: "#8b5cf6" }, { x: 25, y: 50, color: "#8b5cf6" }, { x: 75, y: 50, color: "#8b5cf6" }, { x: 15, y: 80, color: "#22c55e" }, { x: 85, y: 80, color: "#f59e0b" }],
    lines: [[0, 1], [0, 2], [1, 3], [2, 4]],
  },
  {
    slug: "gdpr-data-flow",
    name: "GDPR Data Flow",
    description: "Track personal data processing across your organization",
    category: "compliance", nodes: 11, edges: 14,
    dots: [{ x: 50, y: 25, color: "#8b5cf6" }, { x: 20, y: 55, color: "#ec4899" }, { x: 50, y: 55, color: "#3b82f6" }, { x: 80, y: 55, color: "#06b6d4" }, { x: 50, y: 85, color: "#22c55e" }],
    lines: [[0, 1], [0, 2], [0, 3], [1, 4], [3, 4]],
  },
  {
    slug: "hipaa-system-map",
    name: "HIPAA System Map",
    description: "Visualize PHI data flows and access controls",
    category: "compliance", nodes: 13, edges: 16,
    dots: [{ x: 50, y: 20, color: "#8b5cf6" }, { x: 30, y: 50, color: "#ef4444" }, { x: 70, y: 50, color: "#3b82f6" }, { x: 20, y: 80, color: "#22c55e" }, { x: 80, y: 80, color: "#f59e0b" }],
    lines: [[0, 1], [0, 2], [1, 3], [2, 4]],
  },
  {
    slug: "organization-chart",
    name: "Organization Chart",
    description: "Map team structure, reporting lines, and responsibilities",
    category: "organization", nodes: 9, edges: 8,
    dots: [{ x: 50, y: 20, color: "#f97316" }, { x: 30, y: 50, color: "#f97316" }, { x: 70, y: 50, color: "#f97316" }, { x: 20, y: 80, color: "#ec4899" }, { x: 80, y: 80, color: "#ec4899" }],
    lines: [[0, 1], [0, 2], [1, 3], [2, 4]],
  },
  {
    slug: "team-knowledge-map",
    name: "Team Knowledge Map",
    description: "Identify expertise distribution and knowledge gaps",
    category: "organization", nodes: 12, edges: 15,
    dots: [{ x: 50, y: 35, color: "#f97316" }, { x: 25, y: 55, color: "#ec4899" }, { x: 75, y: 55, color: "#ec4899" }, { x: 35, y: 80, color: "#3b82f6" }, { x: 65, y: 80, color: "#22c55e" }],
    lines: [[0, 1], [0, 2], [1, 3], [2, 4], [1, 2]],
  },
  {
    slug: "vendor-dependency-map",
    name: "Vendor Dependency Map",
    description: "Track third-party vendors and their service dependencies",
    category: "vendor", nodes: 10, edges: 12,
    dots: [{ x: 50, y: 30, color: "#f59e0b" }, { x: 20, y: 60, color: "#f59e0b" }, { x: 50, y: 60, color: "#3b82f6" }, { x: 80, y: 60, color: "#f59e0b" }, { x: 50, y: 85, color: "#ef4444" }],
    lines: [[0, 1], [0, 2], [0, 3], [2, 4]],
  },
  {
    slug: "supply-chain-risk-map",
    name: "Supply Chain Risk Map",
    description: "Assess risk across your supply chain dependencies",
    category: "vendor", nodes: 11, edges: 14,
    dots: [{ x: 50, y: 20, color: "#f59e0b" }, { x: 25, y: 45, color: "#ef4444" }, { x: 75, y: 45, color: "#22c55e" }, { x: 30, y: 75, color: "#f59e0b" }, { x: 70, y: 75, color: "#f59e0b" }],
    lines: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4]],
  },
  {
    slug: "api-gateway-architecture",
    name: "API Gateway Architecture",
    description: "Map API routes, gateways, and backend services",
    category: "architecture", nodes: 10, edges: 14,
    dots: [{ x: 15, y: 50, color: "#ec4899" }, { x: 40, y: 50, color: "#3b82f6" }, { x: 65, y: 30, color: "#06b6d4" }, { x: 65, y: 70, color: "#06b6d4" }, { x: 85, y: 50, color: "#8b5cf6" }],
    lines: [[0, 1], [1, 2], [1, 3], [2, 4], [3, 4]],
  },
  {
    slug: "event-driven-architecture",
    name: "Event-Driven Architecture",
    description: "Visualize event producers, consumers, and message flows",
    category: "architecture", nodes: 12, edges: 16,
    dots: [{ x: 20, y: 35, color: "#3b82f6" }, { x: 20, y: 65, color: "#3b82f6" }, { x: 50, y: 50, color: "#2563eb" }, { x: 80, y: 35, color: "#22c55e" }, { x: 80, y: 65, color: "#22c55e" }],
    lines: [[0, 2], [1, 2], [2, 3], [2, 4]],
  },
  {
    slug: "database-schema-dependencies",
    name: "Database Schema Dependencies",
    description: "Map table relationships, foreign keys, and data models",
    category: "data-flow", nodes: 8, edges: 12,
    dots: [{ x: 30, y: 30, color: "#8b5cf6" }, { x: 70, y: 30, color: "#8b5cf6" }, { x: 30, y: 70, color: "#06b6d4" }, { x: 70, y: 70, color: "#06b6d4" }, { x: 50, y: 50, color: "#8b5cf6" }],
    lines: [[0, 4], [1, 4], [2, 4], [3, 4], [0, 1]],
  },
  {
    slug: "cloud-infrastructure-map",
    name: "Cloud Infrastructure Map",
    description: "Map VPCs, subnets, load balancers, and cloud resources",
    category: "devops", nodes: 14, edges: 18,
    dots: [{ x: 50, y: 20, color: "#6366f1" }, { x: 25, y: 45, color: "#3b82f6" }, { x: 75, y: 45, color: "#3b82f6" }, { x: 30, y: 75, color: "#22c55e" }, { x: 70, y: 75, color: "#22c55e" }],
    lines: [[0, 1], [0, 2], [1, 3], [2, 4], [1, 2]],
  },
  {
    slug: "incident-response-runbook",
    name: "Incident Response Runbook",
    description: "Map escalation paths and response procedures",
    category: "devops", nodes: 9, edges: 11,
    dots: [{ x: 50, y: 20, color: "#ef4444" }, { x: 30, y: 50, color: "#f59e0b" }, { x: 70, y: 50, color: "#22c55e" }, { x: 25, y: 80, color: "#3b82f6" }, { x: 75, y: 80, color: "#8b5cf6" }],
    lines: [[0, 1], [0, 2], [1, 3], [2, 4]],
  },
  {
    slug: "onboarding-knowledge-graph",
    name: "Onboarding Knowledge Graph",
    description: "Guide new hires through systems, tools, and processes",
    category: "organization", nodes: 11, edges: 13,
    dots: [{ x: 50, y: 20, color: "#f97316" }, { x: 25, y: 50, color: "#ec4899" }, { x: 50, y: 50, color: "#3b82f6" }, { x: 75, y: 50, color: "#22c55e" }, { x: 50, y: 80, color: "#f97316" }],
    lines: [[0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [3, 4]],
  },
  {
    slug: "third-party-integration-map",
    name: "Third-Party Integration Map",
    description: "Track external APIs, webhooks, and integration points",
    category: "vendor", nodes: 10, edges: 14,
    dots: [{ x: 50, y: 50, color: "#3b82f6" }, { x: 20, y: 25, color: "#f59e0b" }, { x: 80, y: 25, color: "#f59e0b" }, { x: 20, y: 75, color: "#f59e0b" }, { x: 80, y: 75, color: "#f59e0b" }],
    lines: [[0, 1], [0, 2], [0, 3], [0, 4]],
  },
];

/* ============================================================
   TEMPLATES GALLERY PAGE
   ============================================================ */
export default function TemplatesGalleryPage() {
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState<Category>("all");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = filter === "all" ? templates : templates.filter((t) => t.category === filter);

  return (
    <div className="lp-root">
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

      {/* HERO */}
      <section className="lp-hero" style={{ paddingBottom: 60 }}>
        <div className="lp-container">
          <div className="lp-eyebrow" style={{ textAlign: "center" }}>TEMPLATES</div>
          <h1 style={{ fontSize: 56, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 16 }}>
            Start mapping in seconds,<br />not hours.
          </h1>
          <p className="lp-hero-sub">
            25+ ready-to-use templates for architecture, compliance, DevOps, and more. Pick one, customize it, ship faster.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section style={{ position: "relative", zIndex: 1 }}>
        <div className="lp-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 48 }}>
          {(Object.keys(categoryLabels) as Category[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: "8px 18px",
                borderRadius: 100,
                border: filter === cat ? "1px solid var(--accent)" : "1px solid var(--border)",
                background: filter === cat ? "rgba(0,194,255,0.1)" : "var(--bg3)",
                color: filter === cat ? "var(--accent)" : "var(--t2)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </section>

      {/* TEMPLATE GRID */}
      <section style={{ position: "relative", zIndex: 1, paddingBottom: 120 }}>
        <div className="lp-container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}>
            {filtered.map((t, i) => (
              <Reveal key={t.name}>
                <Link href={`/templates-gallery/${t.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    overflow: "hidden",
                    transition: "border-color 0.3s, transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = "var(--border2)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Preview area */}
                  <div style={{
                    height: 180,
                    background: "var(--bg4)",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    {/* Grid background */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: "linear-gradient(rgba(26,35,64,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(26,35,64,0.25) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }} />
                    {/* SVG lines */}
                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }}>
                      {t.lines.map(([from, to], li) => (
                        <line
                          key={li}
                          x1={`${t.dots[from].x}%`}
                          y1={`${t.dots[from].y}%`}
                          x2={`${t.dots[to].x}%`}
                          y2={`${t.dots[to].y}%`}
                          stroke="var(--border2)"
                          strokeWidth="1.5"
                          opacity="0.6"
                        />
                      ))}
                    </svg>
                    {/* Dots */}
                    {t.dots.map((d, di) => (
                      <div
                        key={di}
                        style={{
                          position: "absolute",
                          left: `${d.x}%`,
                          top: `${d.y}%`,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: d.color,
                          transform: "translate(-50%, -50%)",
                          zIndex: 2,
                          boxShadow: `0 0 8px ${d.color}44`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "20px 24px 24px" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--t1)", marginBottom: 4 }}>
                      {t.name}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: "var(--t2)",
                      lineHeight: 1.5,
                      marginBottom: 16,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {t.description}
                    </div>

                    {/* Bottom row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--t3)",
                          fontWeight: 500,
                        }}>
                          {t.nodes} nodes &middot; {t.edges} edges
                        </span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: 6,
                          background: `${categoryColors[t.category]}15`,
                          color: categoryColors[t.category],
                          border: `1px solid ${categoryColors[t.category]}30`,
                          textTransform: "capitalize",
                        }}>
                          {t.category === "data-flow" ? "Data Flow" : t.category}
                        </span>
                      </div>
                      <Link
                        href="/auth/signup"
                        className="lp-btn lp-btn--ghost"
                        style={{ padding: "6px 14px", fontSize: 12 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Use Template
                      </Link>
                    </div>
                  </div>
                </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--t3)" }}>
              <p style={{ fontSize: 16, marginBottom: 8 }}>No templates in this category yet.</p>
              <p style={{ fontSize: 14 }}>Check back soon or start from scratch.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta-section">
        <div className="lp-cta-glow" />
        <div className="lp-container">
          <Reveal>
            <h2 className="lp-cta-title">
              Don&apos;t see what you need?<br />Build your own.
            </h2>
            <p className="lp-cta-sub">
              Start from a blank canvas or let AI generate a map from your description.
            </p>
            <div className="lp-cta-buttons">
              <Link href="/auth/signup" className="lp-btn lp-btn--primary lp-btn--lg">
                Start Free <IconArrowRight size={16} />
              </Link>
              <Link href="/features" className="lp-btn lp-btn--outline-lg">
                See All Features
              </Link>
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
