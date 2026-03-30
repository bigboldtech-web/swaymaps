"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import "./landing.css";

/* ═══ SVG ICONS ═══ */
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

function IconPlay({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2.5v11l9-5.5z" />
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

function IconUsers() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconTemplate() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="16" height="16" rx="2" />
      <line x1="2" y1="8" x2="18" y2="8" />
      <line x1="8" y1="8" x2="8" y2="18" />
    </svg>
  );
}

function IconHealth() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10h4l2-5 4 10 2-5h4" />
    </svg>
  );
}

function IconExport() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 10l4-4 4 4" />
      <line x1="10" y1="6" x2="10" y2="16" />
      <path d="M3 14v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
    </svg>
  );
}

function IconCommand() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3a2 2 0 00-2 2v2h4V5a2 2 0 00-2-2zM15 3a2 2 0 012 2v2h-4V5a2 2 0 012-2zM5 17a2 2 0 01-2-2v-2h4v2a2 2 0 01-2 2zM15 17a2 2 0 002-2v-2h-4v2a2 2 0 002 2z" />
      <rect x="3" y="7" width="14" height="6" />
    </svg>
  );
}

function IconPlug() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 2v4M13 2v4M4 6h12v3a6 6 0 01-12 0V6zM10 15v3" />
    </svg>
  );
}

function IconNodes() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="5" r="2.5" />
      <circle cx="15" cy="5" r="2.5" />
      <circle cx="10" cy="15" r="2.5" />
      <line x1="6.5" y1="6.5" x2="8.5" y2="13" />
      <line x1="13.5" y1="6.5" x2="11.5" y2="13" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1l2 4.5L15 6l-3.5 3.5L12.5 15 8 12.5 3.5 15l1-5.5L1 6l5-0.5z" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.5 10.5a4 4 0 005.5 0l2-2a4 4 0 00-5.5-5.5l-1 1" />
      <path d="M10.5 7.5a4 4 0 00-5.5 0l-2 2a4 4 0 005.5 5.5l1-1" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="5" x2="17" y2="5" />
      <line x1="3" y1="10" x2="17" y2="10" />
      <line x1="3" y1="15" x2="17" y2="15" />
    </svg>
  );
}

function IconDash() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="4" y1="8" x2="12" y2="8" />
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
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconDiscord() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
    </svg>
  );
}

function IconFile() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 1H3a1 1 0 00-1 1v8a1 1 0 001 1h6a1 1 0 001-1V4L7 1z" />
    </svg>
  );
}

/* ═══ LOGO ═══ */
function LogoMark() {
  return (
    <div className="logo-mark">
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M 28 10 C 12 10, 12 20, 20 20 C 28 20, 28 30, 12 30" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <circle cx="28" cy="10" r="3.5" fill="white" />
        <circle cx="20" cy="20" r="2.5" fill="white" opacity="0.6" />
        <circle cx="12" cy="30" r="3.5" fill="white" />
      </svg>
    </div>
  );
}

/* ═══ INTERSECTION OBSERVER HOOK ═══ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("lp-visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return ref;
}

function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`lp-reveal ${className}`}>
      {children}
    </div>
  );
}

/* ═══ MAIN PAGE ═══ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="lp-root">
      {/* Background */}
      <div className="lp-bg">
        <div className="lp-bg-grid" />
        <div className="lp-bg-orb lp-bg-orb--cyan" />
        <div className="lp-bg-orb lp-bg-orb--indigo" />
        <div className="lp-bg-orb lp-bg-orb--pink" />
      </div>

      {/* ═══ NAVBAR ═══ */}
      <nav className={`lp-nav ${scrolled ? "lp-nav--scrolled" : ""}`}>
        <div className="lp-nav__inner">
          <Link href="/landing" className="lp-nav__brand">
            <LogoMark />
            <span className="lp-nav__wordmark">SwayMaps</span>
          </Link>

          <ul className="lp-nav__links">
            <li><Link href="/features">Features</Link></li>
            <li><Link href="/use-cases">Use Cases</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/docs">Docs</Link></li>
          </ul>

          <div className="lp-nav__cta">
            <Link href="/auth/signin" className="lp-btn lp-btn--ghost">Sign In</Link>
            <Link href="/auth/signup" className="lp-btn lp-btn--primary">
              Get Started <IconArrowRight size={14} />
            </Link>
            <button className="lp-nav__mobile-btn" aria-label="Menu">
              <IconMenu />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="lp-hero">
        <div className="lp-container">
          <div className="lp-hero__badge">
            <span className="lp-hero__badge-dot" />
            Now with AI-Powered Generation
          </div>

          <h1 className="lp-hero__title">
            Map every dependency.<br />
            <span className="lp-hero__title-gradient">Ship with confidence.</span>
          </h1>

          <p className="lp-hero__subtitle">
            The visual dependency platform for engineering teams. See what depends on what — before it breaks.
          </p>

          <div className="lp-hero__buttons">
            <Link href="/auth/signup" className="lp-btn lp-btn--primary-lg">
              Start Free — No Credit Card <IconArrowRight size={16} />
            </Link>
            <Link href="/docs" className="lp-btn lp-btn--outline-lg">
              <IconPlay size={14} /> Watch Demo
            </Link>
          </div>

          <div className="lp-hero__trust">
            <span className="lp-hero__trust-text">Trusted by 500+ engineering teams</span>
            <div className="lp-hero__logos">
              <span>Stripe</span>
              <span>Vercel</span>
              <span>Datadog</span>
              <span>Linear</span>
              <span>Notion</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT SCREENSHOT ═══ */}
      <section className="lp-product">
        <div className="lp-container">
          <RevealSection>
            <div className="lp-product__frame">
              <div className="lp-product__topbar">
                <div className="lp-product__topbar-left">
                  <div className="lp-product__dots">
                    <span className="lp-product__dot lp-product__dot--red" />
                    <span className="lp-product__dot lp-product__dot--yellow" />
                    <span className="lp-product__dot lp-product__dot--green" />
                  </div>
                  <span className="lp-product__filename">Microservice Architecture — SwayMaps</span>
                </div>
                <div className="lp-product__topbar-right">
                  <span className="lp-product__stat">12 nodes</span>
                  <span className="lp-product__stat">16 edges</span>
                  <span className="lp-product__stat lp-product__stat--saved">Saved</span>
                  <button className="lp-product__topbar-btn lp-product__topbar-btn--ai">
                    <IconStar /> AI Assist
                  </button>
                  <button className="lp-product__topbar-btn lp-product__topbar-btn--share">
                    Share
                  </button>
                </div>
              </div>

              <div className="lp-product__canvas">
                <div className="lp-product__canvas-grid" />

                {/* Nodes positioned with consistent spacing */}
                {/* Row 1: top=8%, center */}
                <div className="lp-node" style={{ left: "50%", top: "8%", transform: "translateX(-50%)" }}>
                  <span className="lp-node__badge" style={{ background: "#3b82f6" }}>SYS</span>
                  Web Client
                  <span className="lp-node__status" style={{ background: "#22c55e" }} />
                </div>

                {/* Row 2: top=26%, center */}
                <div className="lp-node" style={{ left: "50%", top: "26%", transform: "translateX(-50%)" }}>
                  <span className="lp-node__badge" style={{ background: "#06b6d4" }}>API</span>
                  API Gateway
                  <span className="lp-node__status" style={{ background: "#22c55e" }} />
                </div>

                {/* Row 3: top=48%, evenly spaced at 8%, 30%, 55%, 78% */}
                <div className="lp-node" style={{ left: "8%", top: "48%" }}>
                  <span className="lp-node__badge" style={{ background: "#22c55e" }}>PROC</span>
                  Auth Service
                </div>
                <div className="lp-node" style={{ left: "30%", top: "48%" }}>
                  <span className="lp-node__badge" style={{ background: "#3b82f6" }}>SYS</span>
                  User Service
                </div>
                <div className="lp-node" style={{ left: "55%", top: "48%" }}>
                  <span className="lp-node__badge" style={{ background: "#3b82f6" }}>SYS</span>
                  Order Service
                  <span className="lp-node__status" style={{ background: "#f59e0b" }} />
                </div>
                <div className="lp-node" style={{ left: "78%", top: "48%" }}>
                  <span className="lp-node__badge" style={{ background: "#2563eb" }}>QUEUE</span>
                  Notifications
                </div>

                {/* Row 4: top=72%, at 8%, 30%, 55%, 78% */}
                <div className="lp-node" style={{ left: "8%", top: "72%" }}>
                  <span className="lp-node__badge" style={{ background: "#8b5cf6" }}>DB</span>
                  PostgreSQL
                </div>
                <div className="lp-node" style={{ left: "30%", top: "72%" }}>
                  <span className="lp-node__badge" style={{ background: "#ef4444" }}>CACHE</span>
                  Redis
                </div>
                <div className="lp-node" style={{ left: "55%", top: "72%" }}>
                  <span className="lp-node__badge" style={{ background: "#8b5cf6" }}>DB</span>
                  Orders DB
                  <span className="lp-node__status" style={{ background: "#ef4444" }} />
                </div>
                <div className="lp-node" style={{ left: "78%", top: "72%" }}>
                  <span className="lp-node__badge" style={{ background: "#f59e0b" }}>VENDOR</span>
                  Kafka
                </div>

                {/* SVG Edges — coordinates match node centers:
                    Row1: 50,12  Row2: 50,30
                    Row3: 14,52  36,52  62,52  84,52
                    Row4: 14,76  36,76  62,76  84,76  */}
                <svg className="lp-product__edges" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Web Client -> API Gateway */}
                  <path d="M 50 16 L 50 28" className="lp-product__edge" stroke="#3b82f6" vectorEffect="non-scaling-stroke" />
                  {/* API Gateway -> Row 3 services (curved) */}
                  <path d="M 48 34 C 48 42, 14 42, 14 50" className="lp-product__edge" stroke="#06b6d4" vectorEffect="non-scaling-stroke" />
                  <path d="M 49 34 C 49 42, 36 42, 36 50" className="lp-product__edge" stroke="#06b6d4" vectorEffect="non-scaling-stroke" />
                  <path d="M 51 34 C 51 42, 62 42, 62 50" className="lp-product__edge" stroke="#3b82f6" vectorEffect="non-scaling-stroke" />
                  <path d="M 52 34 C 52 42, 84 42, 84 50" className="lp-product__edge" stroke="#2563eb" vectorEffect="non-scaling-stroke" />
                  {/* Auth -> PostgreSQL */}
                  <path d="M 14 56 L 14 74" className="lp-product__edge" stroke="#22c55e" vectorEffect="non-scaling-stroke" />
                  {/* User Service -> Redis */}
                  <path d="M 36 56 L 36 74" className="lp-product__edge" stroke="#ef4444" vectorEffect="non-scaling-stroke" />
                  {/* Order Service -> Orders DB */}
                  <path d="M 62 56 L 62 74" className="lp-product__edge" stroke="#8b5cf6" vectorEffect="non-scaling-stroke" />
                  {/* Notifications -> Kafka */}
                  <path d="M 84 56 L 84 74" className="lp-product__edge" stroke="#f59e0b" vectorEffect="non-scaling-stroke" />
                  {/* Cross: User Service -> PostgreSQL */}
                  <path d="M 34 56 C 34 64, 16 64, 16 74" className="lp-product__edge" stroke="#8b5cf6" vectorEffect="non-scaling-stroke" style={{opacity:0.4}} />
                  {/* Cross: Order Service -> Kafka */}
                  <path d="M 64 56 C 64 64, 82 64, 82 74" className="lp-product__edge" stroke="#f59e0b" vectorEffect="non-scaling-stroke" style={{opacity:0.4}} />
                </svg>

                <div className="lp-product__fade" />
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="lp-stats">
        <div className="lp-container">
          <RevealSection>
            <div className="lp-stats__inner">
              <div className="lp-stats__item">
                <span className="lp-stats__number">2,400+</span>
                <span className="lp-stats__label">Maps Created</span>
              </div>
              <div className="lp-stats__item">
                <span className="lp-stats__number">500+</span>
                <span className="lp-stats__label">Teams</span>
              </div>
              <div className="lp-stats__item">
                <span className="lp-stats__number">60%</span>
                <span className="lp-stats__label">Faster Incident Response</span>
              </div>
              <div className="lp-stats__item">
                <span className="lp-stats__number">99.9%</span>
                <span className="lp-stats__label">Uptime</span>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ PROBLEM ═══ */}
      <section className="lp-problem">
        <div className="lp-container">
          <RevealSection>
            <div className="lp-problem__header">
              <div className="lp-eyebrow">The Problem</div>
              <h2 className="lp-section-title">
                Your systems are connected.<br />Your knowledge isn&apos;t.
              </h2>
              <p className="lp-section-sub">
                Modern architectures are a web of microservices, APIs, databases, and third-party dependencies. When something breaks, every second spent guessing costs money.
              </p>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="lp-problem__cards">
              <div className="lp-problem__card">
                <div className="lp-problem__card-icon" style={{ background: "rgba(239, 68, 68, 0.1)" }}>
                  <IconBlind />
                </div>
                <h3 className="lp-problem__card-title">Blind Deployments</h3>
                <p className="lp-problem__card-desc">
                  Teams ship code without knowing what depends on what. A single change cascades through services nobody mapped, taking production down with it.
                </p>
                <div className="lp-problem__card-stat">$540K avg cost per major outage</div>
              </div>

              <div className="lp-problem__card">
                <div className="lp-problem__card-icon" style={{ background: "rgba(245, 158, 11, 0.1)" }}>
                  <IconClock />
                </div>
                <h3 className="lp-problem__card-title">Slow Incident Response</h3>
                <p className="lp-problem__card-desc">
                  When an outage hits, teams spend hours tracing dependency chains through Slack threads, wikis, and tribal knowledge instead of fixing the issue.
                </p>
                <div className="lp-problem__card-stat">4.2 hours avg MTTR</div>
              </div>

              <div className="lp-problem__card">
                <div className="lp-problem__card-icon" style={{ background: "rgba(139, 92, 246, 0.1)" }}>
                  <IconUsers />
                </div>
                <h3 className="lp-problem__card-title">Knowledge Silos</h3>
                <p className="lp-problem__card-desc">
                  Critical system knowledge lives in the heads of a few senior engineers. When they leave, months of institutional context walk out the door.
                </p>
                <div className="lp-problem__card-stat">3-6 months to onboard new engineers</div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="lp-features">
        <div className="lp-container">
          <RevealSection>
            <div className="lp-features__header">
              <div className="lp-eyebrow">Features</div>
              <h2 className="lp-section-title">Everything you need to map your world.</h2>
              <p className="lp-section-sub">
                From AI-powered generation to real-time collaboration, SwayMaps gives your team a single source of truth for system dependencies.
              </p>
            </div>
          </RevealSection>

          {/* Feature 1: AI */}
          <div className="lp-feat">
            <RevealSection>
              <div className="lp-feat__grid">
                <div className="lp-feat__text">
                  <h3>Describe it. AI maps it.</h3>
                  <p>
                    Skip the drag-and-drop. Describe your system architecture in plain English and watch as AI instantly generates a complete dependency map with nodes, edges, and relationships.
                  </p>
                  <ul className="lp-feat__bullets">
                    <li>
                      <span className="lp-feat__check"><IconCheck /></span>
                      Natural language to dependency map in seconds
                    </li>
                    <li>
                      <span className="lp-feat__check"><IconCheck /></span>
                      Automatically detects node types, relationships, and dependencies
                    </li>
                    <li>
                      <span className="lp-feat__check"><IconCheck /></span>
                      Refine and iterate with follow-up prompts
                    </li>
                  </ul>
                </div>
                <div className="lp-feat__visual">
                  <div className="lp-ai-prompt">
                    <div className="lp-ai-prompt__label">
                      <IconStar /> AI ASSIST
                    </div>
                    <div className="lp-ai-prompt__text">
                      Map our payment processing pipeline from checkout through Stripe to the orders database and notification service
                      <span className="lp-ai-prompt__cursor" />
                    </div>
                  </div>
                  <div className="lp-ai-chips">
                    <div className="lp-ai-chip">
                      <span className="lp-ai-chip__dot" style={{ background: "#3b82f6" }} />
                      Checkout UI
                    </div>
                    <div className="lp-ai-chip">
                      <span className="lp-ai-chip__dot" style={{ background: "#06b6d4" }} />
                      Payment API
                    </div>
                    <div className="lp-ai-chip">
                      <span className="lp-ai-chip__dot" style={{ background: "#f59e0b" }} />
                      Stripe
                    </div>
                    <div className="lp-ai-chip">
                      <span className="lp-ai-chip__dot" style={{ background: "#8b5cf6" }} />
                      Orders DB
                    </div>
                    <div className="lp-ai-chip">
                      <span className="lp-ai-chip__dot" style={{ background: "#2563eb" }} />
                      Event Queue
                    </div>
                    <div className="lp-ai-chip">
                      <span className="lp-ai-chip__dot" style={{ background: "#22c55e" }} />
                      Notifications
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>

          {/* Feature 2: Collaboration */}
          <div className="lp-feat">
            <RevealSection>
              <div className="lp-feat__grid lp-feat__grid--reverse">
                <div className="lp-feat__text">
                  <h3>Map together, in real time.</h3>
                  <p>
                    Invite your team to shared workspaces with granular role-based access. Everyone sees the same map, always up to date, with full audit history.
                  </p>
                  <ul className="lp-feat__bullets">
                    <li>
                      <span className="lp-feat__check"><IconCheck /></span>
                      Workspaces with Owner, Admin, Editor, and Viewer roles
                    </li>
                    <li>
                      <span className="lp-feat__check"><IconCheck /></span>
                      Share maps via secure public links with one click
                    </li>
                    <li>
                      <span className="lp-feat__check"><IconCheck /></span>
                      Full audit log of every change, by every team member
                    </li>
                  </ul>
                </div>
                <div className="lp-feat__visual">
                  <div className="lp-collab-roles">
                    <div className="lp-collab-role">
                      <div className="lp-collab-role__avatar" style={{ background: "#3b82f6" }}>AK</div>
                      <div className="lp-collab-role__info">
                        <div className="lp-collab-role__name">Alex Kim</div>
                        <div className="lp-collab-role__label">alex@company.com</div>
                      </div>
                      <span className="lp-collab-role__badge" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" }}>Owner</span>
                    </div>
                    <div className="lp-collab-role">
                      <div className="lp-collab-role__avatar" style={{ background: "#8b5cf6" }}>SR</div>
                      <div className="lp-collab-role__info">
                        <div className="lp-collab-role__name">Sarah Rodriguez</div>
                        <div className="lp-collab-role__label">sarah@company.com</div>
                      </div>
                      <span className="lp-collab-role__badge" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}>Admin</span>
                    </div>
                    <div className="lp-collab-role">
                      <div className="lp-collab-role__avatar" style={{ background: "#22c55e" }}>JT</div>
                      <div className="lp-collab-role__info">
                        <div className="lp-collab-role__name">James Turner</div>
                        <div className="lp-collab-role__label">james@company.com</div>
                      </div>
                      <span className="lp-collab-role__badge" style={{ background: "rgba(34, 197, 94, 0.15)", color: "#22c55e" }}>Editor</span>
                    </div>
                    <div className="lp-collab-role">
                      <div className="lp-collab-role__avatar" style={{ background: "#f59e0b" }}>ML</div>
                      <div className="lp-collab-role__info">
                        <div className="lp-collab-role__name">Maya Lee</div>
                        <div className="lp-collab-role__label">maya@company.com</div>
                      </div>
                      <span className="lp-collab-role__badge" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>Viewer</span>
                    </div>
                  </div>
                  <div className="lp-collab-share">
                    <IconLink />
                    <span className="lp-collab-share__url">swaymaps.com/share/a1b2c3d4-e5f6</span>
                    <button className="lp-collab-share__btn">Copy</button>
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>

          {/* Feature 3: Version History */}
          <div className="lp-feat">
            <RevealSection>
              <div className="lp-feat__grid">
                <div className="lp-feat__text">
                  <h3>Every change, tracked.</h3>
                  <p>
                    SwayMaps automatically snapshots your maps on every save. Browse the full version timeline, see diffs between any two versions, and restore with one click.
                  </p>
                  <ul className="lp-feat__bullets">
                    <li>
                      <span className="lp-feat__check"><IconCheck /></span>
                      Automatic version snapshots on every save
                    </li>
                    <li>
                      <span className="lp-feat__check"><IconCheck /></span>
                      Visual diff viewer to compare any two versions
                    </li>
                    <li>
                      <span className="lp-feat__check"><IconCheck /></span>
                      One-click restore to any previous state
                    </li>
                  </ul>
                </div>
                <div className="lp-feat__visual">
                  <div className="lp-versions">
                    <div className="lp-version-item">
                      <div className="lp-version-item__timeline">
                        <span className="lp-version-item__dot" style={{ borderColor: "#22c55e" }} />
                      </div>
                      <div className="lp-version-item__content">
                        <div className="lp-version-item__title">Added Redis caching layer</div>
                        <div className="lp-version-item__meta">v12 -- Alex Kim -- 2 hours ago</div>
                        <div className="lp-version-item__changes">
                          <span className="lp-version-item__change--add">+2 nodes</span>
                          <span className="lp-version-item__change--add">+3 edges</span>
                        </div>
                      </div>
                    </div>
                    <div className="lp-version-item">
                      <div className="lp-version-item__timeline">
                        <span className="lp-version-item__dot" style={{ borderColor: "#f59e0b" }} />
                      </div>
                      <div className="lp-version-item__content">
                        <div className="lp-version-item__title">Updated Order Service status to warning</div>
                        <div className="lp-version-item__meta">v11 -- Sarah Rodriguez -- 5 hours ago</div>
                        <div className="lp-version-item__changes">
                          <span className="lp-version-item__change--mod">~1 node modified</span>
                        </div>
                      </div>
                    </div>
                    <div className="lp-version-item">
                      <div className="lp-version-item__timeline">
                        <span className="lp-version-item__dot" style={{ borderColor: "#3b82f6" }} />
                      </div>
                      <div className="lp-version-item__content">
                        <div className="lp-version-item__title">Added Kafka event bus integration</div>
                        <div className="lp-version-item__meta">v10 -- James Turner -- yesterday</div>
                        <div className="lp-version-item__changes">
                          <span className="lp-version-item__change--add">+1 node</span>
                          <span className="lp-version-item__change--add">+2 edges</span>
                          <span className="lp-version-item__change--del">-1 edge</span>
                        </div>
                      </div>
                    </div>
                    <div className="lp-version-item">
                      <div className="lp-version-item__timeline">
                        <span className="lp-version-item__dot" style={{ borderColor: "#ef4444" }} />
                      </div>
                      <div className="lp-version-item__content">
                        <div className="lp-version-item__title">Removed deprecated Auth v1 service</div>
                        <div className="lp-version-item__meta">v9 -- Alex Kim -- 2 days ago</div>
                        <div className="lp-version-item__changes">
                          <span className="lp-version-item__change--del">-1 node</span>
                          <span className="lp-version-item__change--del">-4 edges</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>

          {/* Feature 4: Diagram as Code */}
          <div className="lp-feat">
            <RevealSection>
              <div className="lp-feat__grid lp-feat__grid--reverse">
                <div className="lp-feat__text">
                  <h3>Maps that live in your repo.</h3>
                  <p>
                    Export your dependency maps as YAML and check them into Git. Review map changes in PRs, track history with commits, and automate updates in CI/CD.
                  </p>
                  <ul className="lp-feat__bullets">
                    <li>
                      <span className="lp-feat__check"><IconCheck /></span>
                      Clean YAML DSL for readable, versionable maps
                    </li>
                    <li>
                      <span className="lp-feat__check"><IconCheck /></span>
                      Import and export to keep code and canvas in sync
                    </li>
                    <li>
                      <span className="lp-feat__check"><IconCheck /></span>
                      Diff-friendly format for meaningful PR reviews
                    </li>
                  </ul>
                </div>
                <div className="lp-feat__visual">
                  <div className="lp-code-block">
                    <div className="lp-code-block__header">
                      <IconFile /> architecture.sway.yml
                    </div>
                    <div className="lp-code-block__body">
                      <div><span className="code-comment"># Payment Pipeline</span></div>
                      <div><span className="code-key">name</span>: <span className="code-str">&quot;Payment Pipeline&quot;</span></div>
                      <div><span className="code-key">version</span>: <span className="code-num">2</span></div>
                      <div>&nbsp;</div>
                      <div><span className="code-key">nodes</span>:</div>
                      <div>&nbsp; - <span className="code-key">id</span>: <span className="code-str">&quot;checkout&quot;</span></div>
                      <div>&nbsp; &nbsp; <span className="code-key">type</span>: <span className="code-type">system</span></div>
                      <div>&nbsp; &nbsp; <span className="code-key">label</span>: <span className="code-str">&quot;Checkout UI&quot;</span></div>
                      <div>&nbsp; &nbsp; <span className="code-key">status</span>: <span className="code-str">&quot;healthy&quot;</span></div>
                      <div>&nbsp;</div>
                      <div>&nbsp; - <span className="code-key">id</span>: <span className="code-str">&quot;stripe&quot;</span></div>
                      <div>&nbsp; &nbsp; <span className="code-key">type</span>: <span className="code-type">vendor</span></div>
                      <div>&nbsp; &nbsp; <span className="code-key">label</span>: <span className="code-str">&quot;Stripe API&quot;</span></div>
                      <div>&nbsp;</div>
                      <div><span className="code-key">edges</span>:</div>
                      <div>&nbsp; - <span className="code-key">from</span>: <span className="code-str">&quot;checkout&quot;</span></div>
                      <div>&nbsp; &nbsp; <span className="code-key">to</span>: <span className="code-str">&quot;stripe&quot;</span></div>
                      <div>&nbsp; &nbsp; <span className="code-key">label</span>: <span className="code-str">&quot;process payment&quot;</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ═══ MORE FEATURES GRID ═══ */}
      <section className="lp-more">
        <div className="lp-container">
          <RevealSection>
            <div className="lp-more__header">
              <div className="lp-eyebrow">And More</div>
              <h2 className="lp-section-title">Built for power users.</h2>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="lp-more__grid">
              <div className="lp-more__card">
                <div className="lp-more__card-icon"><IconTemplate /></div>
                <h3 className="lp-more__card-title">25+ Templates</h3>
                <p className="lp-more__card-desc">One-click start from proven architecture templates for microservices, data pipelines, and more.</p>
              </div>
              <div className="lp-more__card">
                <div className="lp-more__card-icon"><IconHealth /></div>
                <h3 className="lp-more__card-title">Health Dashboard</h3>
                <p className="lp-more__card-desc">0-100 health score per map. Detect orphaned nodes, missing edges, and configuration issues instantly.</p>
              </div>
              <div className="lp-more__card">
                <div className="lp-more__card-icon"><IconExport /></div>
                <h3 className="lp-more__card-title">Import and Export</h3>
                <p className="lp-more__card-desc">Bring in Draw.io and Lucidchart files. Export to PNG, SVG, PDF, or JSON for any workflow.</p>
              </div>
              <div className="lp-more__card">
                <div className="lp-more__card-icon"><IconCommand /></div>
                <h3 className="lp-more__card-title">Command Palette</h3>
                <p className="lp-more__card-desc">Press Cmd+K to search, navigate, and act. Keyboard-first design for maximum speed.</p>
              </div>
              <div className="lp-more__card">
                <div className="lp-more__card-icon"><IconPlug /></div>
                <h3 className="lp-more__card-title">Integrations</h3>
                <p className="lp-more__card-desc">Connect to Slack, Microsoft Teams, and webhooks. Get notified when maps change.</p>
              </div>
              <div className="lp-more__card">
                <div className="lp-more__card-icon"><IconNodes /></div>
                <h3 className="lp-more__card-title">11 Node Types</h3>
                <p className="lp-more__card-desc">Person, System, API, Database, Queue, Cache, Process, Cloud, Vendor, Team, and Generic.</p>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section className="lp-compare">
        <div className="lp-container">
          <RevealSection>
            <div className="lp-compare__header">
              <div className="lp-eyebrow">Why SwayMaps</div>
              <h2 className="lp-section-title">Built for dependencies. Not general diagramming.</h2>
              <p className="lp-section-sub">
                Generic tools force you to build dependency intelligence from scratch. SwayMaps gives it to you out of the box.
              </p>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="lp-compare__grid">
              <div className="lp-compare__card">
                <div className="lp-compare__card-name">Lucidchart / Draw.io</div>
                <div className="lp-compare__weakness">
                  General-purpose diagramming tools with no concept of dependencies, health status, or node types. Maps become stale immediately.
                </div>
                <div className="lp-compare__advantage">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5l4 4 8-9" /></svg>
                  SwayMaps: Purpose-built for dependencies with typed nodes, health tracking, and version history.
                </div>
              </div>

              <div className="lp-compare__card">
                <div className="lp-compare__card-name">ServiceNow CMDB</div>
                <div className="lp-compare__weakness">
                  Enterprise CMDB tools are expensive, complex, and require months of implementation. Teams avoid them because they are painful to use.
                </div>
                <div className="lp-compare__advantage">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5l4 4 8-9" /></svg>
                  SwayMaps: Visual-first, zero setup. Start mapping in 30 seconds, not 3 months.
                </div>
              </div>

              <div className="lp-compare__card">
                <div className="lp-compare__card-name">Backstage</div>
                <div className="lp-compare__weakness">
                  Developer portals like Backstage are powerful but require significant engineering investment to deploy, customize, and maintain.
                </div>
                <div className="lp-compare__advantage">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5l4 4 8-9" /></svg>
                  SwayMaps: SaaS that works instantly. No infrastructure, no YAML configs, no maintenance.
                </div>
              </div>

              <div className="lp-compare__card">
                <div className="lp-compare__card-name">Miro / FigJam</div>
                <div className="lp-compare__weakness">
                  Whiteboard tools are great for brainstorming but lack structure. Maps are untyped, unversioned, and impossible to keep up to date.
                </div>
                <div className="lp-compare__advantage">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5l4 4 8-9" /></svg>
                  SwayMaps: Structured maps with typed nodes, directed edges, health status, and auto-versioning.
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="lp-pricing">
        <div className="lp-container">
          <RevealSection>
            <div className="lp-pricing__header">
              <div className="lp-eyebrow">Pricing</div>
              <h2 className="lp-section-title">Start free. Scale as you grow.</h2>
              <p className="lp-section-sub" style={{ margin: "0 auto" }}>
                Every plan includes a 14-day free trial. No credit card required to get started.
              </p>

              <div className="lp-pricing__toggle">
                <span className={`lp-pricing__toggle-label ${!annual ? "lp-pricing__toggle-label--active" : ""}`}>Monthly</span>
                <button
                  className={`lp-pricing__toggle-switch ${annual ? "lp-pricing__toggle-switch--active" : ""}`}
                  onClick={() => setAnnual(!annual)}
                  aria-label="Toggle annual pricing"
                >
                  <span className="lp-pricing__toggle-knob" />
                </button>
                <span className={`lp-pricing__toggle-label ${annual ? "lp-pricing__toggle-label--active" : ""}`}>Annual</span>
                <span className="lp-pricing__save">Save 30%</span>
              </div>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="lp-pricing__cards">
              {/* Free */}
              <div className="lp-pricing__card">
                <div className="lp-pricing__plan-name">Free</div>
                <div className="lp-pricing__plan-desc">For individuals exploring dependency mapping.</div>
                <div className="lp-pricing__price">
                  <span className="lp-pricing__price-amount">$0</span>
                  <span className="lp-pricing__price-period">/month</span>
                </div>
                <div className="lp-pricing__price-note">Free forever</div>
                <ul className="lp-pricing__features">
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> Up to 3 maps</li>
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> All 11 node types</li>
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> PNG and JSON export</li>
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> 25+ templates</li>
                  <li><svg className="lp-dash" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="8" x2="11" y2="8" /></svg> <span style={{ color: "var(--t3)" }}>No AI generation</span></li>
                  <li><svg className="lp-dash" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="8" x2="11" y2="8" /></svg> <span style={{ color: "var(--t3)" }}>No workspaces</span></li>
                </ul>
                <Link href="/auth/signup" className="lp-btn lp-btn--ghost">Get Started</Link>
              </div>

              {/* Pro */}
              <div className="lp-pricing__card lp-pricing__card--popular">
                <div className="lp-pricing__popular-badge">MOST POPULAR</div>
                <div className="lp-pricing__plan-name">Pro</div>
                <div className="lp-pricing__plan-desc">For engineers and small teams who need full power.</div>
                <div className="lp-pricing__price">
                  <span className="lp-pricing__price-amount">${annual ? "19" : "29"}</span>
                  <span className="lp-pricing__price-period">/month</span>
                </div>
                <div className="lp-pricing__price-note">{annual ? "Billed annually ($228/yr)" : "Billed monthly"}</div>
                <ul className="lp-pricing__features">
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> Unlimited maps</li>
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> AI-powered generation</li>
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> All export formats</li>
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> Version history</li>
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> Public sharing</li>
                  <li><svg className="lp-dash" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="8" x2="11" y2="8" /></svg> <span style={{ color: "var(--t3)" }}>No team workspaces</span></li>
                </ul>
                <Link href="/auth/signup" className="lp-btn lp-btn--primary">Start Free Trial</Link>
              </div>

              {/* Team */}
              <div className="lp-pricing__card">
                <div className="lp-pricing__plan-name">Team</div>
                <div className="lp-pricing__plan-desc">For teams that need collaboration and governance.</div>
                <div className="lp-pricing__price">
                  <span className="lp-pricing__price-amount">${annual ? "59" : "79"}</span>
                  <span className="lp-pricing__price-period">/month</span>
                </div>
                <div className="lp-pricing__price-note">{annual ? "Billed annually ($708/yr)" : "Billed monthly"}</div>
                <ul className="lp-pricing__features">
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> Everything in Pro</li>
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> Team workspaces</li>
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> Role-based access control</li>
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> Full audit log</li>
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> Slack and Teams integration</li>
                  <li><svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8.5l3.5 3.5 6.5-7" /></svg> Priority support</li>
                </ul>
                <Link href="/auth/signup" className="lp-btn lp-btn--ghost">Start Free Trial</Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="lp-cta">
        <div className="lp-cta__glow" />
        <div className="lp-container">
          <RevealSection>
            <h2 className="lp-cta__title">
              Stop guessing.<br />
              <span className="lp-gradient-text">Start mapping.</span>
            </h2>
            <p className="lp-cta__subtitle">
              Join 500+ engineering teams who use SwayMaps to visualize dependencies, reduce incidents, and ship with confidence.
            </p>
            <div className="lp-cta__buttons">
              <Link href="/auth/signup" className="lp-btn lp-btn--primary-lg">
                Start Free — No Credit Card <IconArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="lp-btn lp-btn--outline-lg">
                View Pricing
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer__grid">
            <div className="lp-footer__brand">
              <Link href="/landing" className="lp-footer__brand-logo">
                <LogoMark />
                <span>SwayMaps</span>
              </Link>
              <p className="lp-footer__brand-tagline">
                The visual dependency intelligence platform for engineering teams.
              </p>
            </div>

            <div>
              <h4 className="lp-footer__col-title">Product</h4>
              <ul className="lp-footer__col-links">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/templates-gallery">Templates</Link></li>
                <li><Link href="/changelog">Changelog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="lp-footer__col-title">Resources</h4>
              <ul className="lp-footer__col-links">
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/use-cases">Use Cases</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="lp-footer__col-title">Company</h4>
              <ul className="lp-footer__col-links">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="lp-footer__col-title">Legal</h4>
              <ul className="lp-footer__col-links">
                <li><Link href="/legal/terms">Terms of Service</Link></li>
                <li><Link href="/legal/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="lp-footer__bottom">
            <span className="lp-footer__copyright">2026 SwayMaps. All rights reserved.</span>
            <div className="lp-footer__socials">
              <a href="https://twitter.com/swaymaps" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><IconTwitter /></a>
              <a href="https://github.com/swaymaps" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><IconGitHub /></a>
              <a href="https://linkedin.com/company/swaymaps" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><IconLinkedIn /></a>
              <a href="https://discord.gg/swaymaps" target="_blank" rel="noopener noreferrer" aria-label="Discord"><IconDiscord /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
