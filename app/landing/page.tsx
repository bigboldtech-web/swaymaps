"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/* ─── DATA ─── */

const features = [
  {
    title: "AI-Powered Generation",
    description: "Describe what you want to map. AI builds the first draft in seconds.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Real-time Collaboration",
    description: "Multiple people editing the same map. See cursors, edits, and comments live.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Templates Library",
    description: "Start from proven templates: microservices, org charts, data flows, CI/CD pipelines.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    title: "Export Anywhere",
    description: "Export as PNG, SVG, PDF, or JSON. Embed in Notion, Confluence, or your wiki.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Public Sharing",
    description: "Share read-only maps with a single link. Perfect for stakeholder reviews and incidents.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
  {
    title: "Version History",
    description: "Every change is saved. Roll back to any snapshot with one click.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Command Palette",
    description: "Press Cmd+K to search nodes, run actions, and navigate instantly. Power-user speed.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: "11 Node Types",
    description: "Person, System, Process, Database, API, Queue, Cache, Cloud, Team, Vendor, and Generic.",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <circle cx="5" cy="12" r="2.5" />
        <circle cx="19" cy="6" r="2.5" />
        <circle cx="19" cy="18" r="2.5" />
        <path d="M7.5 11l9-4.5M7.5 13l9 4.5" />
      </svg>
    ),
  },
];

const useCasesData = [
  {
    id: "engineering",
    label: "Engineering",
    title: "System & Microservice Mapping",
    description: "Map every service, database, and API in your stack. See the blast radius of any change before you deploy.",
    bullets: [
      "Visualize service-to-service dependencies in real time",
      "Simulate blast radius before shipping changes",
      "Keep architecture docs always up to date",
    ],
  },
  {
    id: "platform",
    label: "Platform",
    title: "Infrastructure Dependencies",
    description: "Visualize cloud resources, queues, caches, and every piece of infrastructure your platform runs on.",
    bullets: [
      "Map cloud resources, queues, and caches",
      "Trace infrastructure dependencies end to end",
      "Reduce incident surface with clear ownership lines",
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    title: "Data Flow & Audit Maps",
    description: "Track where PII flows through your systems. Be audit-ready with visual, shareable data maps.",
    bullets: [
      "Map PII and sensitive data flows across services",
      "Generate audit-ready visual reports",
      "Stay compliant with SOC 2, GDPR, and HIPAA",
    ],
  },
  {
    id: "leadership",
    label: "Leadership",
    title: "Org Knowledge & Onboarding",
    description: "Map tribal knowledge so it never walks out the door. Cut onboarding time from months to weeks.",
    bullets: [
      "Capture tribal knowledge before it disappears",
      "Reduce new engineer ramp-up by 60%+",
      "Give leadership clear visibility into system complexity",
    ],
  },
];

const faqData = [
  { question: "Can I cancel anytime?", answer: "Yes, cancel anytime from your billing dashboard. Your access continues until the end of your billing period." },
  { question: "What happens to my maps if I downgrade?", answer: "Your maps are preserved. You just can't create new ones beyond the free limit. Upgrade again anytime to regain full access." },
  { question: "Do you offer a free trial?", answer: "Yes! 14 days free on Pro and Team plans. No credit card required to start." },
  { question: "Is my data secure?", answer: "Yes. All data is encrypted in transit and at rest. We use industry-standard security practices and PostgreSQL for reliable storage." },
  { question: "Can I import from other tools?", answer: "We support JSON import/export. Lucidchart and Draw.io import coming soon." },
];

/* ─── LOGO ─── */
function SwayMapLogo({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-indigo-600 shadow-lg shadow-sky-500/25"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.58}
        height={size * 0.58}
        viewBox="0 0 24 24"
        fill="none"
      >
        {/* Connection lines — drawn first so nodes sit on top */}
        <path d="M12 6.5V10.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 13.5L6.5 18" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 13.5L17.5 18" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 13.5L19 10" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Hub node — center */}
        <circle cx="12" cy="12" r="2.2" fill="white" />

        {/* Top node */}
        <circle cx="12" cy="5" r="1.7" fill="white" opacity="0.9" />

        {/* Bottom-left */}
        <circle cx="6" cy="19" r="1.5" fill="white" opacity="0.7" />

        {/* Bottom-right */}
        <circle cx="18" cy="19" r="1.5" fill="white" opacity="0.7" />

        {/* Side node */}
        <circle cx="19.5" cy="9.5" r="1.2" fill="white" opacity="0.55" />
      </svg>
    </div>
  );
}

/* ─── PAGE GRID BACKGROUND ─── */
function PageGridBg() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(51,65,85,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(51,65,85,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Accent lines every 4th */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(51,65,85,0.14) 1px, transparent 1px),
            linear-gradient(90deg, rgba(51,65,85,0.14) 1px, transparent 1px)
          `,
          backgroundSize: '240px 240px',
        }}
      />
      {/* Dot intersections */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(51,65,85,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Radial fade — grid is strongest at center, fades at edges */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 30%, transparent 0%, #030712 100%)' }} />
    </div>
  );
}

/* ─── ANIMATED GRAPH OVERLAY ─── */
function GraphBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="line-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="line-v" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="node-pulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Flowing horizontal beams */}
        <line x1="0" y1="180" x2="100%" y2="180" stroke="url(#line-h)" strokeWidth="1" opacity="0.08">
          <animateTransform attributeName="transform" type="translate" values="-500,0;500,0;-500,0" dur="14s" repeatCount="indefinite" />
        </line>
        <line x1="0" y1="400" x2="100%" y2="400" stroke="url(#line-h)" strokeWidth="1" opacity="0.06">
          <animateTransform attributeName="transform" type="translate" values="400,0;-400,0;400,0" dur="18s" repeatCount="indefinite" />
        </line>

        {/* Flowing vertical beams */}
        <line x1="300" y1="0" x2="300" y2="100%" stroke="url(#line-v)" strokeWidth="1" opacity="0.06">
          <animateTransform attributeName="transform" type="translate" values="0,-400;0,400;0,-400" dur="16s" repeatCount="indefinite" />
        </line>
        <line x1="800" y1="0" x2="800" y2="100%" stroke="url(#line-v)" strokeWidth="1" opacity="0.05">
          <animateTransform attributeName="transform" type="translate" values="0,300;0,-300;0,300" dur="20s" repeatCount="indefinite" />
        </line>

        {/* Animated dash connections */}
        <line x1="50" y1="80" x2="500" y2="350" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.06" strokeDasharray="6 12">
          <animate attributeName="stroke-dashoffset" values="0;-72" dur="4s" repeatCount="indefinite" />
        </line>
        <line x1="700" y1="50" x2="1100" y2="400" stroke="#6366f1" strokeWidth="0.5" opacity="0.05" strokeDasharray="6 12">
          <animate attributeName="stroke-dashoffset" values="0;-72" dur="5s" repeatCount="indefinite" />
        </line>
        <line x1="400" y1="500" x2="900" y2="150" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.04" strokeDasharray="6 12">
          <animate attributeName="stroke-dashoffset" values="0;72" dur="4.5s" repeatCount="indefinite" />
        </line>

        {/* Glowing intersection nodes */}
        {[
          { cx: 300, cy: 180, r: 12, dur: "3s" },
          { cx: 800, cy: 180, r: 10, dur: "4s" },
          { cx: 300, cy: 400, r: 8, dur: "5s" },
          { cx: 800, cy: 400, r: 10, dur: "3.5s" },
        ].map((dot, i) => (
          <g key={i}>
            <circle cx={dot.cx} cy={dot.cy} r={dot.r} fill="url(#node-pulse)" opacity="0">
              <animate attributeName="opacity" values="0;0.15;0" dur={dot.dur} repeatCount="indefinite" />
            </circle>
            <circle cx={dot.cx} cy={dot.cy} r="1.5" fill="#0ea5e9" opacity="0.15">
              <animate attributeName="opacity" values="0.1;0.3;0.1" dur={dot.dur} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─── HERO MOCK MAP ─── */
function HeroMapPreview() {
  const nw = 130; // node width
  const nh = 44;  // node height

  const nodes = [
    // Row 0 — entry
    { id: "client",  x: 360, y: 18,  label: "Web Client",      color: "#94a3b8", kind: "Frontend" },
    // Row 1 — gateway
    { id: "gateway", x: 360, y: 100, label: "API Gateway",      color: "#0ea5e9", kind: "System" },
    // Row 2 — services
    { id: "auth",    x: 60,  y: 190, label: "Auth Service",     color: "#8b5cf6", kind: "Service" },
    { id: "users",   x: 240, y: 190, label: "User Service",     color: "#0ea5e9", kind: "Service" },
    { id: "orders",  x: 480, y: 190, label: "Order Service",    color: "#10b981", kind: "Service" },
    { id: "notify",  x: 660, y: 190, label: "Notifications",    color: "#f97316", kind: "Service" },
    // Row 3 — data
    { id: "pg",      x: 120, y: 290, label: "PostgreSQL",       color: "#f59e0b", kind: "Database" },
    { id: "redis",   x: 360, y: 290, label: "Redis",            color: "#ef4444", kind: "Cache" },
    { id: "kafka",   x: 570, y: 290, label: "Kafka",            color: "#6366f1", kind: "Queue" },
  ];

  const edges: { from: string; to: string; color?: string }[] = [
    { from: "client",  to: "gateway" },
    { from: "gateway", to: "auth" },
    { from: "gateway", to: "users" },
    { from: "gateway", to: "orders" },
    { from: "gateway", to: "notify" },
    { from: "auth",    to: "pg" },
    { from: "users",   to: "pg" },
    { from: "users",   to: "redis" },
    { from: "orders",  to: "redis" },
    { from: "orders",  to: "kafka" },
    { from: "notify",  to: "kafka" },
  ];

  const cx = (id: string) => {
    const n = nodes.find((n) => n.id === id)!;
    return { x: n.x + nw / 2, y: n.y + nh / 2 };
  };
  const bot = (id: string) => {
    const n = nodes.find((n) => n.id === id)!;
    return { x: n.x + nw / 2, y: n.y + nh };
  };
  const top_ = (id: string) => {
    const n = nodes.find((n) => n.id === id)!;
    return { x: n.x + nw / 2, y: n.y };
  };

  return (
    <div className="relative h-full w-full">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 850 360" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="preview-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.5" fill="rgba(51,65,85,0.25)" />
          </pattern>
          <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <filter id="glow-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
          </filter>
          <filter id="glow-lg" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="url(#preview-grid)" />

        {/* Edges — smooth cubic bezier curves */}
        {edges.map((e, i) => {
          const s = bot(e.from);
          const t = top_(e.to);
          const dy = (t.y - s.y) * 0.5;
          const d = `M${s.x},${s.y} C${s.x},${s.y + dy} ${t.x},${t.y - dy} ${t.x},${t.y}`;
          const srcNode = nodes.find((n) => n.id === e.from)!;
          const edgeColor = e.color || srcNode.color;
          return (
            <g key={i}>
              {/* Glow layer */}
              <path d={d} fill="none" stroke={edgeColor} strokeWidth="4" opacity="0.06" filter="url(#glow-sm)" />
              {/* Base */}
              <path d={d} fill="none" stroke={edgeColor} strokeWidth="1.5" opacity="0.2" />
              {/* Animated dash */}
              <path d={d} fill="none" stroke={edgeColor} strokeWidth="1" opacity="0.6" strokeDasharray="5 8">
                <animate attributeName="stroke-dashoffset" values="0;-52" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
              </path>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const cx_ = node.x + nw / 2;
          const cy_ = node.y + nh / 2;
          return (
            <g key={node.id}>
              {/* Outer glow */}
              <rect
                x={node.x} y={node.y} width={nw} height={nh} rx="10"
                fill="none" stroke={node.color} strokeWidth="1.5" opacity="0.1" filter="url(#glow-lg)"
              />
              {/* Card bg */}
              <rect
                x={node.x} y={node.y} width={nw} height={nh} rx="10"
                fill="#080f1e" stroke={node.color} strokeWidth="1" opacity="0.95"
              />
              {/* Subtle inner fill tint */}
              <rect
                x={node.x} y={node.y} width={nw} height={nh} rx="10"
                fill={node.color} opacity="0.04"
              />
              {/* Label */}
              <text
                x={cx_} y={node.y + 18}
                textAnchor="middle" fill="white" fontSize="10" fontWeight="600"
                fontFamily="Inter, system-ui, sans-serif"
              >
                {node.label}
              </text>
              {/* Kind badge */}
              <text
                x={cx_} y={node.y + 32}
                textAnchor="middle" fill={node.color} fontSize="7.5" fontWeight="500"
                fontFamily="Inter, system-ui, sans-serif" opacity="0.6"
              >
                {node.kind}
              </text>
              {/* Top handle */}
              <circle cx={cx_} cy={node.y} r="2.5" fill="#080f1e" stroke={node.color} strokeWidth="1" opacity="0.7" />
              {/* Bottom handle */}
              <circle cx={cx_} cy={node.y + nh} r="2.5" fill="#080f1e" stroke={node.color} strokeWidth="1" opacity="0.7" />
            </g>
          );
        })}

        {/* Floating "minimap" accent — bottom-right */}
        <g opacity="0.35">
          <rect x="750" y="280" width="70" height="55" rx="6" fill="#080f1e" stroke="rgba(51,65,85,0.4)" strokeWidth="0.5" />
          {nodes.map((n) => (
            <rect
              key={n.id}
              x={750 + (n.x / 850) * 64 + 3}
              y={280 + (n.y / 360) * 49 + 3}
              width={8} height={4} rx="1"
              fill={n.color} opacity="0.6"
            />
          ))}
        </g>

        {/* Floating toolbar accent — top-left */}
        <g opacity="0.3">
          <rect x="20" y="15" width="90" height="26" rx="6" fill="#080f1e" stroke="rgba(51,65,85,0.4)" strokeWidth="0.5" />
          {[24, 42, 60, 78].map((tx) => (
            <rect key={tx} x={tx} y={22} width="12" height="12" rx="3" fill="rgba(51,65,85,0.3)" />
          ))}
        </g>
      </svg>
    </div>
  );
}

/* ─── COMPONENT ─── */

export default function LandingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("engineering");
  const [annualBilling, setAnnualBilling] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const activeUseCase = useCasesData.find((u) => u.id === activeTab)!;

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-50 scroll-smooth antialiased">
      <PageGridBg />

      {/* ───── NAV ───── */}
      <nav className="relative sticky top-0 z-50 border-b border-slate-800/40 bg-[#030712]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white">
            <SwayMapLogo size={34} />
            SwayMaps
          </Link>

          <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#use-cases" className="transition hover:text-white">Use Cases</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
            <a href="#faq" className="transition hover:text-white">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition hover:text-white">
              Sign In
            </Link>
            <Link href="/auth/signup" className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/40">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden">
        <GraphBackground />

        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-sky-500/[0.06] blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-[400px] w-[500px] rounded-full bg-indigo-500/[0.06] blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-6 pb-28 pt-32 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/30 px-4 py-1.5 text-xs font-medium text-slate-400 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Now with AI Generation & Command Palette
          </div>

          <h1 className="bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-5xl font-extrabold leading-[1.1] tracking-tight text-transparent sm:text-6xl lg:text-7xl">
            See What Depends
            <br />
            on What.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
            The visual dependency mapping platform for engineering teams.
            Map systems, trace impact, ship with confidence.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="group rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:shadow-sky-500/40 hover:-translate-y-[1px]"
            >
              Start Free &mdash; No Credit Card
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-slate-700/50 bg-slate-800/20 px-8 py-3.5 text-base font-semibold text-slate-200 backdrop-blur transition hover:border-slate-600 hover:bg-slate-800/40"
            >
              See Features
            </a>
          </div>

          <p className="mt-8 text-sm text-slate-600">
            Trusted by engineering teams at startups and Fortune 500s
          </p>

          {/* Dashboard preview — mock dependency map */}
          <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-b from-slate-900/60 to-slate-950/90 shadow-2xl shadow-sky-500/[0.03]">
            <div className="flex items-center gap-2 border-b border-slate-800/60 bg-[#0b1422]/90 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#fdbc40]" />
                <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="ml-3 flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-slate-800/60" />
                <span className="text-[10px] font-medium text-slate-500">Microservices Architecture — SwayMaps</span>
              </div>
            </div>
            <div className="h-[300px] bg-[#050b15] sm:h-[400px]">
              {mounted && <HeroMapPreview />}
            </div>
          </div>
        </div>
      </section>

      {/* ───── PROBLEM ───── */}
      <section className="relative py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-slate-700/40 bg-slate-800/20 px-3 py-1 text-xs font-medium text-slate-500">
              The Problem
            </div>
            <h2 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
              Your systems are connected. Your knowledge isn&rsquo;t.
            </h2>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Blind Deployments", body: "Teams ship changes without knowing what breaks downstream.", icon: <path strokeLinecap="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /> },
              { title: "Slow Incidents", body: "Hours wasted tracing dependencies during outages.", icon: <path strokeLinecap="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /> },
              { title: "Painful Onboarding", body: "New engineers take 3-6 months to understand the system.", icon: <path strokeLinecap="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /> },
              { title: "Compliance Gaps", body: "Auditors ask \"what touches PII?\" and nobody can answer.", icon: <path strokeLinecap="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
            ].map((card) => (
              <div key={card.title} className="group rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 transition hover:border-slate-700/60 hover:bg-slate-900/50">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/30 bg-slate-800/40 text-slate-400 transition group-hover:border-rose-500/30 group-hover:text-rose-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>{card.icon}</svg>
                </div>
                <h3 className="text-base font-bold text-slate-100">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FEATURES BENTO GRID ───── */}
      <section id="features" className="relative py-28">
        <GraphBackground />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-slate-700/40 bg-slate-800/20 px-3 py-1 text-xs font-medium text-slate-500">
              Features
            </div>
            <h2 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
              Everything you need to map your world
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-500">
              A complete toolkit for visualizing, sharing, and managing complex system dependencies.
            </p>
          </div>

          <div className="mt-14 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

            {/* AI-Powered Generation — large card with visual */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 transition hover:border-sky-500/20 hover:bg-slate-900/50 lg:col-span-2 lg:row-span-2">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-500/[0.04] blur-[60px] transition-all group-hover:bg-sky-500/[0.08]" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-100">AI-Powered Generation</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                Describe what you want to map in plain English. AI builds the first draft in seconds — nodes, edges, and layout included.
              </p>
              {/* Mini visual: AI prompt → graph */}
              <div className="mt-6 rounded-xl border border-slate-800/40 bg-[#050b15] p-4">
                <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-3">
                  <svg className="h-3.5 w-3.5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI Prompt
                </div>
                <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 px-3 py-2 text-xs text-slate-400 font-mono">
                  &quot;Map our payment processing pipeline with Stripe, webhooks, and the order database&quot;
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
                  <svg className="h-3.5 w-3.5 text-sky-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
                </div>
                <svg className="mt-3 w-full" viewBox="0 0 380 80" fill="none">
                  {/* Mini generated graph */}
                  <rect x="0" y="20" width="80" height="30" rx="6" fill="rgba(14,165,233,0.1)" stroke="rgba(14,165,233,0.3)" strokeWidth="1" />
                  <text x="40" y="39" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="Inter, sans-serif">Stripe API</text>
                  <rect x="150" y="0" width="80" height="30" rx="6" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.3)" strokeWidth="1" />
                  <text x="190" y="19" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="Inter, sans-serif">Webhooks</text>
                  <rect x="150" y="45" width="80" height="30" rx="6" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
                  <text x="190" y="64" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="Inter, sans-serif">Orders DB</text>
                  <rect x="300" y="20" width="80" height="30" rx="6" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
                  <text x="340" y="39" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="Inter, sans-serif">Dashboard</text>
                  <line x1="80" y1="35" x2="150" y2="15" stroke="rgba(14,165,233,0.3)" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="80" y1="35" x2="150" y2="60" stroke="rgba(14,165,233,0.3)" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="230" y1="15" x2="300" y2="35" stroke="rgba(139,92,246,0.3)" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="230" y1="60" x2="300" y2="35" stroke="rgba(16,185,129,0.3)" strokeWidth="1" strokeDasharray="3 3" />
                </svg>
              </div>
            </div>

            {/* Real-time Collaboration */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 transition hover:border-violet-500/20 hover:bg-slate-900/50">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-500/[0.04] blur-[40px] transition-all group-hover:bg-violet-500/[0.08]" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-100">Real-time Collaboration</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Multiple people editing the same map. See cursors, edits, and comments live.</p>
              {/* Mini avatars */}
              <div className="mt-4 flex items-center -space-x-2">
                {["bg-sky-500", "bg-violet-500", "bg-emerald-500"].map((bg, i) => (
                  <div key={i} className={`flex h-7 w-7 items-center justify-center rounded-full ${bg} border-2 border-[#0b1422] text-[10px] font-bold text-white`}>
                    {["A", "R", "M"][i]}
                  </div>
                ))}
                <div className="ml-3 text-[11px] text-slate-500">3 editing now</div>
              </div>
            </div>

            {/* Templates Library */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 transition hover:border-amber-500/20 hover:bg-slate-900/50">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/[0.04] blur-[40px] transition-all group-hover:bg-amber-500/[0.08]" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-100">Templates Library</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Start from proven templates: microservices, org charts, data flows, CI/CD pipelines.</p>
              {/* Mini template tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Microservices", "Org Chart", "CI/CD", "Data Flow"].map((t) => (
                  <span key={t} className="rounded-md border border-slate-700/30 bg-slate-800/40 px-2 py-0.5 text-[10px] font-medium text-slate-500">{t}</span>
                ))}
              </div>
            </div>

            {/* Export Anywhere */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 transition hover:border-emerald-500/20 hover:bg-slate-900/50">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-500/[0.04] blur-[40px] transition-all group-hover:bg-emerald-500/[0.08]" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-100">Export Anywhere</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Export as PNG, SVG, PDF, or JSON. Embed in Notion, Confluence, or your wiki.</p>
              {/* Mini format badges */}
              <div className="mt-4 flex gap-2">
                {["PNG", "SVG", "PDF", "JSON"].map((f) => (
                  <span key={f} className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/30 bg-slate-800/40 text-[9px] font-bold text-emerald-400/70">{f}</span>
                ))}
              </div>
            </div>

            {/* Public Sharing — wide */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 transition hover:border-sky-500/20 hover:bg-slate-900/50 lg:col-span-2">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-500/[0.04] blur-[50px] transition-all group-hover:bg-sky-500/[0.08]" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/20 bg-sky-500/10 text-sky-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-100">Public Sharing</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Share read-only maps with a single link. Perfect for stakeholder reviews, incident post-mortems, and architecture walkthroughs.</p>
              {/* Mini share link UI */}
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-700/30 bg-slate-800/30 px-3 py-2">
                <svg className="h-3.5 w-3.5 shrink-0 text-sky-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="flex-1 truncate text-[11px] font-mono text-slate-500">swaymaps.com/share/a8f2e...</span>
                <span className="rounded bg-sky-500/10 px-1.5 py-0.5 text-[9px] font-bold text-sky-400">COPY</span>
              </div>
            </div>

            {/* Version History */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 transition hover:border-indigo-500/20 hover:bg-slate-900/50">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-500/[0.04] blur-[40px] transition-all group-hover:bg-indigo-500/[0.08]" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-100">Version History</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Every change is saved. Roll back to any snapshot with one click.</p>
              {/* Mini timeline */}
              <div className="mt-4 space-y-2">
                {[
                  { label: "Latest", time: "2m ago", active: true },
                  { label: "v3", time: "1h ago", active: false },
                  { label: "v2", time: "3h ago", active: false },
                ].map((v, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${v.active ? "bg-indigo-400" : "bg-slate-700"}`} />
                    <span className={`text-[11px] font-medium ${v.active ? "text-slate-300" : "text-slate-600"}`}>{v.label}</span>
                    <span className="text-[10px] text-slate-700">{v.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Command Palette */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 transition hover:border-slate-600/60 hover:bg-slate-900/50">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/30 bg-slate-800/40 text-slate-400 transition group-hover:border-sky-500/30 group-hover:text-sky-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-100">Command Palette</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Press Cmd+K to search nodes, run actions, and navigate instantly.</p>
              {/* Mini kbd */}
              <div className="mt-4 flex items-center gap-1.5">
                <kbd className="flex h-6 items-center rounded border border-slate-700/40 bg-slate-800/50 px-1.5 text-[10px] font-medium text-slate-400">&#8984;</kbd>
                <kbd className="flex h-6 items-center rounded border border-slate-700/40 bg-slate-800/50 px-1.5 text-[10px] font-medium text-slate-400">K</kbd>
                <span className="ml-1.5 text-[11px] text-slate-600">to open</span>
              </div>
            </div>

            {/* 11 Node Types */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 transition hover:border-slate-600/60 hover:bg-slate-900/50">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/30 bg-slate-800/40 text-slate-400 transition group-hover:border-sky-500/30 group-hover:text-sky-400">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <circle cx="5" cy="12" r="2.5" />
                  <circle cx="19" cy="6" r="2.5" />
                  <circle cx="19" cy="18" r="2.5" />
                  <path d="M7.5 11l9-4.5M7.5 13l9 4.5" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-100">11 Node Types</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Person, System, Process, Database, API, Queue, Cache, and more.</p>
              {/* Mini colored dots */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {[
                  { color: "bg-sky-500", label: "System" },
                  { color: "bg-violet-500", label: "Person" },
                  { color: "bg-emerald-500", label: "Process" },
                  { color: "bg-amber-500", label: "Database" },
                  { color: "bg-rose-500", label: "API" },
                ].map((n) => (
                  <span key={n.label} className="flex items-center gap-1 rounded-md border border-slate-700/30 bg-slate-800/40 px-2 py-0.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${n.color}`} />
                    <span className="text-[10px] text-slate-500">{n.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── USE CASES ───── */}
      <section id="use-cases" className="relative py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-slate-700/40 bg-slate-800/20 px-3 py-1 text-xs font-medium text-slate-500">
              Use Cases
            </div>
            <h2 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
              Built for teams that can&rsquo;t afford to guess
            </h2>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {useCasesData.map((uc) => (
              <button
                key={uc.id}
                onClick={() => setActiveTab(uc.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeTab === uc.id
                    ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20"
                    : "border border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                {uc.label}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800/60 bg-slate-900/30 p-8 backdrop-blur sm:p-10">
            <h3 className="text-2xl font-bold text-white">{activeUseCase.title}</h3>
            <p className="mt-3 max-w-2xl text-slate-400">{activeUseCase.description}</p>
            <ul className="mt-6 space-y-3">
              {activeUseCase.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───── PRICING ───── */}
      <section id="pricing" className="relative py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-slate-700/40 bg-slate-800/20 px-3 py-1 text-xs font-medium text-slate-500">
              Pricing
            </div>
            <h2 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
              Simple pricing. Start free.
            </h2>
          </div>

          {/* Toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition ${!annualBilling ? "text-white" : "text-slate-500"}`}>Monthly</span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className={`relative inline-flex h-7 w-[52px] shrink-0 items-center rounded-full transition-colors duration-200 ${
                annualBilling ? "bg-gradient-to-r from-sky-500 to-indigo-500" : "bg-slate-700"
              }`}
              role="switch"
              aria-checked={annualBilling}
              aria-label="Toggle annual billing"
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  annualBilling ? "translate-x-[28px]" : "translate-x-[4px]"
                }`}
              />
            </button>
            <span className={`text-sm font-medium transition ${annualBilling ? "text-white" : "text-slate-500"}`}>Annual</span>
            <span
              className={`rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-400 transition-opacity duration-200 ${
                annualBilling ? "opacity-100" : "opacity-0"
              }`}
            >
              Save 35%
            </span>
          </div>

          {/* Cards */}
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {/* Free */}
            <div className="flex flex-col rounded-2xl border border-slate-800/60 bg-slate-900/30 p-8 transition hover:border-slate-700/60">
              <h3 className="text-xl font-bold text-white">Free</h3>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="ml-1 text-slate-500">/mo</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">For personal projects</p>
              <ul className="mt-8 flex-1 space-y-3 text-sm text-slate-400">
                {["3 maps", "1 workspace", "Basic node types", "5 AI brainstorms / mo", "Community support"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="mt-8 block rounded-xl border border-slate-700/50 py-3 text-center text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800/40">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="flex flex-col rounded-2xl border border-slate-800/60 bg-slate-900/30 p-8 transition hover:border-slate-700/60">
              <h3 className="text-xl font-bold text-white">Pro</h3>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-white">${annualBilling ? "19" : "29"}</span>
                <span className="ml-1 text-slate-500">/mo</span>
              </div>
              {annualBilling && <p className="mt-1 text-xs text-slate-500">billed annually</p>}
              <p className="mt-2 text-sm text-slate-500">For professional teams</p>
              <ul className="mt-8 flex-1 space-y-3 text-sm text-slate-400">
                {["Unlimited maps", "5 workspaces", "All node types", "Unlimited AI", "Export PDF / PNG / SVG", "All templates", "Public sharing", "Email support"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="mt-8 block rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/40 hover:-translate-y-[1px]">
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Team */}
            <div className="relative flex flex-col rounded-2xl border-2 border-sky-500/30 bg-slate-900/30 p-8 shadow-lg shadow-sky-500/5">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-1 text-xs font-bold text-white shadow-lg shadow-sky-500/20">
                Most Popular
              </span>
              <h3 className="text-xl font-bold text-white">Team</h3>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-white">${annualBilling ? "59" : "79"}</span>
                <span className="ml-1 text-slate-500">/mo</span>
              </div>
              {annualBilling && <p className="mt-1 text-xs text-slate-500">billed annually</p>}
              <p className="mt-2 text-sm text-slate-500">For scaling organizations</p>
              <ul className="mt-8 flex-1 space-y-3 text-sm text-slate-400">
                {["Everything in Pro", "Unlimited workspaces", "Unlimited members", "Version history", "Priority support", "API access (coming)"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="mt-8 block rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:shadow-sky-500/40 hover:-translate-y-[1px]">
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-slate-600">
            All plans include a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq" className="py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center rounded-full border border-slate-700/40 bg-slate-800/20 px-3 py-1 text-xs font-medium text-slate-500">
              FAQ
            </div>
            <h2 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-12 space-y-3">
            {faqData.map((faq, idx) => (
              <div key={idx} className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/30 transition hover:border-slate-700/60">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-slate-100">{faq.question}</span>
                  <svg
                    className={`h-5 w-5 shrink-0 text-sky-400 transition-transform ${expandedFaq === idx ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === idx && (
                  <div className="border-t border-slate-800/60 px-6 py-5">
                    <p className="text-sm leading-relaxed text-slate-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ───── */}
      <section className="relative overflow-hidden py-28">
        <GraphBackground />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/[0.06] blur-[160px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Ready to map your dependencies?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
            Start free. No credit card required. Upgrade when you&rsquo;re ready.
          </p>
          <div className="mt-10">
            <Link
              href="/auth/signup"
              className="inline-block rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-sky-500/25 transition hover:shadow-sky-500/40 hover:-translate-y-[1px]"
            >
              Start Mapping for Free
            </Link>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="relative z-[1] border-t border-slate-800/40 bg-[#030712]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5">
                <SwayMapLogo size={28} />
                <span className="text-lg font-bold text-white">SwayMaps</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Visual dependency mapping for engineering teams.
              </p>
            </div>

            {[
              { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }, { label: "Templates", href: "#" }, { label: "Changelog", href: "#" }] },
              { title: "Company", links: [{ label: "About", href: "#" }, { label: "Blog", href: "#" }, { label: "Careers", href: "#" }] },
              { title: "Legal", links: [{ label: "Privacy", href: "/legal/privacy" }, { label: "Terms", href: "/legal/terms" }, { label: "Security", href: "mailto:security@swaymaps.com" }] },
              { title: "Support", links: [{ label: "Docs", href: "#" }, { label: "Contact", href: "mailto:hello@swaymaps.com" }, { label: "Status", href: "#" }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{col.title}</h4>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("/") ? (
                        <Link href={link.href} className="text-slate-600 transition hover:text-slate-300">{link.label}</Link>
                      ) : (
                        <a href={link.href} className="text-slate-600 transition hover:text-slate-300">{link.label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-slate-800/40 pt-8 text-center text-sm text-slate-700">
            &copy; 2026 SwayMaps. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
