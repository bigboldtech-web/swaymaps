"use client";

import Link from "next/link";
import { useEffect } from "react";
import { SwayMapsIcon } from "../../components/SwayMapsLogo";
import "../landing/landing.css";

/* ─── FEATURE DATA ─── */

const nodeTypes = [
  { label: "Person", color: "#ec4899", abbr: "P" },
  { label: "System", color: "#3b82f6", abbr: "SY" },
  { label: "API", color: "#06b6d4", abbr: "AP" },
  { label: "Database", color: "#8b5cf6", abbr: "DB" },
  { label: "Queue", color: "#2563eb", abbr: "Q" },
  { label: "Cache", color: "#ef4444", abbr: "CA" },
  { label: "Process", color: "#22c55e", abbr: "PR" },
  { label: "Generic", color: "#14b8a6", abbr: "GN" },
  { label: "Cloud", color: "#6366f1", abbr: "CL" },
  { label: "Vendor", color: "#f59e0b", abbr: "VN" },
  { label: "Team", color: "#f97316", abbr: "TM" },
];

const templateCards = [
  { name: "Microservices Architecture", category: "Engineering", color: "#3b82f6" },
  { name: "Data Pipeline", category: "Data", color: "#8b5cf6" },
  { name: "CI/CD Pipeline", category: "DevOps", color: "#22c55e" },
  { name: "Org Chart", category: "Organization", color: "#f97316" },
  { name: "Cloud Infrastructure", category: "Platform", color: "#6366f1" },
  { name: "Incident Response", category: "SRE", color: "#ef4444" },
];

const yamlCode = [
  { type: "c", text: "# SwayMaps Diagram-as-Code" },
  { type: "k", text: "name" },
  { type: "v", text: ': "Payment System"' },
  { type: "k", text: "nodes" },
  { type: "plain", text: ":" },
  { type: "k", text: "  - id" },
  { type: "v", text: ': "api-gateway"' },
  { type: "k", text: "    type" },
  { type: "v", text: ": system" },
  { type: "k", text: "    label" },
  { type: "v", text: ': "API Gateway"' },
  { type: "k", text: "  - id" },
  { type: "v", text: ': "payment-svc"' },
  { type: "k", text: "    type" },
  { type: "v", text: ": process" },
  { type: "k", text: "    label" },
  { type: "v", text: ': "Payment Service"' },
  { type: "k", text: "  - id" },
  { type: "v", text: ': "stripe"' },
  { type: "k", text: "    type" },
  { type: "v", text: ": vendor" },
  { type: "k", text: "edges" },
  { type: "plain", text: ":" },
  { type: "k", text: "  - from" },
  { type: "v", text: ": api-gateway" },
  { type: "k", text: "    to" },
  { type: "v", text: ": payment-svc" },
];

const roles = [
  { role: "Owner", desc: "Full control, billing, danger zone", color: "#ef4444" },
  { role: "Admin", desc: "Manage members, edit all maps", color: "#f59e0b" },
  { role: "Editor", desc: "Create and edit maps", color: "#3b82f6" },
  { role: "Viewer", desc: "Read-only access to shared maps", color: "#22c55e" },
];

const versionEntries = [
  { label: "Added Stripe webhook handler", time: "2 min ago", color: "#22c55e", tag: "+3 nodes" },
  { label: "Refactored auth flow", time: "1 hour ago", color: "#3b82f6", tag: "+1 -2 edges" },
  { label: "Initial architecture draft", time: "3 hours ago", color: "#8b5cf6", tag: "12 nodes" },
  { label: "Map created from template", time: "Yesterday", color: "#06b6d4", tag: "Template" },
];

const importSources = [
  { name: "Draw.io", abbr: "DI" },
  { name: "Lucidchart", abbr: "LC" },
  { name: "Miro", abbr: "MI" },
  { name: "JSON", abbr: "{}" },
];

const exportFormats = [
  { name: "PNG", color: "#22c55e" },
  { name: "SVG", color: "#3b82f6" },
  { name: "PDF", color: "#ef4444" },
  { name: "JSON", color: "#f59e0b" },
];

const shortcuts = [
  { keys: ["Cmd", "K"], action: "Open command palette" },
  { keys: ["Cmd", "S"], action: "Save map" },
  { keys: ["Cmd", "Z"], action: "Undo last action" },
  { keys: ["Cmd", "D"], action: "Duplicate selection" },
  { keys: ["Cmd", "E"], action: "Export map" },
  { keys: ["Del"], action: "Delete selected" },
];

/* ─── FEATURES PAGE ─── */

export default function FeaturesPage() {
  /* Scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="landing-root" style={{ background: "#070b14", minHeight: "100vh" }}>
      {/* ─── Background ─── */}
      <div className="map-bg">
        <div className="grid-layer" />
        <div className="scan" />
        <div className="orb a" />
        <div className="orb b" />
        <div className="orb c" />
      </div>

      {/* ─── NAV ─── */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <SwayMapsIcon size={34} />
          </Link>

          <div className="nav-links">
            <Link href="/features">Features</Link>
            <Link href="/landing#use-cases">Use Cases</Link>
            <Link href="/landing#pricing">Pricing</Link>
            <Link href="/landing#faq">FAQ</Link>
          </div>

          <div className="nav-actions">
            <Link href="/auth/signin" className="btn btn-ghost">Sign In</Link>
            <Link href="/auth/signup" className="btn btn-primary">Start Free</Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero" style={{ paddingTop: 160, paddingBottom: 80 }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="eyebrow" style={{ justifyContent: "center", marginBottom: 20 }}>Features</div>
          <h1 style={{
            fontSize: "clamp(2.8rem, 5.5vw, 4.4rem)",
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.08,
            marginBottom: 20,
          }}>
            Everything you need to{" "}
            <span className="grad">map your world</span>.
          </h1>
          <p className="hero-sub" style={{ maxWidth: 620, margin: "0 auto" }}>
            From AI-powered generation to diagram-as-code, SwayMaps gives your team
            the tools to visualize, understand, and manage every dependency.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURE SECTIONS — alternating layout
          ═══════════════════════════════════════════ */}

      {/* ─── 1. Visual Canvas ─── */}
      <FeatureSection
        index={1}
        eyebrow="Visual Canvas"
        title="11 node types. Infinite clarity."
        description="Every dependency has a type. Person, System, Database, API, Queue, Cache, Process, Cloud, Vendor, Team, and Generic. Drag them onto an infinite canvas, connect them, and see your architecture come alive."
        bullets={[
          "Color-coded node badges for instant visual identification",
          "Drag-and-drop placement with snap-to-grid alignment",
          "Live status indicators (healthy, warning, critical) on every node",
          "Smooth animated edges with customizable routing",
        ]}
        align="left"
        visual={<NodeTypesVisual />}
      />

      {/* ─── 2. AI Generation ─── */}
      <FeatureSection
        index={2}
        eyebrow="AI Generation"
        title="Describe it. We build it."
        description="Type a plain-English description of your system and let AI generate the first draft of your dependency map. Refine from there -- not from scratch."
        bullets={[
          "Natural language to dependency map in seconds",
          "AI brainstorm mode for exploring architecture ideas",
          "Smart node type detection from your description",
          "Edit, extend, and refine AI-generated maps freely",
        ]}
        align="right"
        visual={<AIGenerationVisual />}
      />

      {/* ─── 3. Templates Library ─── */}
      <FeatureSection
        index={3}
        eyebrow="Templates Library"
        title="Start from proven blueprints."
        description="Choose from 25+ professionally designed templates covering microservices, data pipelines, org charts, CI/CD workflows, and more. Customize everything."
        bullets={[
          "25+ templates across engineering, platform, and ops categories",
          "One-click instantiation with full customization",
          "Community-contributed templates coming soon",
          "Save your own maps as reusable templates",
        ]}
        align="left"
        visual={<TemplatesVisual />}
      />

      {/* ─── 4. Diagram as Code ─── */}
      <FeatureSection
        index={4}
        eyebrow="Diagram as Code"
        title="Define maps in YAML. Version in Git."
        description="Write your dependency maps as structured YAML. Check them into version control, review in PRs, and generate visuals automatically."
        bullets={[
          "Clean YAML DSL for defining nodes, edges, and metadata",
          "Bi-directional sync between code and visual canvas",
          "Git-friendly format for code review workflows",
          "Import existing YAML definitions instantly",
        ]}
        align="right"
        visual={<YAMLVisual />}
      />

      {/* ─── 5. Collaboration ─── */}
      <FeatureSection
        index={5}
        eyebrow="Collaboration"
        title="Your whole team, one workspace."
        description="Create workspaces, invite teammates, assign roles, and collaborate on maps together. Share read-only links with stakeholders in one click."
        bullets={[
          "Workspace-based organization with granular role permissions",
          "Owner, Admin, Editor, and Viewer roles",
          "Public sharing via unique read-only links",
          "Workspace invites with email notifications",
        ]}
        align="left"
        visual={<CollaborationVisual />}
      />

      {/* ─── 6. Version History ─── */}
      <FeatureSection
        index={6}
        eyebrow="Version History"
        title="Every change. Always recoverable."
        description="SwayMaps automatically snapshots your map on every save. Browse the timeline, compare versions side-by-side with the diff viewer, and restore any previous state."
        bullets={[
          "Automatic snapshots on every save",
          "Visual diff viewer to compare any two versions",
          "One-click restore to any previous snapshot",
          "Full change history with timestamps and authors",
        ]}
        align="right"
        visual={<VersionHistoryVisual />}
      />

      {/* ─── 7. Health Dashboard ─── */}
      <FeatureSection
        index={7}
        eyebrow="Health Dashboard"
        title="Know the health of your system at a glance."
        description="Get a computed health score for your entire dependency map. SwayMaps detects orphaned nodes, circular dependencies, single points of failure, and more."
        bullets={[
          "Aggregate health score from 0 to 100",
          "Automatic detection of orphaned and disconnected nodes",
          "Circular dependency warnings",
          "Single point of failure identification",
        ]}
        align="left"
        visual={<HealthDashboardVisual />}
      />

      {/* ─── 8. Import & Export ─── */}
      <FeatureSection
        index={8}
        eyebrow="Import & Export"
        title="Bring your maps in. Take them anywhere."
        description="Import from Draw.io, Lucidchart, Miro, or raw JSON. Export to PNG, SVG, PDF, or JSON for embedding in wikis, docs, and presentations."
        bullets={[
          "Import from popular diagramming tools",
          "Export to PNG, SVG, PDF, and JSON formats",
          "Embed exported maps in Notion, Confluence, or any wiki",
          "Bulk export for backup and migration",
        ]}
        align="right"
        visual={<ImportExportVisual />}
      />

      {/* ─── 9. Integrations ─── */}
      <FeatureSection
        index={9}
        eyebrow="Integrations"
        title="Stay connected to your workflow."
        description="Get notified in Slack or Microsoft Teams when maps change. Set up webhooks to trigger automations. Keep your team in the loop without context-switching."
        bullets={[
          "Slack and Microsoft Teams notifications",
          "Webhook support for custom integrations",
          "Change alerts when critical dependencies are modified",
          "API access for programmatic map management",
        ]}
        align="left"
        visual={<IntegrationsVisual />}
      />

      {/* ─── 10. Power User Features ─── */}
      <FeatureSection
        index={10}
        eyebrow="Power User Features"
        title="Built for speed. Designed for pros."
        description="Open the command palette with Cmd+K to search nodes, run actions, and navigate your maps instantly. Every action has a keyboard shortcut."
        bullets={[
          "Command palette for instant search and actions",
          "Full keyboard shortcut coverage",
          "Bulk operations on selected nodes and edges",
          "Customizable canvas settings and preferences",
        ]}
        align="right"
        visual={<PowerUserVisual />}
      />

      {/* ─── FINAL CTA ─── */}
      <section className="final-cta reveal">
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ lineHeight: 1.1 }}>
            Ready to map your{" "}
            <span className="grad">dependencies</span>?
          </h2>
          <p className="sdesc" style={{ margin: "20px auto 40px", maxWidth: 500 }}>
            Join engineering teams who use SwayMaps to visualize, understand, and
            manage every dependency in their stack.
          </p>
          <div className="fca">
            <Link href="/auth/signup" className="btn btn-primary btn-lg">
              Start Free
            </Link>
            <Link href="/landing#pricing" className="btn btn-outline btn-lg">
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ borderTop: "1px solid #1a2340", padding: "64px 0 40px" }}>
        <div className="container-w">
          <div className="footer-grid">
            <div className="footer-brand">
              <SwayMapsIcon size={28} />
              <p style={{ marginTop: 12 }}>
                Visual dependency mapping for engineering teams.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: [
                  { label: "Features", href: "/features" },
                  { label: "Pricing", href: "/landing#pricing" },
                  { label: "Templates", href: "#" },
                  { label: "Changelog", href: "#" },
                ],
              },
              {
                title: "Company",
                links: [
                  { label: "About", href: "#" },
                  { label: "Blog", href: "#" },
                  { label: "Careers", href: "#" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { label: "Privacy", href: "/legal/privacy" },
                  { label: "Terms", href: "/legal/terms" },
                  { label: "Security", href: "mailto:security@swaymaps.com" },
                ],
              },
              {
                title: "Support",
                links: [
                  { label: "Docs", href: "#" },
                  { label: "Contact", href: "mailto:hello@swaymaps.com" },
                  { label: "Status", href: "#" },
                ],
              },
            ].map((col) => (
              <div className="footer-col" key={col.title}>
                <h4>{col.title}</h4>
                {col.links.map((link) => (
                  link.href.startsWith("/") ? (
                    <Link key={link.label} href={link.href}>{link.label}</Link>
                  ) : (
                    <a key={link.label} href={link.href}>{link.label}</a>
                  )
                ))}
              </div>
            ))}
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

/* ═══════════════════════════════════════════
   FEATURE SECTION COMPONENT
   ═══════════════════════════════════════════ */

interface FeatureSectionProps {
  index: number;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  align: "left" | "right";
  visual: React.ReactNode;
}

function FeatureSection({ index, eyebrow, title, description, bullets, align, visual }: FeatureSectionProps) {
  const isTextLeft = align === "left";

  return (
    <section style={{ padding: "100px 0" }} className="reveal">
      <div className="container-w">
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}>
          {/* Text side */}
          <div style={{ order: isTextLeft ? 1 : 2 }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              {String(index).padStart(2, "0")} / {eyebrow}
            </div>
            <h2 style={{
              fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
              marginBottom: 16,
              color: "#e4e9f4",
            }}>
              {title}
            </h2>
            <p style={{
              fontSize: "1rem",
              color: "#8091b3",
              lineHeight: 1.7,
              marginBottom: 28,
              maxWidth: 480,
            }}>
              {description}
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {bullets.map((b, i) => (
                <li key={i} style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "7px 0",
                  fontSize: "0.88rem",
                  color: "#8091b3",
                }}>
                  <span style={{
                    flexShrink: 0,
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,194,255,0.08)",
                    color: "#00c2ff",
                    borderRadius: 5,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    marginTop: 2,
                  }}>
                    &#x2713;
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual side */}
          <div style={{ order: isTextLeft ? 2 : 1 }}>
            {visual}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   VISUAL COMPONENTS
   ═══════════════════════════════════════════ */

/* ─── Shared card wrapper ─── */
function VisualCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: "#0f1629",
      border: "1px solid #1a2340",
      borderRadius: 14,
      padding: 28,
      boxShadow: "0 20px 60px -10px rgba(0,0,0,0.4)",
    }}>
      {children}
    </div>
  );
}

/* ─── 1. Node Types Grid ─── */
function NodeTypesVisual() {
  return (
    <VisualCard>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10,
      }}>
        {nodeTypes.map((n) => (
          <div key={n.label} style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            background: "#0b1120",
            border: "1px solid #1a2340",
            borderRadius: 8,
            transition: "border-color 0.25s",
          }}>
            <span style={{
              padding: "3px 8px",
              borderRadius: 4,
              fontSize: "0.62rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "white",
              background: n.color,
              flexShrink: 0,
            }}>
              {n.abbr}
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#e4e9f4" }}>
              {n.label}
            </span>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#22c55e",
              marginLeft: "auto",
              flexShrink: 0,
            }} />
          </div>
        ))}
      </div>
      {/* Status legend */}
      <div style={{
        display: "flex",
        gap: 20,
        marginTop: 16,
        paddingTop: 14,
        borderTop: "1px solid #1a2340",
      }}>
        {[
          { label: "Healthy", color: "#22c55e" },
          { label: "Warning", color: "#f59e0b" },
          { label: "Critical", color: "#ef4444" },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", color: "#4a5a7a" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.color }} />
            {s.label}
          </div>
        ))}
      </div>
    </VisualCard>
  );
}

/* ─── 2. AI Generation ─── */
function AIGenerationVisual() {
  return (
    <VisualCard>
      {/* Prompt */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 14px",
        background: "#0b1120",
        border: "1px solid #253060",
        borderRadius: 8,
        marginBottom: 18,
      }}>
        <span style={{
          fontSize: "0.78rem",
          fontWeight: 800,
          color: "#a78bfa",
          flexShrink: 0,
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(167,139,250,0.12)",
          borderRadius: 6,
        }}>AI</span>
        <span style={{
          fontSize: "0.8rem",
          color: "#8091b3",
          fontStyle: "italic",
          flex: 1,
        }}>
          &quot;Map a payment system with Stripe, webhooks, and a PostgreSQL database&quot;
        </span>
      </div>
      {/* Arrow */}
      <div style={{
        textAlign: "center",
        color: "#4a5a7a",
        fontSize: "0.75rem",
        marginBottom: 14,
        fontFamily: "var(--mono)",
      }}>
        generating...
      </div>
      {/* Generated nodes */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {[
          { label: "API Gateway", color: "#3b82f6", type: "SY" },
          { label: "Payment Service", color: "#22c55e", type: "PR" },
          { label: "Stripe API", color: "#f59e0b", type: "VN" },
          { label: "Webhook Handler", color: "#06b6d4", type: "AP" },
          { label: "PostgreSQL", color: "#8b5cf6", type: "DB" },
          { label: "Event Queue", color: "#2563eb", type: "Q" },
        ].map((n) => (
          <div key={n.label} style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            background: "#0b1120",
            border: "1px solid #1a2340",
            borderRadius: 7,
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#e4e9f4",
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: 3,
              background: n.color,
              flexShrink: 0,
            }} />
            {n.label}
            <span style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              color: "#4a5a7a",
              fontFamily: "var(--mono)",
              textTransform: "uppercase",
            }}>{n.type}</span>
          </div>
        ))}
      </div>
    </VisualCard>
  );
}

/* ─── 3. Templates ─── */
function TemplatesVisual() {
  return (
    <VisualCard>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
      }}>
        {templateCards.map((t) => (
          <div key={t.name} style={{
            padding: "16px 14px",
            background: "#0b1120",
            border: "1px solid #1a2340",
            borderRadius: 10,
            transition: "border-color 0.25s",
          }}>
            {/* Fake mini-map preview */}
            <div style={{
              height: 48,
              borderRadius: 6,
              marginBottom: 10,
              background: `linear-gradient(135deg, ${t.color}10, ${t.color}05)`,
              border: `1px solid ${t.color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  width: 6,
                  height: 6,
                  borderRadius: 2,
                  background: t.color,
                  opacity: 0.4 + i * 0.2,
                }} />
              ))}
            </div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#e4e9f4", marginBottom: 4 }}>
              {t.name}
            </div>
            <span style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: "0.6rem",
              fontWeight: 700,
              textTransform: "uppercase",
              background: `${t.color}18`,
              color: t.color,
              letterSpacing: "0.04em",
            }}>
              {t.category}
            </span>
          </div>
        ))}
      </div>
    </VisualCard>
  );
}

/* ─── 4. YAML Code ─── */
function YAMLVisual() {
  return (
    <div className="code-block" style={{ boxShadow: "0 20px 60px -10px rgba(0,0,0,0.4)" }}>
      <div className="code-header">
        <span style={{
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,194,255,0.1)",
          color: "#00c2ff",
          borderRadius: 6,
          fontSize: "0.72rem",
          fontWeight: 800,
        }}>{"{}"}</span>
        <span>payment-system.yaml</span>
      </div>
      <div className="code-body" style={{ padding: 20, lineHeight: 1.9 }}>
        {yamlCode.map((line, i) => {
          if (line.type === "c") return <div key={i}><span className="c">{line.text}</span></div>;
          if (line.type === "k") {
            const parts = line.text.split(":");
            if (parts.length > 1) {
              return (
                <div key={i}>
                  <span className="k">{parts[0]}</span>
                  <span className="v">:{parts.slice(1).join(":")}</span>
                </div>
              );
            }
            return <div key={i}><span className="k">{line.text}</span></div>;
          }
          if (line.type === "v") {
            return <div key={i}><span className="v">{line.text}</span></div>;
          }
          return <div key={i}>{line.text}</div>;
        })}
      </div>
    </div>
  );
}

/* ─── 5. Collaboration ─── */
function CollaborationVisual() {
  return (
    <VisualCard>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {roles.map((r, i) => (
          <div key={r.role} style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 16px",
            background: "#0b1120",
            border: "1px solid #1a2340",
            borderRadius: 10,
          }}>
            <span style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${r.color}15`,
              color: r.color,
              borderRadius: 8,
              fontSize: "0.72rem",
              fontWeight: 800,
              flexShrink: 0,
              fontFamily: "var(--mono)",
            }}>
              {r.role[0]}{r.role[1]}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e4e9f4" }}>{r.role}</div>
              <div style={{ fontSize: "0.72rem", color: "#4a5a7a" }}>{r.desc}</div>
            </div>
            {i < roles.length - 1 && (
              <span style={{
                fontSize: "0.65rem",
                color: "#4a5a7a",
                fontFamily: "var(--mono)",
                padding: "2px 6px",
                border: "1px solid #1a2340",
                borderRadius: 4,
              }}>&#x2193;</span>
            )}
          </div>
        ))}
      </div>
      {/* Share link */}
      <div style={{
        marginTop: 16,
        display: "flex",
        alignItems: "center",
        background: "#0b1120",
        border: "1px solid #1a2340",
        borderRadius: 8,
        overflow: "hidden",
      }}>
        <span style={{
          flex: 1,
          padding: "8px 12px",
          fontFamily: "var(--mono)",
          fontSize: "0.7rem",
          color: "#4a5a7a",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          swaymaps.com/share/a1b2c3d4-e5f6-7890
        </span>
        <span style={{
          padding: "8px 14px",
          background: "#00c2ff",
          color: "#070b14",
          fontSize: "0.68rem",
          fontWeight: 700,
        }}>Copy</span>
      </div>
    </VisualCard>
  );
}

/* ─── 6. Version History ─── */
function VersionHistoryVisual() {
  return (
    <VisualCard>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {versionEntries.map((v, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 0",
            borderBottom: i < versionEntries.length - 1 ? "1px solid #1a2340" : "none",
            position: "relative",
          }}>
            {/* Timeline dot + line */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 20,
              flexShrink: 0,
            }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: v.color,
                boxShadow: `0 0 8px ${v.color}40`,
                zIndex: 1,
              }} />
              {i < versionEntries.length - 1 && (
                <span style={{
                  width: 1,
                  flex: 1,
                  background: "#1a2340",
                  position: "absolute",
                  top: 28,
                  bottom: 0,
                  left: 10,
                }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#e4e9f4" }}>
                {v.label}
              </div>
            </div>
            <span style={{
              padding: "3px 8px",
              borderRadius: 4,
              fontSize: "0.62rem",
              fontWeight: 700,
              background: `${v.color}15`,
              color: v.color,
              fontFamily: "var(--mono)",
              flexShrink: 0,
            }}>
              {v.tag}
            </span>
            <span style={{
              fontSize: "0.7rem",
              color: "#4a5a7a",
              fontFamily: "var(--mono)",
              flexShrink: 0,
              minWidth: 80,
              textAlign: "right",
            }}>
              {v.time}
            </span>
          </div>
        ))}
      </div>
      {/* Diff preview */}
      <div style={{
        marginTop: 16,
        padding: 14,
        background: "#0b1120",
        border: "1px solid #1a2340",
        borderRadius: 8,
      }}>
        <div style={{
          fontSize: "0.68rem",
          fontWeight: 700,
          color: "#4a5a7a",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 8,
          fontFamily: "var(--mono)",
        }}>Diff Viewer</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", lineHeight: 1.8 }}>
          <div style={{ color: "#22c55e" }}>+ node: Stripe Webhook Handler (API)</div>
          <div style={{ color: "#22c55e" }}>+ node: Event Processor (Process)</div>
          <div style={{ color: "#ef4444" }}>- edge: Gateway → Legacy Handler</div>
          <div style={{ color: "#22c55e" }}>+ edge: Gateway → Webhook Handler</div>
        </div>
      </div>
    </VisualCard>
  );
}

/* ─── 7. Health Dashboard ─── */
function HealthDashboardVisual() {
  return (
    <VisualCard>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 32,
      }}>
        {/* Score circle */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "conic-gradient(#22c55e 0deg, #22c55e 313deg, #1a2340 313deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <div style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "#0f1629",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontSize: "1.8rem", fontWeight: 900, color: "#22c55e", lineHeight: 1 }}>87</span>
            <span style={{ fontSize: "0.65rem", color: "#4a5a7a", fontWeight: 600, fontFamily: "var(--mono)" }}>/100</span>
          </div>
        </div>

        {/* Status breakdown */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Healthy Nodes", count: 14, total: 16, color: "#22c55e" },
            { label: "Warnings", count: 2, total: 16, color: "#f59e0b" },
            { label: "Critical", count: 0, total: 16, color: "#ef4444" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                fontWeight: 600,
                marginBottom: 4,
              }}>
                <span style={{ color: "#8091b3" }}>{s.label}</span>
                <span style={{ color: s.color, fontFamily: "var(--mono)" }}>{s.count}/{s.total}</span>
              </div>
              <div style={{
                height: 4,
                borderRadius: 2,
                background: "#1a2340",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: `${(s.count / s.total) * 100}%`,
                  background: s.color,
                  borderRadius: 2,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issues list */}
      <div style={{
        marginTop: 20,
        paddingTop: 16,
        borderTop: "1px solid #1a2340",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}>
        {[
          { icon: "!", label: "Redis has no failover path", severity: "warning", color: "#f59e0b" },
          { icon: "!", label: "Legacy Auth is an orphaned node", severity: "warning", color: "#f59e0b" },
        ].map((issue, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            background: `${issue.color}08`,
            border: `1px solid ${issue.color}20`,
            borderRadius: 8,
            fontSize: "0.78rem",
            color: "#e4e9f4",
          }}>
            <span style={{
              width: 22,
              height: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${issue.color}20`,
              color: issue.color,
              borderRadius: 5,
              fontSize: "0.7rem",
              fontWeight: 800,
              flexShrink: 0,
            }}>{issue.icon}</span>
            {issue.label}
            <span style={{
              marginLeft: "auto",
              fontSize: "0.62rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: issue.color,
              fontFamily: "var(--mono)",
            }}>{issue.severity}</span>
          </div>
        ))}
      </div>
    </VisualCard>
  );
}

/* ─── 8. Import & Export ─── */
function ImportExportVisual() {
  return (
    <VisualCard>
      {/* Import sources */}
      <div style={{
        fontSize: "0.68rem",
        fontWeight: 700,
        color: "#4a5a7a",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 10,
        fontFamily: "var(--mono)",
      }}>Import From</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {importSources.map((s) => (
          <div key={s.name} style={{
            flex: 1,
            padding: "14px 10px",
            background: "#0b1120",
            border: "1px solid #1a2340",
            borderRadius: 8,
            textAlign: "center",
          }}>
            <div style={{
              width: 32,
              height: 32,
              margin: "0 auto 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,194,255,0.08)",
              color: "#00c2ff",
              borderRadius: 7,
              fontSize: "0.7rem",
              fontWeight: 800,
              fontFamily: "var(--mono)",
            }}>{s.abbr}</div>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#8091b3" }}>{s.name}</div>
          </div>
        ))}
      </div>

      {/* Arrow */}
      <div style={{
        textAlign: "center",
        color: "#253060",
        fontSize: "1.2rem",
        marginBottom: 20,
      }}>
        &#x2195;
      </div>

      {/* Export formats */}
      <div style={{
        fontSize: "0.68rem",
        fontWeight: 700,
        color: "#4a5a7a",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 10,
        fontFamily: "var(--mono)",
      }}>Export To</div>
      <div style={{ display: "flex", gap: 10 }}>
        {exportFormats.map((f) => (
          <div key={f.name} style={{
            flex: 1,
            padding: "14px 10px",
            background: "#0b1120",
            border: "1px solid #1a2340",
            borderRadius: 8,
            textAlign: "center",
          }}>
            <div style={{
              width: 32,
              height: 32,
              margin: "0 auto 8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${f.color}15`,
              color: f.color,
              borderRadius: 7,
              fontSize: "0.68rem",
              fontWeight: 800,
              fontFamily: "var(--mono)",
            }}>{f.name}</div>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#8091b3" }}>{f.name}</div>
          </div>
        ))}
      </div>
    </VisualCard>
  );
}

/* ─── 9. Integrations ─── */
function IntegrationsVisual() {
  return (
    <VisualCard>
      {/* Notification mockup */}
      <div style={{
        background: "#0b1120",
        border: "1px solid #1a2340",
        borderRadius: 10,
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "10px 14px",
          background: "#161e35",
          borderBottom: "1px solid #1a2340",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>
          <span style={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(99,102,241,0.15)",
            color: "#6366f1",
            borderRadius: 5,
            fontSize: "0.62rem",
            fontWeight: 800,
          }}>SL</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#e4e9f4" }}>#platform-alerts</span>
          <span style={{ fontSize: "0.65rem", color: "#4a5a7a", marginLeft: "auto", fontFamily: "var(--mono)" }}>just now</span>
        </div>
        {/* Message */}
        <div style={{ padding: "14px" }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}>
            <span style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,194,255,0.1)",
              color: "#00c2ff",
              borderRadius: 6,
              fontSize: "0.62rem",
              fontWeight: 800,
              flexShrink: 0,
            }}>SM</span>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#e4e9f4", marginBottom: 4 }}>SwayMaps</div>
              <div style={{ fontSize: "0.75rem", color: "#8091b3", lineHeight: 1.6 }}>
                <strong style={{ color: "#e4e9f4" }}>Payment System</strong> map was updated by Sarah.
                <br />3 nodes added, 2 edges modified.
              </div>
              <div style={{
                marginTop: 10,
                padding: "8px 12px",
                background: "#0f1629",
                border: "1px solid #1a2340",
                borderRadius: 6,
                fontSize: "0.72rem",
                color: "#00c2ff",
                fontWeight: 600,
              }}>
                View changes in SwayMaps &#x2192;
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration badges */}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        {[
          { name: "Slack", abbr: "SL", color: "#6366f1" },
          { name: "Teams", abbr: "MS", color: "#3b82f6" },
          { name: "Webhooks", abbr: "WH", color: "#f59e0b" },
          { name: "API", abbr: "AP", color: "#06b6d4" },
        ].map((int) => (
          <div key={int.name} style={{
            flex: 1,
            padding: "10px",
            background: "#0b1120",
            border: "1px solid #1a2340",
            borderRadius: 8,
            textAlign: "center",
          }}>
            <div style={{
              width: 28,
              height: 28,
              margin: "0 auto 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${int.color}15`,
              color: int.color,
              borderRadius: 6,
              fontSize: "0.62rem",
              fontWeight: 800,
            }}>{int.abbr}</div>
            <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "#8091b3" }}>{int.name}</div>
          </div>
        ))}
      </div>
    </VisualCard>
  );
}

/* ─── 10. Power User / Command Palette ─── */
function PowerUserVisual() {
  return (
    <VisualCard>
      {/* Command palette mockup */}
      <div style={{
        background: "#0b1120",
        border: "1px solid #253060",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 12px 48px rgba(0,0,0,0.4)",
      }}>
        {/* Search bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          borderBottom: "1px solid #1a2340",
        }}>
          <span style={{
            fontSize: "0.75rem",
            color: "#4a5a7a",
            fontFamily: "var(--mono)",
          }}>&#x2315;</span>
          <span style={{
            flex: 1,
            fontSize: "0.85rem",
            color: "#8091b3",
          }}>Search nodes, actions, settings...</span>
          <span style={{
            padding: "2px 8px",
            background: "#161e35",
            border: "1px solid #1a2340",
            borderRadius: 4,
            fontSize: "0.62rem",
            fontWeight: 700,
            color: "#4a5a7a",
            fontFamily: "var(--mono)",
          }}>ESC</span>
        </div>
        {/* Results */}
        <div style={{ padding: "8px" }}>
          {[
            { label: "Go to API Gateway", tag: "Node", color: "#3b82f6" },
            { label: "Export as PNG", tag: "Action", color: "#22c55e" },
            { label: "Toggle health overlay", tag: "Setting", color: "#f59e0b" },
          ].map((r, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 6,
              background: i === 0 ? "rgba(0,194,255,0.06)" : "transparent",
              cursor: "pointer",
            }}>
              <span style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                color: i === 0 ? "#e4e9f4" : "#8091b3",
                flex: 1,
              }}>{r.label}</span>
              <span style={{
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: "0.58rem",
                fontWeight: 700,
                textTransform: "uppercase",
                background: `${r.color}15`,
                color: r.color,
                fontFamily: "var(--mono)",
              }}>{r.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <div style={{
        marginTop: 18,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8,
      }}>
        {shortcuts.map((s) => (
          <div key={s.action} style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            background: "#0b1120",
            border: "1px solid #1a2340",
            borderRadius: 6,
          }}>
            <div style={{ display: "flex", gap: 3 }}>
              {s.keys.map((k) => (
                <span key={k} style={{
                  display: "inline-flex",
                  padding: "2px 7px",
                  background: "#161e35",
                  border: "1px solid #1a2340",
                  borderRadius: 4,
                  fontFamily: "var(--mono)",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  color: "#4a5a7a",
                }}>{k}</span>
              ))}
            </div>
            <span style={{ fontSize: "0.68rem", color: "#8091b3", fontWeight: 500 }}>{s.action}</span>
          </div>
        ))}
      </div>
    </VisualCard>
  );
}
