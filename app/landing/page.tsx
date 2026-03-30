"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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

function IconNodeTypes() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <line x1="9.5" y1="9.5" x2="6.5" y2="6.5" />
      <line x1="14.5" y1="9.5" x2="17.5" y2="6.5" />
      <line x1="9.5" y1="14.5" x2="6.5" y2="17.5" />
      <line x1="14.5" y1="14.5" x2="17.5" y2="17.5" />
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

function IconEdge() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="15 8 19 12 15 16" />
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "name": "SwayMaps",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "Web",
                "description": "The visual planning and dependency mapping platform for every team. Map systems, trace impact, align stakeholders with AI-powered visual intelligence. Every node stores rich structured data.",
                "url": "https://swaymaps.com",
                "offers": [
                  {
                    "@type": "Offer",
                    "name": "Free",
                    "price": "0",
                    "priceCurrency": "USD",
                    "description": "3 maps, all node types, PNG & JSON export"
                  },
                  {
                    "@type": "Offer",
                    "name": "Pro",
                    "price": "29",
                    "priceCurrency": "USD",
                    "billingIncrement": "P1M",
                    "description": "Unlimited maps, AI generation, all export formats"
                  },
                  {
                    "@type": "Offer",
                    "name": "Team",
                    "price": "79",
                    "priceCurrency": "USD",
                    "billingIncrement": "P1M",
                    "description": "Everything in Pro plus workspaces, version history, integrations"
                  }
                ],
                "featureList": [
                  "AI-powered map generation from natural language",
                  "11 node types with metadata, status, owner, and tags",
                  "Rich information stored in every node and edge",
                  "Real-time collaboration with workspaces and roles",
                  "Version history with visual diff viewer",
                  "Diagram as code with YAML DSL",
                  "Export to PNG, SVG, PDF, JSON",
                  "Public sharing via unique links",
                  "Slack and Microsoft Teams integration",
                  "Health dashboard with 0-100 scoring",
                  "Command palette for power users",
                  "Import from Draw.io, Lucidchart, Miro"
                ]
              },
              {
                "@type": "Organization",
                "name": "SwayMaps",
                "url": "https://swaymaps.com",
                "logo": "https://swaymaps.com/logo.png",
                "sameAs": ["https://twitter.com/swaymaps", "https://github.com/swaymaps", "https://linkedin.com/company/swaymaps"]
              },
              {
                "@type": "WebSite",
                "name": "SwayMaps",
                "url": "https://swaymaps.com",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://swaymaps.com/docs?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is SwayMaps?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "SwayMaps is a visual planning and dependency mapping platform where every node stores rich structured data -- title, type, status, owner, tags, notes, and custom metadata. It works for engineering, product, operations, compliance, leadership, and project management teams."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is SwayMaps free?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, SwayMaps offers a free forever plan with 3 maps, all 11 node types, and PNG/JSON export. Pro plans start at $19/month (billed annually) with unlimited maps and AI generation."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What teams can use SwayMaps?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "SwayMaps is designed for every team that plans and manages dependencies: engineering teams mapping microservices, product teams mapping feature dependencies, compliance teams mapping data flows for SOC2/GDPR, operations teams tracking vendors, leadership mapping org structures, and project managers mapping milestones."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Does SwayMaps have AI features?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, SwayMaps includes AI-powered map generation. Describe what you want to map in plain English and AI builds the first draft with nodes, edges, and relationships in seconds."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I import from other tools?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, SwayMaps supports importing from Draw.io (XML), Lucidchart (CSV), and Miro (JSON). You can also export to PNG, SVG, PDF, and JSON."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />

      {/* BACKGROUND */}
      <div className="lp-bg">
        <div className="lp-orb lp-orb--1" />
        <div className="lp-orb lp-orb--2" />
        <div className="lp-orb lp-orb--3" />
      </div>

      {/* ================================================================
          NAVBAR
          ================================================================ */}
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

      {/* ================================================================
          HERO
          ================================================================ */}
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
                  <path d="M50,18 C50,28 25,28 25,38" vectorEffect="non-scaling-stroke" />
                  <path d="M50,18 C50,28 50,28 50,38" vectorEffect="non-scaling-stroke" />
                  <path d="M50,18 C50,28 75,28 75,38" vectorEffect="non-scaling-stroke" />
                  <path d="M25,38 C25,48 15,48 15,58" vectorEffect="non-scaling-stroke" />
                  <path d="M25,38 C25,48 38,48 38,58" vectorEffect="non-scaling-stroke" />
                  <path d="M50,38 C50,48 38,48 38,58" vectorEffect="non-scaling-stroke" />
                  <path d="M50,38 C50,48 62,48 62,58" vectorEffect="non-scaling-stroke" />
                  <path d="M75,38 C75,48 62,48 62,58" vectorEffect="non-scaling-stroke" />
                  <path d="M75,38 C75,48 85,48 85,58" vectorEffect="non-scaling-stroke" />
                  <path d="M15,58 C15,68 25,68 25,78" vectorEffect="non-scaling-stroke" />
                  <path d="M38,58 C38,68 50,68 50,78" vectorEffect="non-scaling-stroke" />
                  <path d="M62,58 C62,68 75,68 75,78" vectorEffect="non-scaling-stroke" />
                  <path d="M85,58 C85,68 75,68 75,78" vectorEffect="non-scaling-stroke" />
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

      {/* ================================================================
          WHAT MAKES SWAYMAPS DIFFERENT — NODE EXPERIENCE
          ================================================================ */}
      <section className="lp-section" style={{ paddingTop: "100px", paddingBottom: "100px" }}>
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "64px" }}>
              <p className="lp-eyebrow">THE DIFFERENCE</p>
              <h2 className="lp-section-title" style={{ maxWidth: "700px", margin: "0 auto 16px" }}>
                Not just a diagram.<br />A living knowledge base.
              </h2>
              <p className="lp-section-subtitle" style={{ maxWidth: "640px", margin: "0 auto" }}>
                Every node stores rich information. Every edge describes a real relationship. Your map becomes a queryable source of truth.
              </p>
            </div>
          </Reveal>

          {/* LARGE NODE CARD MOCKUP */}
          <Reveal>
            <div style={{
              maxWidth: "520px",
              margin: "0 auto 64px",
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 40px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.03)"
            }}>
              {/* Node Header */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 24px",
                background: "var(--bg3)",
                borderBottom: "1px solid var(--border)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase" as const,
                    letterSpacing: "1px",
                    color: "#fff",
                    background: "var(--node-system)",
                    padding: "3px 10px",
                    borderRadius: "4px"
                  }}>SYSTEM</span>
                  <span style={{ fontSize: "17px", fontWeight: 700, color: "var(--t1)" }}>Payment Service</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--status-healthy)" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600, color: "var(--status-healthy)" }}>Healthy</span>
                </div>
              </div>

              {/* Node Body */}
              <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Owner */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600, color: "var(--t3)", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Owner</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--t1)" }}>Platform Team</span>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600, color: "var(--t3)", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Tags</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {["pci", "critical", "payments"].map((tag) => (
                      <span key={tag} style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        fontWeight: 500,
                        padding: "3px 10px",
                        borderRadius: "6px",
                        background: "var(--bg4)",
                        border: "1px solid var(--border)",
                        color: "var(--t2)"
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600, color: "var(--t3)", textTransform: "uppercase" as const, letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>Description</span>
                  <div style={{
                    fontSize: "13px",
                    lineHeight: 1.6,
                    color: "var(--t2)",
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "12px 14px"
                  }}>
                    Handles all payment processing via Stripe API. Processes ~50K transactions/day. Auto-scales on ECS.
                  </div>
                </div>

                {/* Metadata */}
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600, color: "var(--t3)", textTransform: "uppercase" as const, letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>Metadata</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {[
                      { key: "Last Deploy", value: "2 days ago" },
                      { key: "SLA", value: "99.99%" },
                      { key: "On-call", value: "@sarah" },
                    ].map((m) => (
                      <div key={m.key} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 14px",
                        background: "var(--bg3)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px"
                      }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--t3)" }}>{m.key}</span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: 600, color: "var(--t1)" }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 600, color: "var(--t3)", textTransform: "uppercase" as const, letterSpacing: "0.5px", display: "block", marginBottom: "8px" }}>Notes</span>
                  <div style={{
                    fontSize: "13px",
                    lineHeight: 1.6,
                    color: "var(--t2)",
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    borderLeft: "3px solid var(--accent)"
                  }}>
                    Migrating to new Stripe webhook format in Q2. See RFC-142.
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* THREE SMALL NODE CARDS */}
          <Reveal>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              maxWidth: "960px",
              margin: "0 auto"
            }}>
              {/* Person Node */}
              <div style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                overflow: "hidden",
                transition: "border-color 0.3s, transform 0.3s"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  background: "var(--bg3)",
                  borderBottom: "1px solid var(--border)"
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    fontWeight: 700,
                    textTransform: "uppercase" as const,
                    letterSpacing: "1px",
                    color: "#fff",
                    background: "var(--node-person)",
                    padding: "2px 8px",
                    borderRadius: "3px"
                  }}>PERSON</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--t1)" }}>Sarah Chen</span>
                </div>
                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontSize: "12px", color: "var(--t2)" }}>Engineering Lead</div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {["backend", "on-call"].map((t) => (
                      <span key={t} className="lp-chip">{t}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--status-healthy)" }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--status-healthy)" }}>Active</span>
                  </div>
                </div>
              </div>

              {/* Database Node */}
              <div style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                overflow: "hidden",
                transition: "border-color 0.3s, transform 0.3s"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  background: "var(--bg3)",
                  borderBottom: "1px solid var(--border)"
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    fontWeight: 700,
                    textTransform: "uppercase" as const,
                    letterSpacing: "1px",
                    color: "#fff",
                    background: "var(--node-db)",
                    padding: "2px 8px",
                    borderRadius: "3px"
                  }}>DATABASE</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--t1)" }}>Orders DB</span>
                </div>
                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontSize: "12px", color: "var(--t2)" }}>PostgreSQL 15</div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {["pci", "encrypted"].map((t) => (
                      <span key={t} className="lp-chip">{t}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--status-warning)" }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--status-warning)" }}>Warning</span>
                  </div>
                  <div style={{
                    fontSize: "11px",
                    color: "var(--t3)",
                    background: "var(--bg3)",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    borderLeft: "2px solid var(--status-warning)"
                  }}>Disk at 82%</div>
                </div>
              </div>

              {/* Vendor Node */}
              <div style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                overflow: "hidden",
                transition: "border-color 0.3s, transform 0.3s"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  background: "var(--bg3)",
                  borderBottom: "1px solid var(--border)"
                }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "9px",
                    fontWeight: 700,
                    textTransform: "uppercase" as const,
                    letterSpacing: "1px",
                    color: "#fff",
                    background: "var(--node-vendor)",
                    padding: "2px 8px",
                    borderRadius: "3px"
                  }}>VENDOR</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--t1)" }}>Stripe</span>
                </div>
                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ fontSize: "12px", color: "var(--t2)" }}>Payment processor</div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {["critical", "pci"].map((t) => (
                      <span key={t} className="lp-chip">{t}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--status-healthy)" }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--status-healthy)" }}>Healthy</span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    background: "var(--bg3)",
                    borderRadius: "6px",
                    padding: "6px 10px"
                  }}>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--t3)" }}>SLA</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--t1)" }}>99.99%</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          EDGE INFORMATION
          ================================================================ */}
      <section className="lp-section" style={{ paddingTop: "60px", paddingBottom: "120px" }}>
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p className="lp-eyebrow">CONNECTIONS</p>
              <h2 className="lp-section-title" style={{ maxWidth: "600px", margin: "0 auto 16px" }}>
                Edges that tell the story.
              </h2>
              <p className="lp-section-subtitle" style={{ maxWidth: "500px", margin: "0 auto" }}>
                Every connection carries meaning. Label relationships, assign types, and trace how everything flows.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxWidth: "620px",
              margin: "0 auto"
            }}>
              {[
                { from: "Payment Service", fromColor: "var(--node-system)", to: "Orders DB", toColor: "var(--node-db)", label: "writes orders", type: "data-flow", typeColor: "var(--node-api)" },
                { from: "Sarah Chen", fromColor: "var(--node-person)", to: "Payment Service", toColor: "var(--node-system)", label: "owns", type: "ownership", typeColor: "var(--node-person)" },
                { from: "Payment Service", fromColor: "var(--node-system)", to: "Stripe", toColor: "var(--node-vendor)", label: "processes payments via", type: "dependency", typeColor: "var(--status-warning)" },
              ].map((edge, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px 20px",
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  transition: "border-color 0.3s"
                }}>
                  {/* From */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: edge.fromColor }} />
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--t1)" }}>{edge.from}</span>
                  </div>

                  {/* Arrow + Label */}
                  <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    position: "relative"
                  }}>
                    <div style={{
                      width: "100%",
                      height: "1px",
                      background: "var(--border2)",
                      position: "relative"
                    }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="var(--border2)" style={{ position: "absolute", right: "-4px", top: "-3.5px" }}>
                        <path d="M0 0l8 4-8 4z" />
                      </svg>
                    </div>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--t2)", whiteSpace: "nowrap" }}>{edge.label}</span>
                  </div>

                  {/* To */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: edge.toColor }} />
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--t1)" }}>{edge.to}</span>
                  </div>

                  {/* Type badge */}
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.5px",
                    color: edge.typeColor,
                    background: `color-mix(in srgb, ${edge.typeColor} 10%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${edge.typeColor} 20%, transparent)`,
                    padding: "3px 10px",
                    borderRadius: "4px",
                    whiteSpace: "nowrap",
                    flexShrink: 0
                  }}>{edge.type}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          USE CASES
          ================================================================ */}
      <section className="lp-usecases lp-section">
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <p className="lp-eyebrow">FOR EVERY TEAM</p>
              <h2 className="lp-section-title" style={{ maxWidth: "600px", margin: "0 auto 16px" }}>One platform. Every dependency.</h2>
              <p className="lp-section-subtitle" style={{ maxWidth: "560px", margin: "0 auto" }}>
                From system architecture to project planning — SwayMaps adapts to how your team thinks.
              </p>
            </div>
          </Reveal>

          <div className="lp-usecase-grid">
            {[
              { icon: <IconEngineering />, color: "var(--node-api)", name: "Engineering", desc: "Map microservices, APIs, and infrastructure. Store status, SLAs, on-call owners, and deploy metadata on every node.", info: "Track health, SLA, on-call" },
              { icon: <IconProduct />, color: "var(--node-system)", name: "Product", desc: "Plan features, dependencies, and roadmaps. Tag nodes by quarter, team, and priority to filter what matters.", info: "Tag by quarter and priority" },
              { icon: <IconOperations />, color: "var(--node-vendor)", name: "Operations", desc: "Track vendors, contracts, and supply chains. Attach contract dates, SLAs, and cost metadata to vendor nodes.", info: "Attach contracts and costs" },
              { icon: <IconCompliance />, color: "var(--node-process)", name: "Compliance", desc: "Map data flows for SOC2, GDPR, HIPAA. Tag nodes with PII, encryption status, and audit classification.", info: "Tag PII and audit status" },
              { icon: <IconLeadership />, color: "var(--node-cloud)", name: "Leadership", desc: "Visualize org structure and strategic initiatives. Store ownership, budget, and OKR data on every node.", info: "Store OKRs and budgets" },
              { icon: <IconPM />, color: "var(--node-person)", name: "Project Management", desc: "Map project dependencies and milestones. Track status, blockers, and owners at a glance.", info: "Track blockers and owners" },
            ].map((uc, i) => (
              <Reveal key={i}>
                <div className="lp-usecase-card">
                  <div className="lp-usecase-icon" style={{ background: `${uc.color}15`, border: `1px solid ${uc.color}30` }}>
                    <span style={{ color: uc.color }}>{uc.icon}</span>
                  </div>
                  <div className="lp-usecase-name">{uc.name}</div>
                  <div className="lp-usecase-desc">{uc.desc}</div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "var(--accent)",
                    background: "rgba(0, 194, 255, 0.06)",
                    border: "1px solid rgba(0, 194, 255, 0.12)",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    display: "inline-block"
                  }}>{uc.info}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          PROBLEMS
          ================================================================ */}
      <section className="lp-problems lp-section">
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <p className="lp-eyebrow">THE PROBLEM</p>
              <h2 className="lp-section-title" style={{ maxWidth: "700px", margin: "0 auto" }}>Plans fail when dependencies are invisible.</h2>
            </div>
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

      {/* ================================================================
          FEATURES — 4 ALTERNATING SECTIONS
          ================================================================ */}
      <section className="lp-features lp-section">
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <p className="lp-eyebrow">FEATURES</p>
              <h2 className="lp-section-title" style={{ maxWidth: "600px", margin: "0 auto" }}>Everything you need to map your world.</h2>
            </div>
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

          {/* F2: Visual Canvas with Rich Data */}
          <Reveal>
            <div className="lp-feature-row lp-feature-row--reverse">
              <div className="lp-feature-text">
                <h3 className="lp-feature-title">11 node types. Infinite information.</h3>
                <p className="lp-feature-desc">
                  An infinite canvas that feels as natural as a whiteboard but with the structure of a database. Every node stores title, type, status, owner, tags, description, and custom metadata. Your map is not just visual — it is queryable.
                </p>
                <ul className="lp-feature-bullets">
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Person, System, API, Database, Queue, Cache, Process, Cloud, Vendor, Team, Generic
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Health status: Healthy, Warning, Critical
                  </li>
                  <li className="lp-feature-bullet">
                    <span className="lp-feature-bullet-icon"><IconCheck size={10} /></span>
                    Owner, tags, notes, and custom key-value metadata
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
                      { name: "Queue", color: "var(--node-queue)" },
                      { name: "Cache", color: "var(--node-cache)" },
                      { name: "Process", color: "var(--node-process)" },
                      { name: "Cloud", color: "var(--node-cloud)" },
                      { name: "Vendor", color: "var(--node-vendor)" },
                      { name: "Team", color: "var(--node-team)" },
                      { name: "Generic", color: "var(--t3)" },
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

      {/* ================================================================
          MORE FEATURES — 3x2 COMPACT GRID
          ================================================================ */}
      <section className="lp-more-features lp-section">
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p className="lp-eyebrow">AND MORE</p>
              <h2 className="lp-section-title" style={{ maxWidth: "500px", margin: "0 auto" }}>Built for power users.</h2>
            </div>
          </Reveal>

          <div className="lp-more-grid">
            {[
              { icon: <IconCode />, name: "Diagram as Code", desc: "Define maps in YAML, version-control in Git" },
              { icon: <IconActivity />, name: "Health Dashboard", desc: "0-100 health score, detect issues at a glance" },
              { icon: <IconDownload />, name: "Import & Export", desc: "Draw.io, Lucidchart, PNG, SVG, PDF, JSON" },
              { icon: <IconTerminal />, name: "Command Palette", desc: "Press \u2318K to search, navigate, act instantly" },
              { icon: <IconPlug />, name: "Integrations", desc: "Slack, Microsoft Teams, webhooks" },
              { icon: <IconNodeTypes />, name: "11 Node Types", desc: "Person, System, API, Database, Queue, Cache, Process, Cloud, Vendor, Team, Generic — each color-coded" },
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

      {/* ================================================================
          COMPARISON
          ================================================================ */}
      <section className="lp-comparison lp-section">
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <p className="lp-eyebrow">WHY SWAYMAPS</p>
              <h2 className="lp-section-title" style={{ maxWidth: "650px", margin: "0 auto 16px" }}>Not another generic diagramming tool.</h2>
              <p className="lp-section-subtitle" style={{ maxWidth: "560px", margin: "0 auto" }}>
                Other tools draw shapes. SwayMaps stores structured data on every node and edge — making your diagram a queryable knowledge base.
              </p>
            </div>
          </Reveal>

          <div className="lp-comparison-grid">
            {[
              {
                name: "Lucidchart / Draw.io",
                weakness: "General-purpose diagramming with no dependency intelligence. No structured data on nodes, no status tracking, no AI generation.",
                advantage: "SwayMaps stores title, type, status, owner, tags, and metadata on every node. It is a diagram and a database.",
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
                weakness: "Freeform whiteboards with no structure. Great for brainstorming, terrible for tracking real dependencies with data.",
                advantage: "SwayMaps combines the freedom of a canvas with structured nodes, typed edges, and rich information on every element.",
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

      {/* ================================================================
          FAQ
          ================================================================ */}
      <section className="lp-faq lp-section">
        <div className="lp-container">
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <p className="lp-eyebrow">FAQ</p>
              <h2 className="lp-section-title" style={{ maxWidth: "500px", margin: "0 auto" }}>Frequently asked questions.</h2>
            </div>
          </Reveal>

          <div className="lp-faq-list">
            {[
              {
                q: "What is SwayMaps?",
                a: "SwayMaps is a visual planning and dependency mapping platform where every node stores rich structured data -- title, type, status, owner, tags, notes, and custom metadata. It works for engineering, product, operations, compliance, leadership, and project management teams. Your map is not just a diagram -- it is a queryable knowledge base.",
              },
              {
                q: "Is SwayMaps free?",
                a: "Yes, SwayMaps offers a free forever plan with 3 maps, all 11 node types, and PNG/JSON export. Pro plans start at $19/month (billed annually) with unlimited maps and AI generation.",
              },
              {
                q: "What teams can use SwayMaps?",
                a: "SwayMaps is designed for every team that plans and manages dependencies: engineering teams mapping microservices with SLA and on-call metadata, product teams mapping feature dependencies with priority tags, compliance teams mapping data flows with PII and audit tags, operations teams tracking vendors with contract and cost metadata, leadership mapping org structures with budget and OKR data, and project managers mapping milestones with status and blocker tracking.",
              },
              {
                q: "Does SwayMaps have AI features?",
                a: "Yes, SwayMaps includes AI-powered map generation. Describe what you want to map in plain English and AI builds the first draft with nodes, edges, and relationships in seconds. Each generated node includes suggested types, statuses, and connections.",
              },
              {
                q: "Can I import from other tools?",
                a: "Yes, SwayMaps supports importing from Draw.io (XML), Lucidchart (CSV), and Miro (JSON). You can also export to PNG, SVG, PDF, and JSON.",
              },
            ].map((item, i) => (
              <Reveal key={i}>
                <div className={`lp-faq-item ${openFaq === i ? "is-open" : ""}`}>
                  <button
                    className="lp-faq-question"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span>{item.q}</span>
                    <span className="lp-faq-icon">{openFaq === i ? "\u2212" : "+"}</span>
                  </button>
                  <div className="lp-faq-answer-wrapper" style={{ maxHeight: openFaq === i ? "300px" : "0px" }}>
                    <p className="lp-faq-answer">{item.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FINAL CTA
          ================================================================ */}
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

      {/* ================================================================
          FOOTER
          ================================================================ */}
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
