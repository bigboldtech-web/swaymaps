"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import "./landing.css";

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

function IconMinus({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 6h8" />
    </svg>
  );
}

function IconBlind() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6l4 5 4-5c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
      <circle cx="12" cy="9" r="2" />
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

function IconGrid() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconTerminal() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function IconPlug() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v6m-4-2v4m8-4v4" /><rect x="4" y="10" width="16" height="6" rx="2" /><path d="M9 16v4m6-4v4" />
    </svg>
  );
}

function IconActivity() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function IconEngineering() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconProduct() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function IconOperations() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconCompliance() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconLeadership() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconPM() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
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

/* ---- SCROLL REVEAL HOOK ---- */
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

/* ============================================================
   LANDING PAGE
   ============================================================ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <span className="lp-nav-logo-icon">
              <Logo size={20} />
            </span>
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
      <section className="lp-hero">
        <div className="lp-container">
          <div className="lp-hero-badge">
            <span className="lp-hero-badge-dot" />
            Trusted by 500+ teams worldwide
          </div>

          <h1>
            See what depends<br />
            <span className="lp-hero-grad">on what.</span>
          </h1>

          <p className="lp-hero-sub">
            The visual planning and dependency mapping platform for every team. Map systems, trace impact, align stakeholders — all in one place.
          </p>

          <div className="lp-hero-ctas">
            <Link href="/auth/signup" className="lp-btn lp-btn--primary lp-btn--lg">
              Start Free — No Credit Card <IconArrowRight size={16} />
            </Link>
            <Link href="/features" className="lp-btn lp-btn--outline-lg">
              See How It Works
            </Link>
          </div>

          <p className="lp-hero-trust">Teams of all sizes use SwayMaps</p>
          <div className="lp-hero-logos">
            <span>Stripe</span>
            <span>Shopify</span>
            <span>Notion</span>
            <span>Linear</span>
            <span>Datadog</span>
            <span>Vercel</span>
          </div>

          {/* BROWSER FRAME */}
          <Reveal>
            <div className="lp-browser">
              <div className="lp-browser-bar">
                <div className="lp-browser-dots">
                  <span className="lp-browser-dot" />
                  <span className="lp-browser-dot" />
                  <span className="lp-browser-dot" />
                </div>
                <span className="lp-browser-title">Project Dependencies — SwayMaps</span>
                <div className="lp-browser-actions">
                  <span className="lp-browser-action">10 nodes &middot; 14 edges &middot; <span style={{ color: "var(--status-healthy)" }}>&#10003;</span> Saved</span>
                  <span className="lp-browser-action lp-browser-action--ai">&#10022; AI Assist</span>
                  <span className="lp-browser-action lp-browser-action--share">Share</span>
                </div>
              </div>

              <div className="lp-canvas">
                <div className="lp-canvas-grid" />

                {/* EDGES SVG */}
                <svg className="lp-canvas-edges" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Product Launch -> Design System */}
                  <path d="M50,18 C50,28 25,28 25,38" vectorEffect="non-scaling-stroke" />
                  {/* Product Launch -> API Integration */}
                  <path d="M50,18 C50,28 50,28 50,38" vectorEffect="non-scaling-stroke" />
                  {/* Product Launch -> Marketing Plan */}
                  <path d="M50,18 C50,28 75,28 75,38" vectorEffect="non-scaling-stroke" />
                  {/* Design System -> User Research */}
                  <path d="M25,38 C25,48 15,48 15,58" vectorEffect="non-scaling-stroke" />
                  {/* Design System -> Backend Dev */}
                  <path d="M25,38 C25,48 38,48 38,58" vectorEffect="non-scaling-stroke" />
                  {/* API Integration -> Backend Dev */}
                  <path d="M50,38 C50,48 38,48 38,58" vectorEffect="non-scaling-stroke" />
                  {/* API Integration -> Content Strategy */}
                  <path d="M50,38 C50,48 62,48 62,58" vectorEffect="non-scaling-stroke" />
                  {/* Marketing Plan -> Content Strategy */}
                  <path d="M75,38 C75,48 62,48 62,58" vectorEffect="non-scaling-stroke" />
                  {/* Marketing Plan -> Legal Review */}
                  <path d="M75,38 C75,48 85,48 85,58" vectorEffect="non-scaling-stroke" />
                  {/* User Research -> Brand Assets */}
                  <path d="M15,58 C15,68 25,68 25,78" vectorEffect="non-scaling-stroke" />
                  {/* Backend Dev -> Database Migration */}
                  <path d="M38,58 C38,68 50,68 50,78" vectorEffect="non-scaling-stroke" />
                  {/* Content Strategy -> Launch Event */}
                  <path d="M62,58 C62,68 75,68 75,78" vectorEffect="non-scaling-stroke" />
                  {/* Legal Review -> Launch Event */}
                  <path d="M85,58 C85,68 75,68 75,78" vectorEffect="non-scaling-stroke" />
                  {/* Brand Assets -> Launch Event */}
                  <path d="M25,78 C25,86 75,86 75,78" vectorEffect="non-scaling-stroke" />
                </svg>

                {/* ROW 1 */}
                <div className="lp-node" style={{ left: "50%", top: "18%" }}>
                  <span className="lp-node-badge" style={{ background: "var(--node-system)" }} />
                  Product Launch
                  <span className="lp-node-status" style={{ background: "var(--status-healthy)" }} />
                </div>

                {/* ROW 2 */}
                <div className="lp-node" style={{ left: "25%", top: "38%" }}>
                  <span className="lp-node-badge" style={{ background: "var(--node-process)" }} />
                  Design System
                </div>
                <div className="lp-node" style={{ left: "50%", top: "38%" }}>
                  <span className="lp-node-badge" style={{ background: "var(--node-api)" }} />
                  API Integration
                </div>
                <div className="lp-node" style={{ left: "75%", top: "38%" }}>
                  <span className="lp-node-badge" style={{ background: "var(--node-team)" }} />
                  Marketing Plan
                </div>

                {/* ROW 3 */}
                <div className="lp-node" style={{ left: "15%", top: "58%" }}>
                  <span className="lp-node-badge" style={{ background: "var(--node-person)" }} />
                  User Research
                </div>
                <div className="lp-node" style={{ left: "38%", top: "58%" }}>
                  <span className="lp-node-badge" style={{ background: "var(--node-system)" }} />
                  Backend Dev
                </div>
                <div className="lp-node" style={{ left: "62%", top: "58%" }}>
                  <span className="lp-node-badge" style={{ background: "var(--node-vendor)" }} />
                  Content Strategy
                </div>
                <div className="lp-node" style={{ left: "85%", top: "58%" }}>
                  <span className="lp-node-badge" style={{ background: "var(--node-cloud)" }} />
                  Legal Review
                </div>

                {/* ROW 4 */}
                <div className="lp-node" style={{ left: "25%", top: "78%" }}>
                  <span className="lp-node-badge" style={{ background: "var(--node-api)" }} />
                  Brand Assets
                </div>
                <div className="lp-node" style={{ left: "50%", top: "78%" }}>
                  <span className="lp-node-badge" style={{ background: "var(--node-db)" }} />
                  Database Migration
                </div>
                <div className="lp-node" style={{ left: "75%", top: "78%" }}>
                  <span className="lp-node-badge" style={{ background: "var(--node-queue)" }} />
                  Launch Event
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* USE CASES */}
      <section className="lp-usecases lp-section">
        <div className="lp-container">
          <Reveal>
            <p className="lp-eyebrow">FOR EVERY TEAM</p>
            <h2 className="lp-section-title">One platform. Every dependency.</h2>
            <p className="lp-section-subtitle">
              From system architecture to project planning — SwayMaps adapts to how your team thinks.
            </p>
          </Reveal>

          <div className="lp-usecase-grid">
            {[
              { icon: <IconEngineering />, color: "var(--node-api)", name: "Engineering", desc: "Map microservices, APIs, and infrastructure", chips: ["API Gateway", "PostgreSQL", "Redis"] },
              { icon: <IconProduct />, color: "var(--node-system)", name: "Product", desc: "Plan features, dependencies, and roadmaps", chips: ["Feature A", "User Research", "Launch"] },
              { icon: <IconOperations />, color: "var(--node-vendor)", name: "Operations", desc: "Track vendors, contracts, and supply chains", chips: ["Stripe", "AWS", "Datadog"] },
              { icon: <IconCompliance />, color: "var(--node-process)", name: "Compliance", desc: "Map data flows for SOC2, GDPR, HIPAA", chips: ["User Data", "Encryption", "Audit Log"] },
              { icon: <IconLeadership />, color: "var(--node-cloud)", name: "Leadership", desc: "Visualize org structure and strategic initiatives", chips: ["CTO", "Platform Team", "Q2 Goals"] },
              { icon: <IconPM />, color: "var(--node-person)", name: "Project Management", desc: "Map project dependencies and milestones", chips: ["Sprint 1", "Design Review", "QA"] },
            ].map((uc, i) => (
              <Reveal key={i}>
                <div className="lp-usecase-card">
                  <div className="lp-usecase-icon" style={{ background: `${uc.color}15`, border: `1px solid ${uc.color}30` }}>
                    <span style={{ color: uc.color }}>{uc.icon}</span>
                  </div>
                  <div className="lp-usecase-name">{uc.name}</div>
                  <div className="lp-usecase-desc">{uc.desc}</div>
                  <div className="lp-usecase-chips">
                    {uc.chips.map((c) => (
                      <span key={c} className="lp-chip">{c}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEMS */}
      <section className="lp-problems lp-section">
        <div className="lp-container">
          <Reveal>
            <p className="lp-eyebrow">THE PROBLEM</p>
            <h2 className="lp-section-title">Plans fail when dependencies are invisible.</h2>
          </Reveal>

          <div className="lp-problems-grid">
            {[
              {
                icon: <IconBlind />,
                title: "Blind Decisions",
                desc: "Teams make changes without seeing downstream impact. Projects derail because nobody mapped the dependencies.",
                stat: "$540K avg cost per major failure",
              },
              {
                icon: <IconClock />,
                title: "Slow Response",
                desc: "When something breaks or changes, hours are wasted tracing what depends on what.",
                stat: "4.2 hours avg response time",
              },
              {
                icon: <IconBrain />,
                title: "Knowledge Loss",
                desc: "Critical knowledge lives in people's heads. When they leave, the knowledge leaves too.",
                stat: "67% of teams lack documentation",
              },
            ].map((p, i) => (
              <Reveal key={i}>
                <div className="lp-problem-card">
                  <div className="lp-problem-icon">{p.icon}</div>
                  <div className="lp-problem-title">{p.title}</div>
                  <div className="lp-problem-desc">{p.desc}</div>
                  <div className="lp-problem-stat">{p.stat}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-features lp-section">
        <div className="lp-container">
          <Reveal>
            <p className="lp-eyebrow">FEATURES</p>
            <h2 className="lp-section-title">Everything you need to map your world.</h2>
          </Reveal>

          {/* F1: AI-Powered Generation */}
          <Reveal>
            <div className="lp-feature-row">
              <div className="lp-feature-text">
                <h3 className="lp-feature-title">Describe it. AI maps it.</h3>
                <p className="lp-feature-desc">
                  Tell SwayMaps what you want to map in plain English. AI generates nodes, edges, and relationships in seconds. Works for any domain — not just engineering.
                </p>
                <ul className="lp-feature-bullets">
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Generate maps from natural language
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    AI suggests connections automatically
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Works for any team or use case
                  </li>
                </ul>
              </div>
              <div className="lp-feature-visual">
                <div className="lp-fv-box">
                  <div className="lp-fv-prompt">
                    <span className="lp-fv-prompt-icon"><IconSpark /></span>
                    <span className="lp-fv-prompt-text">&quot;Map our Q2 product launch dependencies including design, engineering, and marketing&quot;</span>
                  </div>
                  <div className="lp-fv-generated">
                    {[
                      { name: "Product Launch", color: "var(--node-system)" },
                      { name: "Design System", color: "var(--node-process)" },
                      { name: "API Layer", color: "var(--node-api)" },
                      { name: "Marketing", color: "var(--node-team)" },
                      { name: "User Testing", color: "var(--node-person)" },
                      { name: "Legal Review", color: "var(--node-cloud)" },
                    ].map((n) => (
                      <span key={n.name} className="lp-fv-gen-node">
                        <span className="lp-fv-gen-dot" style={{ background: n.color }} />
                        {n.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* F2: Visual Canvas */}
          <Reveal>
            <div className="lp-feature-row lp-feature-row--reverse">
              <div className="lp-feature-text">
                <h3 className="lp-feature-title">Drag, drop, connect.</h3>
                <p className="lp-feature-desc">
                  An infinite canvas that feels as natural as a whiteboard but with the structure of a database. 11 node types, status indicators, tags, and metadata on every element.
                </p>
                <ul className="lp-feature-bullets">
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    11 node types for any use case
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Color-coded status indicators
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Drag-and-drop with snap-to-grid
                  </li>
                </ul>
              </div>
              <div className="lp-feature-visual">
                <div className="lp-fv-box">
                  <div className="lp-fv-node-grid">
                    {[
                      { name: "Person", color: "var(--node-person)" },
                      { name: "System", color: "var(--node-system)" },
                      { name: "API", color: "var(--node-api)" },
                      { name: "Database", color: "var(--node-db)" },
                      { name: "Process", color: "var(--node-process)" },
                      { name: "Cloud", color: "var(--node-cloud)" },
                      { name: "Vendor", color: "var(--node-vendor)" },
                      { name: "Team", color: "var(--node-team)" },
                      { name: "Queue", color: "var(--node-queue)" },
                    ].map((n) => (
                      <div key={n.name} className="lp-fv-node-type">
                        <span className="lp-fv-node-type-dot" style={{ background: n.color }} />
                        {n.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* F3: Collaboration */}
          <Reveal>
            <div className="lp-feature-row">
              <div className="lp-feature-text">
                <h3 className="lp-feature-title">Plan together, in real time.</h3>
                <p className="lp-feature-desc">
                  Invite your entire team. Assign roles, leave comments on any node, share read-only links with stakeholders. Everyone sees the same source of truth.
                </p>
                <ul className="lp-feature-bullets">
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Workspaces with Owner/Admin/Editor/Viewer roles
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
                  <div className="lp-fv-roles">
                    {[
                      { name: "Sarah Chen", initials: "SC", role: "Owner", color: "var(--node-person)" },
                      { name: "Alex Rivera", initials: "AR", role: "Editor", color: "var(--node-system)" },
                      { name: "Jordan Lee", initials: "JL", role: "Viewer", color: "var(--node-process)" },
                    ].map((r) => (
                      <div key={r.name} className="lp-fv-role">
                        <div className="lp-fv-role-left">
                          <div className="lp-fv-role-avatar" style={{ background: r.color }}>{r.initials}</div>
                          <span className="lp-fv-role-name">{r.name}</span>
                        </div>
                        <span className="lp-fv-role-badge">{r.role}</span>
                      </div>
                    ))}
                  </div>
                  <div className="lp-fv-share">
                    <span className="lp-fv-share-url">swaymaps.com/share/a1b2c3d4</span>
                    <span className="lp-fv-share-btn">Copy</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* F4: Version History */}
          <Reveal>
            <div className="lp-feature-row lp-feature-row--reverse">
              <div className="lp-feature-text">
                <h3 className="lp-feature-title">Every change, tracked.</h3>
                <p className="lp-feature-desc">
                  SwayMaps auto-saves version snapshots. Compare any two versions with the built-in diff viewer. Restore previous states with one click.
                </p>
                <ul className="lp-feature-bullets">
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Auto-save snapshots every 5 minutes
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
                      { label: "Added Marketing Plan node", time: "2 min ago", changes: [{ type: "add", text: "+1 node" }, { type: "add", text: "+3 edges" }] },
                      { label: "Updated API Integration status", time: "18 min ago", changes: [{ type: "mod", text: "1 modified" }] },
                      { label: "Removed legacy Auth Service", time: "1 hour ago", changes: [{ type: "del", text: "-1 node" }, { type: "del", text: "-2 edges" }] },
                      { label: "Initial map created", time: "3 hours ago", changes: [{ type: "add", text: "+8 nodes" }, { type: "add", text: "+11 edges" }] },
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
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MORE FEATURES */}
      <section className="lp-more-features lp-section">
        <div className="lp-container">
          <div className="lp-more-grid">
            {[
              { icon: <IconGrid />, name: "25+ Templates", desc: "Start from proven templates for any use case" },
              { icon: <IconCode />, name: "Diagram as Code", desc: "Define maps in YAML, version-control in Git" },
              { icon: <IconDownload />, name: "Import & Export", desc: "Draw.io, Lucidchart, PNG, SVG, PDF, JSON" },
              { icon: <IconTerminal />, name: "Command Palette", desc: "Press \u2318K to search, navigate, act instantly" },
              { icon: <IconPlug />, name: "Integrations", desc: "Slack, Microsoft Teams, webhooks" },
              { icon: <IconActivity />, name: "Health Dashboard", desc: "0-100 health score, detect issues at a glance" },
            ].map((f, i) => (
              <Reveal key={i}>
                <div className="lp-more-card">
                  <div className="lp-more-icon">{f.icon}</div>
                  <div className="lp-more-name">{f.name}</div>
                  <div className="lp-more-desc">{f.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="lp-pricing lp-section">
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <p className="lp-eyebrow">PRICING</p>
              <h2 className="lp-section-title">Start free. Scale as you grow.</h2>
              <p className="lp-section-subtitle" style={{ margin: "0 auto" }}>
                3 maps free forever. No credit card required.
              </p>
            </div>
          </Reveal>

          <div className="lp-pricing-toggle">
            <span className={`lp-pricing-toggle-label ${!annual ? "is-active" : ""}`}>Monthly</span>
            <div
              className={`lp-pricing-toggle-track ${annual ? "is-annual" : ""}`}
              onClick={() => setAnnual(!annual)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setAnnual(!annual); }}
            >
              <div className="lp-pricing-toggle-thumb" />
            </div>
            <span className={`lp-pricing-toggle-label ${annual ? "is-active" : ""}`}>Annual</span>
            <span className="lp-pricing-save">Save 30%</span>
          </div>

          <div className="lp-pricing-grid">
            {/* Free */}
            <Reveal>
              <div className="lp-pricing-card">
                <div className="lp-pricing-name">Free</div>
                <div className="lp-pricing-price">
                  <span className="lp-pricing-amount">$0</span>
                </div>
                <div className="lp-pricing-billed">Free forever</div>
                <ul className="lp-pricing-features">
                  {[
                    { text: "3 maps", has: true },
                    { text: "Unlimited nodes per map", has: true },
                    { text: "PNG & JSON export", has: true },
                    { text: "1 workspace", has: true },
                    { text: "Community support", has: true },
                    { text: "AI generation", has: false },
                    { text: "Collaboration", has: false },
                    { text: "Version history", has: false },
                  ].map((f, i) => (
                    <li key={i} className={`lp-pricing-feature ${!f.has ? "lp-pricing-feature--no" : ""}`}>
                      <span className={`lp-pricing-check ${f.has ? "lp-pricing-check--yes" : "lp-pricing-check--no"}`}>
                        {f.has ? <IconCheck size={10} /> : <IconMinus size={10} />}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="lp-btn lp-btn--ghost lp-pricing-cta">Get Started</Link>
              </div>
            </Reveal>

            {/* Pro */}
            <Reveal>
              <div className="lp-pricing-card lp-pricing-card--popular">
                <span className="lp-pricing-popular-badge">MOST POPULAR</span>
                <div className="lp-pricing-name">Pro</div>
                <div className="lp-pricing-price">
                  <span className="lp-pricing-amount">${annual ? "19" : "29"}</span>
                  <span className="lp-pricing-period">/mo</span>
                </div>
                <div className="lp-pricing-billed">{annual ? "Billed annually ($228/yr)" : "Billed monthly"}</div>
                <ul className="lp-pricing-features">
                  {[
                    { text: "Unlimited maps", has: true },
                    { text: "Unlimited nodes per map", has: true },
                    { text: "All export formats", has: true },
                    { text: "5 workspaces", has: true },
                    { text: "AI generation", has: true },
                    { text: "Priority support", has: true },
                    { text: "Public sharing links", has: true },
                    { text: "Version history", has: false },
                  ].map((f, i) => (
                    <li key={i} className={`lp-pricing-feature ${!f.has ? "lp-pricing-feature--no" : ""}`}>
                      <span className={`lp-pricing-check ${f.has ? "lp-pricing-check--yes" : "lp-pricing-check--no"}`}>
                        {f.has ? <IconCheck size={10} /> : <IconMinus size={10} />}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="lp-btn lp-btn--primary lp-pricing-cta">
                  Start 14-Day Trial <IconArrowRight size={14} />
                </Link>
              </div>
            </Reveal>

            {/* Team */}
            <Reveal>
              <div className="lp-pricing-card">
                <div className="lp-pricing-name">Team</div>
                <div className="lp-pricing-price">
                  <span className="lp-pricing-amount">${annual ? "59" : "79"}</span>
                  <span className="lp-pricing-period">/mo</span>
                </div>
                <div className="lp-pricing-billed">{annual ? "Billed annually ($708/yr)" : "Billed monthly"}</div>
                <ul className="lp-pricing-features">
                  {[
                    { text: "Everything in Pro", has: true },
                    { text: "Unlimited workspaces", has: true },
                    { text: "Team collaboration", has: true },
                    { text: "Role-based access control", has: true },
                    { text: "Version history & diff", has: true },
                    { text: "Audit log", has: true },
                    { text: "SSO & SAML", has: true },
                    { text: "Dedicated support", has: true },
                  ].map((f, i) => (
                    <li key={i} className="lp-pricing-feature">
                      <span className="lp-pricing-check lp-pricing-check--yes">
                        <IconCheck size={10} />
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="lp-btn lp-btn--ghost lp-pricing-cta">
                  Start 14-Day Trial <IconArrowRight size={14} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="lp-comparison lp-section">
        <div className="lp-container">
          <Reveal>
            <p className="lp-eyebrow">WHY SWAYMAPS</p>
            <h2 className="lp-section-title">Not another generic diagramming tool.</h2>
          </Reveal>

          <div className="lp-comparison-grid">
            {[
              {
                name: "Lucidchart / Draw.io",
                weakness: "General-purpose diagramming with no dependency intelligence. No impact analysis, no status tracking, no AI generation.",
                advantage: "SwayMaps is purpose-built for dependency mapping with AI generation, health scores, and impact tracing built in.",
              },
              {
                name: "ServiceNow CMDB",
                weakness: "Enterprise-only, expensive, months to deploy. Designed for IT asset management, not visual planning.",
                advantage: "SwayMaps deploys in minutes. Visual-first approach works for any team, not just IT operations.",
              },
              {
                name: "Backstage",
                weakness: "Developer-only tool. Requires engineering resources to set up and maintain. No visual canvas.",
                advantage: "SwayMaps gives every team a visual canvas with zero setup. No engineering resources required.",
              },
              {
                name: "Miro / FigJam",
                weakness: "Freeform whiteboards with no structure. Great for brainstorming, terrible for tracking real dependencies.",
                advantage: "SwayMaps combines the freedom of a canvas with structured nodes, typed edges, and dependency intelligence.",
              },
            ].map((c, i) => (
              <Reveal key={i}>
                <div className="lp-comparison-card">
                  <div className="lp-comparison-name">{c.name}</div>
                  <div className="lp-comparison-weakness">{c.weakness}</div>
                  <div className="lp-comparison-advantage">
                    <span className="lp-comparison-check"><IconCheck size={10} /></span>
                    <span>{c.advantage}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="lp-cta-section lp-section">
        <div className="lp-cta-glow" />
        <div className="lp-container">
          <Reveal>
            <h2 className="lp-cta-title">
              Stop guessing.<br />
              <span className="lp-hero-grad">Start mapping.</span>
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
