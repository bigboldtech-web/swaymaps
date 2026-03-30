"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import "./landing.css";

/* ═══ LOGO SVG ═══ */
function LogoMark() {
  return (
    <div className="logo-mark">
      <svg viewBox="0 0 40 40" fill="none">
        <path d="M 28 10 C 12 10, 12 20, 20 20 C 28 20, 28 30, 12 30" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
        <circle cx="28" cy="10" r="3.5" fill="white"/>
        <circle cx="20" cy="20" r="2.5" fill="white" opacity="0.6"/>
        <circle cx="12" cy="30" r="3.5" fill="white"/>
      </svg>
    </div>
  );
}

/* ═══ USE CASE DATA ═══ */
const useCasesData = [
  {
    id: "engineering",
    label: "Engineering",
    title: "System & Microservice Mapping",
    desc: "Map every service, database, and API in your stack. See the blast radius of any change before you deploy.",
    checks: [
      "Visualize service-to-service dependencies in real time",
      "Simulate blast radius before shipping changes",
      "Keep architecture docs always up to date",
    ],
    nodes: [
      { label: "API Gateway", badge: "System", color: "#3b82f6" },
      { label: "Auth Service", badge: "Service", color: "#8b5cf6" },
      { label: "PostgreSQL", badge: "Database", color: "#f59e0b" },
      { label: "Redis Cache", badge: "Cache", color: "#ef4444" },
    ],
  },
  {
    id: "platform",
    label: "Platform",
    title: "Infrastructure Dependencies",
    desc: "Visualize cloud resources, queues, caches, and every piece of infrastructure your platform runs on.",
    checks: [
      "Map cloud resources, queues, and caches",
      "Trace infrastructure dependencies end to end",
      "Reduce incident surface with clear ownership lines",
    ],
    nodes: [
      { label: "AWS ECS", badge: "Cloud", color: "#6366f1" },
      { label: "SQS Queue", badge: "Queue", color: "#2563eb" },
      { label: "ElastiCache", badge: "Cache", color: "#ef4444" },
      { label: "RDS Postgres", badge: "Database", color: "#f59e0b" },
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    title: "Data Flow & Audit Maps",
    desc: "Track where PII flows through your systems. Be audit-ready with visual, shareable data maps.",
    checks: [
      "Map PII and sensitive data flows across services",
      "Generate audit-ready visual reports",
      "Stay compliant with SOC 2, GDPR, and HIPAA",
    ],
    nodes: [
      { label: "User Input", badge: "Person", color: "#ec4899" },
      { label: "Auth Service", badge: "System", color: "#3b82f6" },
      { label: "PII Vault", badge: "Database", color: "#8b5cf6" },
      { label: "Audit Log", badge: "Process", color: "#22c55e" },
    ],
  },
  {
    id: "leadership",
    label: "Leadership",
    title: "Org Knowledge & Onboarding",
    desc: "Map tribal knowledge so it never walks out the door. Cut onboarding time from months to weeks.",
    checks: [
      "Capture tribal knowledge before it disappears",
      "Reduce new engineer ramp-up by 60%+",
      "Give leadership clear visibility into system complexity",
    ],
    nodes: [
      { label: "New Hire", badge: "Person", color: "#ec4899" },
      { label: "Team Wiki", badge: "Generic", color: "#14b8a6" },
      { label: "Service Map", badge: "System", color: "#3b82f6" },
      { label: "Mentor", badge: "Person", color: "#f97316" },
    ],
  },
];

/* ═══ COMPARISON DATA ═══ */
const competitors = [
  {
    name: "Lucidchart / Draw.io",
    weakness: "Generic diagramming — no dependency intelligence, no metadata, no health scoring",
    advantage: "Purpose-built for dependencies with AI generation, queryable metadata on every node, and health dashboards",
  },
  {
    name: "ServiceNow CMDB",
    weakness: "Expensive ($100+/user), complex setup, table-based — takes months to deploy",
    advantage: "Visual-first, setup in 60 seconds, free tier available. 10x faster to adopt across teams",
  },
  {
    name: "Backstage (Spotify)",
    weakness: "Developer-only, heavy infrastructure setup, requires dedicated platform team to maintain",
    advantage: "No-code, accessible to non-engineers. Compliance officers and managers use it too",
  },
  {
    name: "Miro / FigJam",
    weakness: "Whiteboards with sticky notes — no structured data, no node types, no API",
    advantage: "Structured nodes with typed metadata, tags, status indicators, YAML DSL, and REST API",
  },
];

const comparisonFeatures = [
  { feature: "Purpose-built for dependencies", others: false, sway: true },
  { feature: "AI-powered map generation", others: false, sway: true },
  { feature: "Setup time", others: "Weeks", sway: "60 sec" },
  { feature: "Typed node metadata", others: false, sway: true },
  { feature: "Health scoring", others: false, sway: true },
  { feature: "YAML / Diagram as Code", others: false, sway: true },
  { feature: "Version history + diff", others: false, sway: true },
  { feature: "Free tier", others: false, sway: true },
  { feature: "Public sharing links", others: false, sway: true },
  { feature: "Export (PNG, SVG, PDF, JSON)", others: "Limited", sway: true },
];

/* ═══ PAGE COMPONENT ═══ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("engineering");
  const [annual, setAnnual] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* --- Scroll: nav state --- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --- Scroll reveal --- */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
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

  /* --- Background canvas animation --- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let scrollY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* Generate curves */
    /* Generate structured curves that flow left-to-right like dependency paths */
    const curves: {
      x1: number; y1: number; cx1: number; cy1: number;
      cx2: number; cy2: number; x2: number; y2: number;
      speed: number; hue: number;
    }[] = [];
    const w = canvas.width;
    const h = canvas.height;
    for (let i = 0; i < 10; i++) {
      const band = (i / 10) * h;  // distribute across vertical bands
      const yBase = band + Math.random() * (h * 0.1);
      const yEnd = band + (Math.random() - 0.5) * (h * 0.2);
      curves.push({
        x1: -w * 0.05,                           // start from left edge
        y1: yBase,
        cx1: w * 0.25 + Math.random() * w * 0.1, // first control — left-center
        cy1: yBase + (Math.random() - 0.5) * 80,
        cx2: w * 0.65 + Math.random() * w * 0.1, // second control — right-center
        cy2: yEnd + (Math.random() - 0.5) * 80,
        x2: w * 1.05,                             // end at right edge
        y2: yEnd,
        speed: 0.2 + Math.random() * 0.4,
        hue: 195 + Math.random() * 20,            // tight cyan range
      });
    }

    /* Generate node dots — spread evenly, not clustered */
    const nodes: { x: number; y: number; r: number; pulse: number; hue: number }[] = [];
    for (let i = 0; i < 20; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      nodes.push({
        x: (col + 0.5) * (w / 5) + (Math.random() - 0.5) * (w * 0.12),
        y: (row + 0.5) * (h / 4) + (Math.random() - 0.5) * (h * 0.15),
        r: 1.5 + Math.random() * 1.5,
        pulse: Math.random() * Math.PI * 2,
        hue: 195 + Math.random() * 20,
      });
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = time * 0.001;
      const parallax = scrollY * 0.15;

      /* Draw curves */
      curves.forEach((c) => {
        ctx.save();
        ctx.translate(0, -parallax * 0.5);
        const hue = c.hue + Math.sin(t * 0.1 + c.speed) * 15;
        ctx.strokeStyle = `hsla(${hue}, 80%, 55%, 0.07)`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 10]);
        ctx.lineDashOffset = -t * 20 * c.speed;
        ctx.beginPath();
        ctx.moveTo(c.x1, c.y1);
        ctx.bezierCurveTo(c.cx1, c.cy1, c.cx2, c.cy2, c.x2, c.y2);
        ctx.stroke();
        ctx.restore();
      });

      /* Draw nodes */
      nodes.forEach((n) => {
        ctx.save();
        ctx.translate(0, -parallax * 0.3);
        const glow = 0.3 + Math.sin(t * 1.5 + n.pulse) * 0.25;
        const hue = n.hue + Math.sin(t * 0.15) * 10;
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${glow * 0.4})`;
        ctx.shadowColor = `hsla(${hue}, 80%, 60%, ${glow * 0.3})`;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* --- Smooth scroll helper --- */
  const scrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const activeUseCase = useCasesData.find((u) => u.id === activeTab)!;

  return (
    <div className="landing-root">
      {/* ═══ MAP BACKGROUND ═══ */}
      <div className="map-bg">
        <canvas ref={canvasRef} id="bgCanvas" />
        <div className="grid-layer" />
        <div className="scan" />
        <div className="orb a" />
        <div className="orb b" />
        <div className="orb c" />
      </div>

      {/* ═══ NAV ═══ */}
      <nav className={`landing-nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" className="logo">
            <LogoMark />
            <span className="logo-text">SwayMaps</span>
          </Link>
          <div className="nav-links">
            <Link href="/features">Features</Link>
            <Link href="/use-cases">Use Cases</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/templates-gallery">Templates</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div className="nav-actions">
            <Link href="/auth/signin" className="btn btn-ghost">Sign In</Link>
            <Link href="/auth/signup" className="btn btn-primary">Start Free</Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="container-w">
          <div className="hero-badge">
            <span className="pulse-dot" />
            Now with AI Generation &amp; Command Palette
          </div>

          <h1>
            See What Depends<br />
            <span className="grad">
              <span style={{ fontSize: "1.15em", letterSpacing: "-0.04em" }}>O</span>n What.
            </span>
          </h1>

          <p className="hero-sub">
            The visual dependency mapping platform for engineering teams.
            Map systems, trace impact, ship with confidence.
          </p>

          <div className="hero-actions">
            <Link href="/auth/signup" className="btn btn-primary btn-lg">
              Start Free -- No Credit Card
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <a href="#features" onClick={(e) => scrollTo(e, "features")} className="btn btn-outline btn-lg">
              See Features
            </a>
          </div>

          <p className="hero-trust">
            Trusted by engineering teams at startups and Fortune 500s
          </p>

          {/* ═══ HERO DEMO ═══ */}
          <div className="hero-demo">
            <div className="demo-frame">
              <div className="demo-topbar">
                <div className="demo-topbar-left">
                  <div className="demo-dots">
                    <span /><span /><span />
                  </div>
                  <span className="demo-filename">Microservice Architecture — SwayMaps</span>
                </div>
                <div className="demo-topbar-center">
                  <span>12 nodes</span>
                  <span className="sep">·</span>
                  <span>16 edges</span>
                  <span className="sep">|</span>
                  <span className="demo-saved">✓ Saved</span>
                </div>
                <div className="demo-topbar-right">
                  <div className="demo-ai-btn">✦ AI Assist</div>
                  <div className="demo-share-btn">Share</div>
                </div>
              </div>

              <div className="demo-canvas">
                {/* SVG Edges — viewBox 0 0 100 100, non-scaling-stroke keeps lines thin */}
                <svg className="demo-edges" viewBox="0 0 100 100" preserveAspectRatio="none" style={{width:"100%",height:"100%"}}>
                  {/* Web Client to API Gateway */}
                  <path vectorEffect="non-scaling-stroke" style={{stroke:"var(--n-api)"}} d="M 50 15 L 50 33"/>
                  {/* API Gateway to services row */}
                  <path vectorEffect="non-scaling-stroke" style={{stroke:"var(--n-api)"}} d="M 50 40 C 50 50, 19 50, 19 58"/>
                  <path vectorEffect="non-scaling-stroke" style={{stroke:"var(--n-api)"}} d="M 50 40 C 50 50, 38 50, 38 58"/>
                  <path vectorEffect="non-scaling-stroke" style={{stroke:"var(--n-system)"}} d="M 50 40 C 50 50, 60 50, 60 58"/>
                  <path vectorEffect="non-scaling-stroke" style={{stroke:"var(--n-system)"}} d="M 50 40 C 50 50, 80 50, 80 58"/>
                  {/* Services to DBs row */}
                  <path vectorEffect="non-scaling-stroke" style={{stroke:"var(--n-process)"}} d="M 19 68 C 19 76, 15 76, 15 83"/>
                  <path vectorEffect="non-scaling-stroke" style={{stroke:"var(--n-db)"}} d="M 38 68 C 38 76, 35 76, 35 83"/>
                  <path vectorEffect="non-scaling-stroke" style={{stroke:"var(--n-db)"}} d="M 60 68 C 60 76, 55 76, 55 83"/>
                  <path vectorEffect="non-scaling-stroke" style={{stroke:"var(--n-vendor)"}} d="M 80 68 C 80 76, 77 76, 77 83"/>
                  {/* Cross connections (subtle) */}
                  <path vectorEffect="non-scaling-stroke" style={{stroke:"var(--n-system)",opacity:0.3}} d="M 38 63 C 45 60, 53 60, 60 63"/>
                  <path vectorEffect="non-scaling-stroke" style={{stroke:"var(--n-vendor)",opacity:0.3}} d="M 60 68 C 66 76, 72 76, 77 83"/>
                </svg>

                {/* Nodes — percentage positions matching SVG coords */}
                <div className="dnode" style={{ top: "8%", left: "50%", transform: "translateX(-50%)" }}>
                  Web Client <span className="dnode-badge" style={{ background: "var(--n-system)" }}>SYSTEM</span>
                  <span className="dnode-status" style={{ background: "var(--healthy)" }} />
                </div>

                <div className="dnode" style={{ top: "30%", left: "50%", transform: "translateX(-50%)" }}>
                  API Gateway <span className="dnode-badge" style={{ background: "var(--n-api)" }}>API</span>
                  <span className="dnode-status" style={{ background: "var(--healthy)" }} />
                </div>

                <div className="dnode" style={{ top: "57%", left: "12%" }}>
                  Auth Service <span className="dnode-badge" style={{ background: "var(--n-process)" }}>PROCESS</span>
                  <span className="dnode-status" style={{ background: "var(--healthy)" }} />
                </div>

                <div className="dnode" style={{ top: "57%", left: "31%" }}>
                  User Service <span className="dnode-badge" style={{ background: "var(--n-system)" }}>SYSTEM</span>
                  <span className="dnode-status" style={{ background: "var(--healthy)" }} />
                </div>

                <div className="dnode" style={{ top: "57%", left: "52%" }}>
                  Order Service <span className="dnode-badge" style={{ background: "var(--n-system)" }}>SYSTEM</span>
                  <span className="dnode-status" style={{ background: "var(--warning)" }} />
                </div>

                <div className="dnode" style={{ top: "57%", left: "73%" }}>
                  Notifications <span className="dnode-badge" style={{ background: "var(--n-queue)" }}>QUEUE</span>
                  <span className="dnode-status" style={{ background: "var(--healthy)" }} />
                </div>

                <div className="dnode" style={{ top: "82%", left: "8%" }}>
                  PostgreSQL <span className="dnode-badge" style={{ background: "var(--n-db)" }}>DB</span>
                  <span className="dnode-status" style={{ background: "var(--healthy)" }} />
                </div>

                <div className="dnode" style={{ top: "82%", left: "28%" }}>
                  Redis <span className="dnode-badge" style={{ background: "var(--n-cache)" }}>CACHE</span>
                  <span className="dnode-status" style={{ background: "var(--healthy)" }} />
                </div>

                <div className="dnode" style={{ top: "82%", left: "48%" }}>
                  Orders DB <span className="dnode-badge" style={{ background: "var(--n-db)" }}>DB</span>
                  <span className="dnode-status" style={{ background: "var(--critical)" }} />
                </div>

                <div className="dnode" style={{ top: "82%", left: "70%" }}>
                  Kafka <span className="dnode-badge" style={{ background: "var(--n-vendor)" }}>VENDOR</span>
                  <span className="dnode-status" style={{ background: "var(--healthy)" }} />
                </div>

                <div className="demo-fade" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF BAR ═══ */}
      <section className="proof-bar" style={{padding:"56px 0 48px",borderBottom:"1px solid var(--border)"}}>
        <div className="container-w">
          {/* Company logos */}
          <p className="reveal" style={{textAlign:"center",fontSize:".75rem",fontWeight:600,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:"28px"}}>
            Trusted by engineering teams at innovative companies
          </p>
          <div className="reveal" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"48px",flexWrap:"wrap",marginBottom:"48px",opacity:0.5}}>
            {["Stripe","Shopify","Datadog","Vercel","Linear","Notion"].map((company) => (
              <div key={company} style={{fontFamily:"var(--font)",fontSize:"1.3rem",fontWeight:800,letterSpacing:"-0.02em",color:"var(--t2)",userSelect:"none"}}>
                {company}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="proof-inner reveal">
            <div className="proof-stat">
              <div className="num">2,400+</div>
              <div className="lbl">Maps Created</div>
            </div>
            <div className="proof-divider" />
            <div className="proof-stat">
              <div className="num">500+</div>
              <div className="lbl">Teams Using SwayMaps</div>
            </div>
            <div className="proof-divider" />
            <div className="proof-stat">
              <div className="num">60%</div>
              <div className="lbl">Faster Incident Response</div>
            </div>
            <div className="proof-divider" />
            <div className="proof-stat">
              <div className="num">3x</div>
              <div className="lbl">Faster Onboarding</div>
            </div>
            <div className="proof-divider" />
            <div className="proof-stat">
              <div className="num">99.9%</div>
              <div className="lbl">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROBLEMS ═══ */}
      <section id="problems">
        <div className="container">
          <div className="reveal">
            <div className="eyebrow">The Problem</div>
            <div className="stitle">Your systems are connected.<br />Your knowledge isn&apos;t.</div>
            <div className="sdesc">
              Dependencies live in tribal knowledge, stale wikis, and &ldquo;ask Sarah.&rdquo;
              When something breaks, everyone scrambles.
            </div>
          </div>

          <div className="problems-grid">
            <div className="problem-card pc1 reveal rd1">
              <div className="problem-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3>Blind Deployments</h3>
              <p>Teams ship changes without knowing what breaks downstream. One bad deploy costs $100K+ in rollbacks and downtime.</p>
            </div>
            <div className="problem-card pc2 reveal rd2">
              <div className="problem-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h3>Slow Incidents</h3>
              <p>MTTR keeps climbing because nobody can trace the dependency chain. Hours wasted asking &ldquo;what calls what?&rdquo;</p>
            </div>
            <div className="problem-card pc3 reveal rd3">
              <div className="problem-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"/></svg>
              </div>
              <h3>Painful Onboarding</h3>
              <p>New engineers take 3-6 months to understand the system. The knowledge lives in people&apos;s heads, not in docs.</p>
            </div>
            <div className="problem-card pc4 reveal rd4">
              <div className="problem-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"/></svg>
              </div>
              <h3>Risky Migrations</h3>
              <p>Cloud moves and vendor changes happen without dependency visibility. You discover what you missed in production.</p>
            </div>
            <div className="problem-card pc5 reveal">
              <div className="problem-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <h3>Compliance Gaps</h3>
              <p>Auditors ask &ldquo;what touches PII?&rdquo; and nobody can answer in under a week. SOC2 and GDPR audits become fire drills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES BENTO ═══ */}
      <section id="features">
        <div className="container-w">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="eyebrow">Features</div>
            <div className="stitle">Everything you need to<br/>map your world.</div>
            <div className="sdesc" style={{ margin: "16px auto 0" }}>
              From AI generation to version history — a complete platform for visual dependency intelligence.
            </div>
          </div>

          <div className="bento">
            {/* 1: AI -- 7col, 2row */}
            <div className="bc b1 reveal">
              <div className="ci" style={{fontSize:".75rem"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3>AI-Powered Generation</h3>
              <p>Describe what you want to map in plain English. AI builds the first draft in seconds — nodes, edges, relationships, and layout included. Iterate with AI brainstorm.</p>
              <div className="ai-demo">
                <div className="ai-prompt">
                  <span className="spark">✦</span>
                  <span className="text">&ldquo;Map our payment processing pipeline with Stripe, webhooks, and the order database&rdquo;</span>
                </div>
                <div className="ai-result-nodes">
                  <div className="ai-mini-node"><span className="dot" style={{ background: "var(--n-api)" }} />Stripe API</div>
                  <div className="ai-mini-node"><span className="dot" style={{ background: "var(--n-db)" }} />Webhooks</div>
                  <div className="ai-mini-node"><span className="dot" style={{ background: "var(--n-system)" }} />Order Service</div>
                  <div className="ai-mini-node"><span className="dot" style={{ background: "var(--n-vendor)" }} />Orders DB</div>
                  <div className="ai-mini-node"><span className="dot" style={{ background: "var(--n-cache)" }} />Redis Queue</div>
                  <div className="ai-mini-node"><span className="dot" style={{ background: "var(--n-process)" }} />Notification</div>
                </div>
              </div>
            </div>

            {/* 2: Real-Time Collaboration -- 5col */}
            <div className="bc b2 reveal">
              <div className="ci">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              </div>
              <h3>Real-Time Collaboration</h3>
              <p>Multiple people editing the same map. Workspace roles keep everyone aligned: Owner, Admin, Editor, Viewer. Inline comments on any node.</p>
            </div>

            {/* 3: Sharing -- 5col */}
            <div className="bc b3 reveal">
              <div className="ci">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
              </div>
              <h3>Public Sharing</h3>
              <p>Share read-only maps with a single link. Perfect for stakeholder reviews, incident post-mortems, and audit documentation.</p>
              <div className="share-link">
                <span className="url">swaymaps.com/share/a8f2e9...</span>
                <button className="copy-btn">COPY</button>
              </div>
            </div>

            {/* 4: Version History -- 4col */}
            <div className="bc b4 reveal">
              <div className="ci">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h3>Version History</h3>
              <p>Every save creates a snapshot. Compare changes with the built-in diff viewer. Restore any version with one click.</p>
              <div className="version-demo">
                <div className="ve">
                  <span className="ind" style={{ background: "var(--healthy)" }} />
                  <span className="lb">Added payment gateway</span>
                  <span className="tm">2m ago</span>
                </div>
                <div className="ve">
                  <span className="ind" style={{ background: "var(--accent)" }} />
                  <span className="lb">+3 nodes, +4 edges</span>
                  <span className="tm">1h ago</span>
                </div>
                <div className="ve">
                  <span className="ind" style={{ background: "var(--t3)" }} />
                  <span className="lb">Initial architecture draft</span>
                  <span className="tm">3h ago</span>
                </div>
              </div>
            </div>

            {/* 5: Diagram as Code -- 4col */}
            <div className="bc b5 reveal">
              <div className="ci">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
              </div>
              <h3>Diagram as Code</h3>
              <p>Define maps in YAML. Version-control them in Git. Diff in pull requests. Apply to the visual canvas.</p>
            </div>

            {/* 6: Export -- 4col */}
            <div className="bc b6 reveal">
              <div className="ci">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              </div>
              <h3>Export Anywhere</h3>
              <p>Export as PNG, SVG, PDF, or JSON. Embed in Notion, Confluence, or any internal wiki via iframe.</p>
              <div className="format-badges">
                <span>PNG</span>
                <span>SVG</span>
                <span>PDF</span>
                <span>JSON</span>
              </div>
            </div>

            {/* 7: Templates -- 4col */}
            <div className="bc b7 reveal">
              <div className="ci">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </div>
              <h3>25+ Templates</h3>
              <p>Microservices, org charts, CI/CD pipelines, compliance maps, vendor dependencies — one-click start.</p>
            </div>

            {/* 8: Command Palette -- 4col */}
            <div className="bc b8 reveal">
              <div className="ci">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12a3 3 0 003-3 3 3 0 00-3-3z"/></svg>
              </div>
              <h3>Command Palette</h3>
              <p>Press <span className="kbd">⌘K</span> to search nodes, run actions, toggle themes, and navigate — power-user speed.</p>
            </div>

            {/* 9: Health Dashboard -- 4col */}
            <div className="bc b9 reveal">
              <div className="ci">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h3>Health Dashboard</h3>
              <p>0-100 health score for every map. Detect orphan nodes, circular dependencies, and missing metadata at a glance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ USE CASES ═══ */}
      <section className="usecases" id="usecases">
        <div className="container">
          <div className="uc-header reveal">
            <div className="eyebrow">Use Cases</div>
            <div className="stitle">Built for teams that can&apos;t afford to guess</div>
            <div className="sdesc">
              From engineering leads to compliance officers, SwayMaps gives every team a shared source of truth.
            </div>
          </div>

          <div className="uc-tabs reveal">
            {useCasesData.map((uc) => (
              <button
                key={uc.id}
                className={`uc-tab${activeTab === uc.id ? " active" : ""}`}
                onClick={() => setActiveTab(uc.id)}
              >
                {uc.label}
              </button>
            ))}
          </div>

          {useCasesData.map((uc) => (
            <div key={uc.id} className={`uc-panel${activeTab === uc.id ? " active" : ""}`}>
              <div className="uc-content">
                <div className="uc-info">
                  <h3>{uc.title}</h3>
                  <p>{uc.desc}</p>
                  <ul className="uc-checklist">
                    {uc.checks.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div className="uc-visual">
                  <div className="uc-vn">
                    {uc.nodes.map((n, i) => (
                      <div className="ucn" key={i}>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 4,
                            background: n.color,
                            flexShrink: 0,
                          }}
                        />
                        {n.label}
                        <span className="badge" style={{ background: n.color }}>{n.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ DIAGRAM AS CODE (YAML) ═══ */}
      <section id="yaml">
        <div className="container">
          <div className="code-section">
            <div className="reveal">
              <div className="eyebrow">Diagram as Code</div>
              <div className="stitle">Define maps in YAML.<br />Version them in Git.</div>
              <div className="sdesc">
                Infrastructure-as-code teams love this. Define your dependency map declaratively,
                check it into version control, and render it instantly.
              </div>
              <div style={{ marginTop: 28 }}>
                <Link href="/auth/signup" className="btn btn-primary">
                  Try It Free
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </div>
            </div>

            <div className="code-block reveal">
              <div className="code-header">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M4 5l2.5 2L4 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                architecture.yaml
              </div>
              <div className="code-body">
                <span className="c"># SwayMaps dependency definition</span>{"\n"}
                <span className="k">name</span>: <span className="v">&quot;Payment Pipeline&quot;</span>{"\n"}
                <span className="k">nodes</span>:{"\n"}
                {"  "}<span className="k">- id</span>: <span className="v">stripe-api</span>{"\n"}
                {"    "}<span className="k">type</span>: <span className="v">api</span>{"\n"}
                {"    "}<span className="k">label</span>: <span className="s">&quot;Stripe API&quot;</span>{"\n"}
                {"  "}<span className="k">- id</span>: <span className="v">webhook-handler</span>{"\n"}
                {"    "}<span className="k">type</span>: <span className="v">process</span>{"\n"}
                {"    "}<span className="k">label</span>: <span className="s">&quot;Webhook Handler&quot;</span>{"\n"}
                {"  "}<span className="k">- id</span>: <span className="v">orders-db</span>{"\n"}
                {"    "}<span className="k">type</span>: <span className="v">database</span>{"\n"}
                {"    "}<span className="k">label</span>: <span className="s">&quot;Orders DB&quot;</span>{"\n"}
                <span className="k">edges</span>:{"\n"}
                {"  "}<span className="k">- from</span>: <span className="v">stripe-api</span>{"\n"}
                {"    "}<span className="k">to</span>: <span className="v">webhook-handler</span>{"\n"}
                {"    "}<span className="k">label</span>: <span className="s">&quot;payment.success&quot;</span>{"\n"}
                {"  "}<span className="k">- from</span>: <span className="v">webhook-handler</span>{"\n"}
                {"    "}<span className="k">to</span>: <span className="v">orders-db</span>{"\n"}
                {"    "}<span className="k">label</span>: <span className="s">&quot;update status&quot;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing">
        <div className="container">
          <div className="pricing-header reveal">
            <div className="eyebrow">Pricing</div>
            <div className="stitle">Simple, transparent pricing</div>
            <div className="sdesc">
              Start free. Upgrade when you need more maps, more collaborators, or more power.
            </div>
            <div className="pricing-toggle">
              <button
                className={!annual ? "active" : ""}
                onClick={() => setAnnual(false)}
              >
                Monthly
              </button>
              <button
                className={annual ? "active" : ""}
                onClick={() => setAnnual(true)}
              >
                Annual
              </button>
              {annual && <span className="save-badge">Save 30%+</span>}
            </div>
          </div>

          <div className="pricing-grid reveal">
            {/* Free */}
            <div className="pc-card">
              <div className="ptier">Free</div>
              <div className="pamt">$0<span className="per"> /mo</span></div>
              <div className="pann">Free forever</div>
              <ul className="pf">
                <li><span className="ck y">✓</span>3 maps</li>
                <li><span className="ck y">✓</span>All 11 node types</li>
                <li><span className="ck y">✓</span>PNG &amp; JSON export</li>
                <li><span className="ck y">✓</span>Public sharing</li>
                <li><span className="ck y">✓</span>Community templates</li>
                <li><span className="ck n">—</span>AI generation</li>
                <li><span className="ck n">—</span>Version history</li>
                <li><span className="ck n">—</span>Team workspaces</li>
              </ul>
              <Link href="/auth/signup" className="pbtn secondary">Get Started Free</Link>
            </div>

            {/* Pro */}
            <div className="pc-card pop">
              <div className="ptier">Pro</div>
              <div className="pamt">
                ${annual ? "19" : "29"}<span className="per"> /mo</span>
              </div>
              <div className="pann">
                {annual ? "Billed $228/year" : "Billed monthly"} -- 14-day free trial
              </div>
              <ul className="pf">
                <li><span className="ck y">✓</span>Unlimited maps</li>
                <li><span className="ck y">✓</span>All 11 node types</li>
                <li><span className="ck y">✓</span>All export formats (PNG, SVG, PDF, JSON)</li>
                <li><span className="ck y">✓</span>AI generation</li>
                <li><span className="ck y">✓</span>Version history</li>
                <li><span className="ck y">✓</span>Public sharing</li>
                <li><span className="ck y">✓</span>Priority support</li>
                <li><span className="ck n">—</span>Team workspaces</li>
              </ul>
              <Link href="/auth/signup" className="pbtn primary">Start 14-Day Free Trial</Link>
            </div>

            {/* Team */}
            <div className="pc-card">
              <div className="ptier">Team</div>
              <div className="pamt">
                ${annual ? "59" : "79"}<span className="per"> /mo</span>
              </div>
              <div className="pann">
                {annual ? "Billed $708/year" : "Billed monthly"} -- 14-day free trial
              </div>
              <ul className="pf">
                <li><span className="ck y">✓</span>Everything in Pro</li>
                <li><span className="ck y">✓</span>Team workspaces</li>
                <li><span className="ck y">✓</span>Role-based access (owner, admin, editor, viewer)</li>
                <li><span className="ck y">✓</span>Workspace invites</li>
                <li><span className="ck y">✓</span>Audit log</li>
                <li><span className="ck y">✓</span>Version diff viewer</li>
                <li><span className="ck y">✓</span>Priority support</li>
                <li><span className="ck y">✓</span>SSO (coming soon)</li>
              </ul>
              <Link href="/auth/signup" className="pbtn secondary">Start 14-Day Free Trial</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section className="compare-section" id="compare">
        <div className="container">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="eyebrow">Why SwayMaps</div>
            <div className="stitle">Not another generic<br/>diagramming tool.</div>
            <div className="sdesc" style={{ margin: "16px auto 0" }}>
              Purpose-built for structured dependency intelligence — not sticky notes on a whiteboard.
            </div>
          </div>

          {/* Competitor cards */}
          <div className="reveal" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"16px",marginTop:"48px"}}>
            {competitors.map((c, i) => (
              <div key={i} style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"14px",padding:"28px 24px",transition:"all .25s",position:"relative",overflow:"hidden"}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"}}>
                  <span style={{fontSize:".7rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".06em",padding:"3px 10px",borderRadius:"6px",background:"rgba(239,68,68,0.1)",color:"var(--critical)"}}>{c.name}</span>
                </div>
                <div style={{fontSize:".82rem",color:"var(--t3)",lineHeight:"1.6",marginBottom:"16px",paddingLeft:"12px",borderLeft:"2px solid rgba(239,68,68,0.3)"}}>
                  {c.weakness}
                </div>
                <div style={{display:"flex",alignItems:"flex-start",gap:"8px"}}>
                  <span style={{flexShrink:0,width:"20px",height:"20px",borderRadius:"6px",background:"rgba(0,194,255,0.1)",color:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".7rem",fontWeight:700,marginTop:"1px"}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </span>
                  <span style={{fontSize:".84rem",color:"var(--accent)",lineHeight:"1.6",fontWeight:500}}>{c.advantage}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Feature checklist table */}
          <div className="ct reveal" style={{marginTop:"32px"}}>
            <div className="ctr cth">
              <div>Feature</div>
              <div>Others</div>
              <div>SwayMaps</div>
            </div>
            {comparisonFeatures.map((row, i) => (
              <div className="ctr" key={i}>
                <div>{row.feature}</div>
                <div>{row.others === false ? <span style={{color:"var(--critical)"}}>✕</span> : <span>{String(row.others)}</span>}</div>
                <div>{row.sway === true ? <span style={{color:"var(--healthy)"}}>✓</span> : <span>{String(row.sway)}</span>}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="final-cta">
        <div className="container reveal">
          <h2>
            Stop guessing.<br />
            <span className="grad">Start mapping.</span>
          </h2>
          <p>
            Join engineering teams who replaced tribal knowledge with a
            living, visual map of their entire system.
          </p>
          <div className="fca">
            <Link href="/auth/signup" className="btn btn-primary btn-lg">
              Start Free -- No Credit Card
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <a href="#pricing" onClick={(e) => scrollTo(e, "pricing")} className="btn btn-outline btn-lg">
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="landing-footer">
        <div className="container-w">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link href="/" className="logo" style={{ marginBottom: 14, display: "inline-flex" }}>
                <LogoMark />
                <span className="logo-text">SwayMaps</span>
              </Link>
              <p>
                The visual dependency intelligence platform. Map systems, trace impact, ship with confidence.
              </p>
            </div>

            <div className="footer-col">
              <h4>Product</h4>
              <Link href="/features">Features</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/use-cases">Use Cases</Link>
              <Link href="/templates-gallery">Templates</Link>
            </div>

            <div className="footer-col">
              <h4>Resources</h4>
              <Link href="/docs">Documentation</Link>
              <Link href="/changelog">Changelog</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/docs">API Reference</Link>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <Link href="/about">About</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/contact">Contact</Link>
              <a href="mailto:support@swaymaps.com">Support</a>
            </div>

            <div className="footer-col">
              <h4>Legal</h4>
              <Link href="/legal/terms">Terms of Service</Link>
              <Link href="/legal/privacy">Privacy Policy</Link>
              <Link href="/legal/privacy">Cookie Policy</Link>
              <Link href="/legal/privacy">GDPR</Link>
            </div>
          </div>

          <div className="footer-bottom">
            <span>2026 SwayMaps. All rights reserved.</span>
            <div className="footer-bottom-links">
              <Link href="/legal/terms">Terms</Link>
              <Link href="/legal/privacy">Privacy</Link>
              <a href="mailto:support@swaymaps.com">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
