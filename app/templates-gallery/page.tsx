"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { SwayMapsIcon } from "../../components/SwayMapsLogo";
import "../landing/landing.css";

/* ─── TYPES ─── */

type Category = "all" | "architecture" | "devops" | "compliance" | "organization" | "data-flow" | "vendor";

interface Template {
  name: string;
  description: string;
  category: Exclude<Category, "all">;
  nodes: number;
  edges: number;
  dots: { x: number; y: number; color: string }[];
}

/* ─── CATEGORY CONFIG ─── */

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

/* ─── DOT LAYOUTS ─── */
/* Each template gets a unique arrangement of colored dots to suggest a map preview */

function makeDots(positions: [number, number][], colors: string[]): { x: number; y: number; color: string }[] {
  return positions.map((p, i) => ({ x: p[0], y: p[1], color: colors[i % colors.length] }));
}

/* ─── TEMPLATES DATA ─── */

const templates: Template[] = [
  {
    name: "Microservices Architecture",
    description: "Map service dependencies, databases, and APIs",
    category: "architecture",
    nodes: 12,
    edges: 16,
    dots: makeDots([[30, 20], [70, 20], [20, 55], [50, 55], [80, 55]], ["#3b82f6", "#3b82f6", "#8b5cf6", "#06b6d4", "#22c55e"]),
  },
  {
    name: "Monolith to Microservices",
    description: "Plan your migration path step by step",
    category: "architecture",
    nodes: 15,
    edges: 20,
    dots: makeDots([[20, 40], [45, 20], [45, 60], [70, 30], [70, 50], [70, 70]], ["#ef4444", "#3b82f6", "#3b82f6", "#22c55e", "#22c55e", "#22c55e"]),
  },
  {
    name: "CI/CD Pipeline",
    description: "Visualize your build, test, and deploy pipeline",
    category: "devops",
    nodes: 8,
    edges: 10,
    dots: makeDots([[15, 45], [38, 45], [62, 45], [85, 45]], ["#22c55e", "#06b6d4", "#f59e0b", "#3b82f6"]),
  },
  {
    name: "Data Flow Diagram",
    description: "Trace how data moves through your systems",
    category: "data-flow",
    nodes: 10,
    edges: 12,
    dots: makeDots([[50, 15], [25, 45], [75, 45], [50, 75]], ["#06b6d4", "#3b82f6", "#8b5cf6", "#06b6d4"]),
  },
  {
    name: "SOC2 Compliance Map",
    description: "Map controls and audit requirements",
    category: "compliance",
    nodes: 14,
    edges: 18,
    dots: makeDots([[50, 15], [20, 40], [50, 40], [80, 40], [35, 70], [65, 70]], ["#8b5cf6", "#3b82f6", "#8b5cf6", "#3b82f6", "#22c55e", "#22c55e"]),
  },
  {
    name: "GDPR Data Flow",
    description: "Track PII across system boundaries",
    category: "compliance",
    nodes: 11,
    edges: 14,
    dots: makeDots([[20, 30], [50, 15], [80, 30], [35, 60], [65, 60]], ["#8b5cf6", "#ef4444", "#8b5cf6", "#06b6d4", "#06b6d4"]),
  },
  {
    name: "HIPAA System Map",
    description: "Healthcare data flow and access controls",
    category: "compliance",
    nodes: 13,
    edges: 16,
    dots: makeDots([[50, 15], [25, 40], [75, 40], [15, 70], [50, 70], [85, 70]], ["#8b5cf6", "#3b82f6", "#3b82f6", "#22c55e", "#ef4444", "#22c55e"]),
  },
  {
    name: "Organization Chart",
    description: "Map team structure and reporting lines",
    category: "organization",
    nodes: 9,
    edges: 8,
    dots: makeDots([[50, 15], [30, 45], [70, 45], [20, 75], [50, 75], [80, 75]], ["#f97316", "#f97316", "#f97316", "#ec4899", "#ec4899", "#ec4899"]),
  },
  {
    name: "Team Knowledge Map",
    description: "Capture tribal knowledge and expertise areas",
    category: "organization",
    nodes: 12,
    edges: 15,
    dots: makeDots([[50, 20], [20, 50], [50, 50], [80, 50], [35, 75]], ["#f97316", "#ec4899", "#3b82f6", "#22c55e", "#f59e0b"]),
  },
  {
    name: "Vendor Dependency Map",
    description: "Track all third-party service dependencies",
    category: "vendor",
    nodes: 10,
    edges: 12,
    dots: makeDots([[50, 20], [20, 50], [40, 50], [60, 50], [80, 50]], ["#3b82f6", "#f59e0b", "#f59e0b", "#f59e0b", "#f59e0b"]),
  },
  {
    name: "Supply Chain Risk Map",
    description: "Visualize vendor risk and exposure",
    category: "vendor",
    nodes: 11,
    edges: 14,
    dots: makeDots([[50, 15], [25, 40], [75, 40], [15, 70], [50, 70], [85, 70]], ["#f59e0b", "#ef4444", "#22c55e", "#ef4444", "#f59e0b", "#22c55e"]),
  },
  {
    name: "API Gateway Architecture",
    description: "Map API routes, middleware, and services",
    category: "architecture",
    nodes: 10,
    edges: 14,
    dots: makeDots([[50, 15], [50, 40], [20, 70], [50, 70], [80, 70]], ["#06b6d4", "#3b82f6", "#8b5cf6", "#22c55e", "#f97316"]),
  },
  {
    name: "Event-Driven Architecture",
    description: "Queues, topics, and event handlers",
    category: "architecture",
    nodes: 12,
    edges: 16,
    dots: makeDots([[20, 25], [50, 25], [80, 25], [35, 60], [65, 60]], ["#3b82f6", "#2563eb", "#3b82f6", "#22c55e", "#22c55e"]),
  },
  {
    name: "Database Schema Dependencies",
    description: "Visualize table relationships and data flow",
    category: "data-flow",
    nodes: 8,
    edges: 12,
    dots: makeDots([[25, 25], [75, 25], [25, 65], [75, 65]], ["#f59e0b", "#f59e0b", "#8b5cf6", "#8b5cf6"]),
  },
  {
    name: "Cloud Infrastructure Map",
    description: "AWS, GCP, or Azure resource dependencies",
    category: "devops",
    nodes: 14,
    edges: 18,
    dots: makeDots([[50, 10], [20, 35], [50, 35], [80, 35], [30, 65], [70, 65]], ["#6366f1", "#3b82f6", "#06b6d4", "#3b82f6", "#22c55e", "#f59e0b"]),
  },
  {
    name: "Incident Response Runbook",
    description: "Map escalation paths and response procedures",
    category: "devops",
    nodes: 9,
    edges: 11,
    dots: makeDots([[50, 15], [30, 45], [70, 45], [50, 75]], ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6"]),
  },
  {
    name: "Onboarding Knowledge Graph",
    description: "Everything a new hire needs to know",
    category: "organization",
    nodes: 11,
    edges: 13,
    dots: makeDots([[50, 15], [20, 40], [80, 40], [30, 70], [70, 70]], ["#f97316", "#ec4899", "#3b82f6", "#22c55e", "#8b5cf6"]),
  },
  {
    name: "Third-Party Integration Map",
    description: "Map all external API integrations",
    category: "vendor",
    nodes: 10,
    edges: 14,
    dots: makeDots([[50, 20], [20, 45], [80, 45], [30, 75], [50, 75], [70, 75]], ["#3b82f6", "#f59e0b", "#f59e0b", "#06b6d4", "#06b6d4", "#06b6d4"]),
  },
];

/* ─── SCROLL REVEAL HOOK ─── */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vis");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const revealEls = el.querySelectorAll(".reveal");
    revealEls.forEach((r) => observer.observe(r));

    return () => {
      revealEls.forEach((r) => observer.unobserve(r));
    };
  }, []);

  return ref;
}

/* ─── TEMPLATE CARD PREVIEW ─── */

function CardPreview({ dots }: { dots: Template["dots"] }) {
  return (
    <div
      style={{
        background: "var(--bg5)",
        borderRadius: "10px 10px 0 0",
        height: 140,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle grid dots */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* Connection lines between dots */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {dots.length >= 2 &&
          dots.slice(1).map((dot, i) => (
            <line
              key={i}
              x1={`${dots[i].x}%`}
              y1={`${dots[i].y}%`}
              x2={`${dot.x}%`}
              y2={`${dot.y}%`}
              stroke="rgba(0,194,255,0.12)"
              strokeWidth="0.6"
              strokeDasharray="3 3"
            />
          ))}
      </svg>
      {/* Node dots */}
      {dots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            transform: "translate(-50%, -50%)",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: dot.color,
            boxShadow: `0 0 10px ${dot.color}44`,
            border: "1.5px solid rgba(255,255,255,0.1)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── MAIN PAGE ─── */

export default function TemplatesGalleryPage() {
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useScrollReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered =
    activeFilter === "all"
      ? templates
      : templates.filter((t) => t.category === activeFilter);

  const categories: Category[] = ["all", "architecture", "devops", "compliance", "organization", "data-flow", "vendor"];

  return (
    <div className="landing-root" ref={rootRef}>
      {/* ─── Background ─── */}
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
          <Link href="/landing" className="logo">
            <SwayMapsIcon size={34} />
          </Link>

          <div className="nav-links">
            <Link href="/landing#features">Features</Link>
            <Link href="/landing#use-cases">Use Cases</Link>
            <Link href="/templates-gallery">Templates</Link>
            <Link href="/landing#pricing">Pricing</Link>
          </div>

          <div className="nav-actions">
            <Link href="/auth/signin" className="btn btn-ghost">Sign In</Link>
            <Link href="/auth/signup" className="btn btn-primary">Start Free</Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="hero-badge">
            <span className="pulse-dot" />
            Templates
          </div>
          <h1>
            Start mapping in seconds,<br />
            <span className="grad">not hours.</span>
          </h1>
          <p className="hero-sub">
            25+ proven templates for every use case. One-click clone to your workspace.
          </p>
          <div className="hero-actions">
            <Link href="/auth/signup" className="btn btn-primary btn-lg">Start Free</Link>
            <a href="#templates" className="btn btn-outline btn-lg">Browse Templates</a>
          </div>
        </div>
      </section>

      {/* ═══ FILTER BAR ═══ */}
      <section id="templates" style={{ padding: "40px 0 20px" }}>
        <div className="container reveal">
          <div className="tpl-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 100,
                  background: activeFilter === cat ? "var(--accent)" : "transparent",
                  border: `1px solid ${activeFilter === cat ? "var(--accent)" : "var(--border)"}`,
                  color: activeFilter === cat ? "#070b14" : "var(--t2)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font)",
                  transition: "all var(--ease)",
                }}
                onMouseEnter={(e) => {
                  if (activeFilter !== cat) {
                    (e.target as HTMLElement).style.borderColor = "var(--border2)";
                    (e.target as HTMLElement).style.color = "var(--t1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeFilter !== cat) {
                    (e.target as HTMLElement).style.borderColor = "var(--border)";
                    (e.target as HTMLElement).style.color = "var(--t2)";
                  }
                }}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TEMPLATE GRID ═══ */}
      <section style={{ padding: "40px 0 120px" }}>
        <div className="container">
          <div className="tpl-grid">
            {filtered.map((template, idx) => (
              <TemplateCard
                key={template.name}
                template={template}
                delay={idx % 6}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--t3)" }}>
              <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>No templates in this category yet.</p>
              <p style={{ fontSize: "0.9rem", marginTop: 8 }}>Check back soon or request one below.</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section style={{ padding: "100px 0 120px", borderTop: "1px solid var(--border)", background: "var(--bg2)" }}>
        <div className="container reveal" style={{ textAlign: "center" }}>
          <p className="eyebrow">Custom Maps</p>
          <h2 className="stitle">
            Don&rsquo;t see what you need?<br />
            Build your own in 60 seconds.
          </h2>
          <p className="sdesc" style={{ margin: "16px auto 40px", maxWidth: 500 }}>
            Start from a blank canvas with AI-powered generation. Describe your system and watch it come to life.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth/signup" className="btn btn-primary btn-lg">Start Free</Link>
            <a href="mailto:hello@swaymaps.com" className="btn btn-outline btn-lg">Request a Template</a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="landing-footer">
        <div className="container-w">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/landing" className="logo" style={{ marginBottom: 12, display: "inline-flex" }}>
                <SwayMapsIcon size={28} />
              </Link>
              <p>Visual dependency mapping for engineering teams.</p>
            </div>

            <div className="footer-col">
              <h4>Product</h4>
              <Link href="/landing#features">Features</Link>
              <Link href="/landing#pricing">Pricing</Link>
              <Link href="/templates-gallery">Templates</Link>
              <a href="#">Changelog</a>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
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
              <a href="#">Docs</a>
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

/* ─── TEMPLATE CARD COMPONENT ─── */

function TemplateCard({ template, delay }: { template: Template; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const catColor = categoryColors[template.category];

  return (
    <div
      className={`reveal rd${Math.min(delay + 1, 4)}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg3)",
        border: `1px solid ${hovered ? "var(--border2)" : "var(--border)"}`,
        borderRadius: "var(--r)",
        overflow: "hidden",
        transition: "all var(--ease)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 40px rgba(0,0,0,0.3), 0 0 20px rgba(0,194,255,0.05)"
          : "0 4px 16px rgba(0,0,0,0.15)",
        cursor: "default",
      }}
    >
      {/* Preview area */}
      <CardPreview dots={template.dots} />

      {/* Content */}
      <div style={{ padding: "16px 20px 20px" }}>
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "var(--t1)",
            marginBottom: 4,
          }}
        >
          {template.name}
        </h3>
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--t2)",
            lineHeight: 1.5,
            marginBottom: 16,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {template.description}
        </p>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: "0.72rem",
              color: "var(--t3)",
              fontWeight: 500,
            }}
          >
            {template.nodes} nodes &middot; {template.edges} edges
          </span>
          <span
            style={{
              padding: "3px 10px",
              borderRadius: 100,
              fontSize: "0.65rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: catColor,
              background: `${catColor}18`,
              border: `1px solid ${catColor}30`,
            }}
          >
            {categoryLabels[template.category]}
          </span>
        </div>

        <Link
          href="/auth/signup"
          style={{
            display: "block",
            width: "100%",
            padding: "9px 0",
            textAlign: "center",
            borderRadius: "var(--rs)",
            background: "transparent",
            border: "1px solid var(--border2)",
            color: "var(--t1)",
            fontSize: "0.82rem",
            fontWeight: 600,
            textDecoration: "none",
            fontFamily: "var(--font)",
            transition: "all var(--ease)",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = "rgba(0,194,255,0.08)";
            (e.target as HTMLElement).style.borderColor = "rgba(0,194,255,0.3)";
            (e.target as HTMLElement).style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = "transparent";
            (e.target as HTMLElement).style.borderColor = "var(--border2)";
            (e.target as HTMLElement).style.color = "var(--t1)";
          }}
        >
          Use Template
        </Link>
      </div>
    </div>
  );
}
