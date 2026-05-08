import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Lock,
  Workflow,
  Users,
  Zap,
  FileCode2,
  Eye,
  Brain,
  Layers,
  GitBranch,
  Network,
  KanbanSquare,
  Boxes,
  Clock,
  Plug,
  CheckCircle2,
  Quote,
  Star,
  PlayCircle,
  Globe,
  Database,
  Code2,
  Mail,
  MessageSquare,
  ListTree,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { FormatTabStrip } from "@/components/marketing/FormatTabStrip";

export const metadata: Metadata = {
  title: "SwayMaps — The visual dependency intelligence platform",
  description:
    "Map every service, system, and team. Trace blast radius. Generate runbooks. The graph-aware AI workspace for engineering, platform, security, and operations teams.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <MarketingNav />

      {/* ─── 1 · Hero ───────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 0%, rgba(102, 71, 240, 0.10) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 80% 20%, rgba(0, 145, 255, 0.08) 0%, transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-fg) 1px, transparent 1px), linear-gradient(to bottom, var(--color-fg) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 30%, black 30%, transparent 80%)",
          }}
        />

        <div className="mx-auto max-w-[1280px] px-6 pt-20 pb-16 sm:pt-28">
          <div className="text-center max-w-3xl mx-auto">
            <Link
              href="/changelog"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-panel px-3 py-1 text-[11px] font-eyebrow text-fg-muted hover:border-border-strong transition-colors"
            >
              <span
                className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase text-white"
                style={{ background: "var(--gradient-warm)" }}
              >
                New
              </span>
              <span>Sidekick Vision input + MCP servers · See what shipped</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tighter text-fg leading-[1.05]">
              Map every system,
              <br />
              every team, every dependency.{" "}
              <span className="relative inline-block">
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-cool)" }}
                >
                  AI knows the graph.
                </span>
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-md sm:text-lg text-fg-muted leading-relaxed">
              SwayMaps is the visual dependency intelligence platform. Build
              one graph of your services, owners, and edges — then view it as a
              dependency map, a mind map, or a flowchart. Sidekick reasons over
              the structure, not the pixels.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-1.5 rounded-lg h-11 px-6 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                style={{ background: "var(--gradient-cool)" }}
              >
                Start free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact?topic=demo"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel text-fg h-11 px-6 text-sm font-semibold hover:bg-bg-muted transition-colors"
              >
                <PlayCircle className="h-4 w-4" />
                Watch 2-min demo
              </Link>
            </div>
            <p className="mt-4 text-xs text-fg-subtle">
              Free workspace · No credit card · 14-day Pro trial · SSO &amp; SCIM on Enterprise
            </p>
          </div>

          {/* Hero showcase: format tab strip */}
          <div className="mt-14 sm:mt-16">
            <FormatTabStrip />
          </div>
        </div>
      </section>

      {/* ─── 2 · Stats strip ─────────────────────────────── */}
      <section className="border-y border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1280px] px-6 py-10">
          <p className="text-center text-[11px] font-eyebrow uppercase tracking-[0.14em] text-fg-subtle">
            Trusted by platform, security, and operations teams worldwide
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {LOGOS.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold tracking-tight text-fg-muted"
              >
                {name}
              </span>
            ))}
          </div>
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p
                  className="font-display text-3xl sm:text-4xl font-extrabold tracking-tighter bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-cool)" }}
                >
                  {s.value}
                </p>
                <p className="mt-1 text-[12px] text-fg-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3 · The "why one workspace" feature wall ───── */}
      <section>
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <div className="max-w-2xl">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-accent">
              Why one workspace
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg leading-tight">
              Stop scattering your team&apos;s thinking across five tools.
            </h2>
            <p className="mt-4 text-md text-fg-muted leading-relaxed">
              Architecture diagrams in one app. Retros in another. Roadmaps in
              a third. Notes everywhere. The thinking that connects them lives
              in nobody&apos;s head — until something breaks.
            </p>
          </div>

          <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-2xl overflow-hidden">
            {WHY.map((w, i) => (
              <div key={w.title} className="relative bg-panel p-7 group">
                <div
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg shadow-sm"
                  style={{
                    background:
                      i % 2 === 0 ? "var(--gradient-cool-soft)" : "var(--gradient-warm-soft)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <w.icon
                    className="h-4 w-4"
                    style={{
                      color:
                        i % 2 === 0
                          ? "var(--gradient-cool-stop-1)"
                          : "var(--gradient-warm-stop-1)",
                    }}
                  />
                </div>
                <h3 className="mt-5 text-lg font-display font-semibold tracking-tight text-fg">
                  {w.title}
                </h3>
                <p className="mt-2 text-sm text-fg-muted leading-relaxed">
                  {w.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4 · Format deep-dive — three featured ──────── */}
      <section className="border-t border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--gradient-warm-stop-1)" }}>
              One graph · three views
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg leading-tight">
              Same nodes. Same edges. Different lens.
            </h2>
            <p className="mt-4 text-md text-fg-muted leading-relaxed">
              Build the dependency graph once. View it as a directed map, a mind map, or a flowchart — without copy-pasting between tools.
            </p>
          </div>
          <div className="mt-14 grid lg:grid-cols-3 gap-6">
            {FEATURED_FORMATS.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group relative rounded-2xl border border-border bg-panel p-7 hover:border-border-strong hover:shadow-md transition-all"
              >
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-sm"
                  style={{
                    background: f.gradient,
                  }}
                >
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-5 text-xl font-display font-semibold tracking-tight text-fg">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-fg-muted leading-relaxed">{f.body}</p>
                <ul className="mt-4 space-y-1.5 text-[13px]">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-success shrink-0" />
                      <span className="text-fg-muted">{b}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-fg group-hover:text-accent transition-colors">
                  Explore {f.title.toLowerCase()}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg hover:text-accent"
            >
              See how the graph engine works →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 5 · Sidekick — dark section ────────────────── */}
      <section className="relative bg-[#0a0a0a] text-fg-inverted overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 80% 30%, rgba(255, 2, 240, 0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 10% 80%, rgba(0, 145, 255, 0.18) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-[1280px] px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-white/60">
                AI · Sidekick
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight leading-tight">
                The first AI that
                <span
                  className="block bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-warm)" }}
                >
                  reasons over your map.
                </span>
              </h2>
              <p className="mt-5 text-md text-white/70 leading-relaxed">
                Sidekick reads the structure of every node and edge — typed,
                owned, statused. It traces blast radius, surfaces orphans,
                generates runbooks, and proposes changes you preview and
                accept. Drop in a diagram or PDF; Sidekick turns it into
                nodes.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-white/80">
                {[
                  ["8 graph-aware tools", "find_dependencies, find_path, find_orphans, generate_runbook, and more."],
                  ["Vision input", "Drop architecture diagrams; Sidekick extracts services."],
                  ["Live tool calls", "Watch Sidekick search, trace, and propose, in real time."],
                  ["Propose-then-apply", "Every change is a previewable proposal — never a surprise edit."],
                  ["MCP connectors", "Pull live context from any MCP-compatible tool."],
                ].map(([title, body]) => (
                  <li key={title} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ background: "var(--gradient-warm-stop-1)" }}
                    />
                    <span>
                      <strong className="font-semibold text-white">{title}.</strong>{" "}
                      <span className="text-white/65">{body}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/features#ai"
                  className="inline-flex items-center gap-1.5 rounded-lg h-11 px-6 text-sm font-semibold text-white"
                  style={{ background: "var(--gradient-warm)" }}
                >
                  See Sidekick
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/roadmap"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 text-white h-11 px-6 text-sm font-medium hover:bg-white/5 transition-colors"
                >
                  See what&apos;s coming
                </Link>
              </div>
            </div>

            {/* Mock Sidekick panel */}
            <div className="relative">
              <div
                className="absolute -inset-6 rounded-3xl blur-2xl opacity-40"
                style={{ background: "var(--gradient-warm)" }}
                aria-hidden
              />
              <div className="relative rounded-2xl border border-white/10 bg-[#111113] shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-3 h-11 border-b border-white/10">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--gradient-warm-stop-1)" }} />
                  <span className="text-sm font-medium text-white">Sidekick</span>
                  <span className="ml-auto text-[10px] text-white/40 font-eyebrow uppercase">workspace · acme</span>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <div className="ml-auto max-w-[80%] rounded-md bg-white text-[#09090b] px-3 py-2">
                    What&apos;s the blast radius if Stripe goes down?
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] text-white/50">
                    <span className="font-mono">find_dependencies</span>
                    <span className="opacity-70">· from Stripe (downstream)</span>
                  </div>
                  <div className="max-w-[88%] rounded-md bg-white/[0.04] border border-white/10 px-3 py-2 text-white/85 text-sm">
                    Stripe is upstream of <span className="font-medium text-white">Order Service</span>,{" "}
                    <span className="font-medium text-white">Refund Worker</span>, and the{" "}
                    <span className="font-medium text-white">Billing Webhook handler</span>. If Stripe is down, checkout fails for ~94% of paid traffic and refunds queue for retry.
                  </div>
                  <div className="max-w-[92%] rounded-md p-3"
                       style={{
                         background: "rgba(102, 71, 240, 0.12)",
                         border: "1px solid rgba(102, 71, 240, 0.30)",
                       }}>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3" style={{ color: "var(--gradient-cool-stop-1)" }} />
                      <span className="text-[11px] font-eyebrow uppercase tracking-wide" style={{ color: "var(--gradient-cool-stop-2)" }}>
                        Proposed change
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white">Add Redis cache between API Gateway and User DB</p>
                    <div className="mt-2 flex gap-1.5">
                      <span className="text-[10px] rounded bg-white/10 px-1.5 py-0.5 text-white/70">add_node: 1</span>
                      <span className="text-[10px] rounded bg-white/10 px-1.5 py-0.5 text-white/70">add_edge: 2</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="rounded-md bg-white text-[#09090b] text-xs font-semibold px-2.5 h-7">Apply</button>
                      <button className="rounded-md text-white/60 text-xs px-2.5 h-7">Discard</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6 · Real-time collaboration ──────────────── */}
      <section>
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <div className="grid lg:grid-cols-[1.2fr,1fr] gap-14 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl border border-border bg-bg-subtle p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-eyebrow text-[10px] uppercase tracking-wider text-fg-subtle">
                    Live presence
                  </span>
                  <div className="flex -space-x-1.5">
                    {AVATARS.map((a) => (
                      <span
                        key={a.name}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-bg-subtle text-[10px] font-semibold text-white shadow"
                        style={{ background: a.color }}
                        title={a.name}
                      >
                        {a.initial}
                      </span>
                    ))}
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-fg-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    4 editing now
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "API Gateway", color: "#6647F0" },
                    { name: "Stripe", color: "#FC6D2D" },
                    { name: "Postgres", color: "#0091FF" },
                  ].map((n) => (
                    <div key={n.name} className="rounded-md border border-border bg-bg p-3">
                      <div className="h-1 w-8 rounded-full" style={{ background: n.color }} />
                      <p className="mt-2 text-[12px] font-semibold text-fg">{n.name}</p>
                      <p className="text-[10px] text-fg-subtle">service</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-md border border-border bg-bg p-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white" style={{ background: "#FC6D2D" }}>
                      MK
                    </span>
                    <span className="text-[12px] font-semibold text-fg">Maya</span>
                    <span className="text-[10px] text-fg-subtle">commented on Stripe</span>
                  </div>
                  <p className="mt-2 text-[12px] text-fg-muted">
                    Should we add idempotency keys here before the launch?
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-accent">
                Real-time collaboration
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg leading-tight">
                Multiplayer that
                <span className="block">actually merges.</span>
              </h2>
              <p className="mt-4 text-md text-fg-muted leading-relaxed">
                Built on Yjs CRDTs — every keystroke, drag, and connection
                merges deterministically across every connected client. No
                last-write-wins lossage, no &quot;please refresh.&quot;
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {[
                  ["Live cursors & avatars", "See who&apos;s where, with name and color."],
                  ["Inline comments & threads", "Tagged on any node, resolved in place."],
                  ["Version history", "Snapshot every edit, one-click restore."],
                  ["Public sharing & embeds", "Read-only links, password-gated, iframe-embed."],
                ].map(([title, body]) => (
                  <li key={title} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-success shrink-0" />
                    <span>
                      <strong className="font-semibold text-fg">{title}.</strong>{" "}
                      <span className="text-fg-muted" dangerouslySetInnerHTML={{ __html: body }} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7 · Templates strip ───────────────────────── */}
      <section className="border-y border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div className="max-w-xl">
              <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--gradient-cool-stop-2)" }}>
                Templates
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg leading-tight">
                Don&apos;t start from a blank canvas.
              </h2>
              <p className="mt-4 text-md text-fg-muted leading-relaxed">
                20+ production-ready templates — from microservice architectures
                to RACI matrices to incident response playbooks.
              </p>
            </div>
            <Link
              href="/templates-gallery"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel text-fg h-10 px-4 text-sm font-semibold hover:bg-bg-muted transition-colors"
            >
              Browse all templates
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((t) => (
              <Link
                key={t.title}
                href={`/templates-gallery?category=${encodeURIComponent(t.category)}`}
                className="group rounded-xl border border-border bg-panel p-5 hover:border-border-strong hover:shadow-md transition-all"
              >
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={{
                    color: t.color,
                    background: `${t.color}1A`,
                  }}
                >
                  {t.category}
                </span>
                <h3 className="mt-3 text-[15px] font-display font-semibold text-fg">
                  {t.title}
                </h3>
                <p className="mt-1.5 text-[12px] text-fg-muted leading-relaxed">
                  {t.body}
                </p>
                <p className="mt-3 text-[11px] font-eyebrow uppercase tracking-wide text-fg-subtle">
                  {t.nodes} nodes · {t.edges} edges
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8 · Integrations strip ───────────────────── */}
      <section>
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-accent">
              Integrations
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg leading-tight">
              Plays well with the tools you already pay for.
            </h2>
            <p className="mt-4 text-md text-fg-muted leading-relaxed">
              REST API, signed webhooks, MCP server connections — plus native integrations across the stack.
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {INTEGRATIONS.map((i) => (
              <div
                key={i.name}
                className="group relative rounded-xl border border-border bg-panel p-5 flex flex-col items-center justify-center gap-2 hover:border-border-strong hover:shadow-sm transition-all aspect-square"
              >
                <div
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ background: `${i.color}14` }}
                >
                  <i.icon className="h-5 w-5" style={{ color: i.color }} />
                </div>
                <span className="text-[12px] font-medium text-fg">{i.name}</span>
                {i.status === "soon" && (
                  <span className="text-[9px] font-eyebrow uppercase tracking-wide text-fg-subtle">
                    Coming soon
                  </span>
                )}
                {i.status === "beta" && (
                  <span className="text-[9px] font-eyebrow uppercase tracking-wide text-warning">
                    Beta
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/integrations"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg hover:text-accent"
            >
              Explore all integrations →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 9 · Testimonials ────────────────────────── */}
      <section className="border-y border-border bg-bg-subtle">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--gradient-warm-stop-1)" }}>
              Customer love
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg leading-tight">
              Engineering, security, and ops teams<br /> rate SwayMaps {`★`}{`★`}{`★`}{`★`}{`★`}.
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.author}
                className="rounded-2xl border border-border bg-panel p-7 flex flex-col"
              >
                <div className="flex items-center gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <Quote className="mt-4 h-5 w-5 text-fg-disabled" />
                <blockquote className="mt-3 text-[15px] text-fg leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 pt-5 border-t border-border">
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold text-fg">{t.author}</span>
                    <span className="block text-[12px] text-fg-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10 · Built for the enterprise ───────────── */}
      <section>
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <div className="grid lg:grid-cols-[1fr,1.3fr] gap-14 items-start">
            <div>
              <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-accent">
                Enterprise
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg leading-tight">
                Cleared for the procurement bar
                <span className="block">your security team set.</span>
              </h2>
              <p className="mt-4 text-md text-fg-muted leading-relaxed">
                SSO, SCIM, granular RBAC, audit logs, and data residency are
                core platform features — not add-ons we point to in a sales
                deck. Honesty about what we ship is on the{" "}
                <Link href="/trust" className="text-accent hover:underline">
                  trust page
                </Link>
                .
              </p>
              <Link
                href="/security"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-fg hover:text-accent"
              >
                Read the security overview
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <ul className="grid gap-px bg-border border border-border rounded-2xl overflow-hidden sm:grid-cols-2">
              {ENTERPRISE.map((b) => (
                <li key={b.title} className="bg-panel p-5">
                  <div className="flex items-center gap-2.5">
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-bg-subtle">
                      <b.icon className="h-3.5 w-3.5 text-fg-muted" />
                    </div>
                    <span className="text-sm font-semibold text-fg">{b.title}</span>
                  </div>
                  <p className="mt-2 text-sm text-fg-muted leading-relaxed">{b.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── 11 · FAQ ────────────────────────────────── */}
      <section className="border-y border-border bg-bg-subtle">
        <div className="mx-auto max-w-[860px] px-6 py-24">
          <div className="text-center mb-12">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
              Frequently asked
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg leading-tight">
              Answers, not sales pitches.
            </h2>
          </div>
          <div className="rounded-2xl border border-border bg-panel divide-y divide-border overflow-hidden">
            {FAQ.map((q) => (
              <details key={q.q} className="group p-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="text-[15px] font-display font-semibold text-fg pr-4">
                    {q.q}
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-fg-muted shrink-0 group-open:rotate-45 transition-transform">
                    <span className="text-base leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-[14px] text-fg-muted leading-relaxed">{q.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 12 · Final CTA ──────────────────────────── */}
      <section>
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <div
            className="relative rounded-3xl px-8 sm:px-14 py-16 sm:py-20 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(102, 71, 240, 0.10) 0%, rgba(0, 145, 255, 0.10) 50%, rgba(255, 2, 240, 0.08) 100%)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              aria-hidden
              className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-50"
              style={{ background: "var(--gradient-warm)" }}
            />
            <div
              aria-hidden
              className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-40"
              style={{ background: "var(--gradient-cool)" }}
            />

            <div className="relative max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-fg leading-tight">
                One workspace for every map your team draws.
              </h2>
              <p className="mt-4 text-md text-fg-muted">
                Start with a free workspace. Pick any format. Add SSO, SCIM,
                and per-folder controls when you&apos;re ready to roll out
                across the business.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-1.5 rounded-lg h-11 px-6 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
                  style={{ background: "var(--gradient-cool)" }}
                >
                  Start free
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/contact?topic=demo"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel text-fg h-11 px-6 text-sm font-semibold hover:bg-bg-muted transition-colors"
                >
                  Book a demo
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 text-fg h-11 px-3 text-sm font-semibold hover:text-accent transition-colors"
                >
                  See pricing →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

const LOGOS = [
  "Atlas Bank",
  "Northwind Health",
  "Kepler Aerospace",
  "Pinetree Logistics",
  "Vela Telecom",
  "Halcyon Insurance",
];

const STATS = [
  { value: "11", label: "Strongly-typed node kinds" },
  { value: "14", label: "Semantic edge types" },
  { value: "20+", label: "Production-ready templates" },
  { value: "<150ms", label: "Real-time edit latency p95" },
];

const WHY = [
  {
    icon: Workflow,
    title: "Strongly-typed maps",
    body:
      "Nodes have kinds. Edges have semantics. The Sidekick reads structure, not pixels — so its answers make sense.",
  },
  {
    icon: Users,
    title: "Real-time co-editing",
    body:
      "Cursor presence, comments, version history. Built on Yjs CRDTs for true multiplayer across every map type.",
  },
  {
    icon: Layers,
    title: "Three views, one graph",
    body:
      "View the same nodes and edges as a directed dependency map, a radial mind map, or a top-down flowchart.",
  },
  {
    icon: GitBranch,
    title: "Folders & nesting",
    body:
      "Unlimited-depth folders, drag-drop, per-folder ACL. Organize by domain, business unit, or project.",
  },
  {
    icon: Brain,
    title: "Sidekick AI",
    body:
      "Graph-aware AI that traces dependencies, generates runbooks, and proposes previewable changes.",
  },
  {
    icon: Eye,
    title: "Audit & compliance",
    body:
      "Every change recorded. Filter, export, integrate with your SIEM. SOC 2 Type II in progress.",
  },
];

const FEATURED_FORMATS = [
  {
    icon: Network,
    title: "Dependency map",
    href: "/features#canvas",
    body:
      "The hero view. Typed edges, blast radius, ownership, on-call routing — at the speed of thought.",
    bullets: ["11 node kinds", "14 edge semantics", "Blast-radius tracing"],
    gradient: "linear-gradient(135deg, #6647F0 0%, #0091FF 100%)",
  },
  {
    icon: Brain,
    title: "Mind map",
    href: "/features#canvas",
    body:
      "Same nodes, radial auto-layout. Useful for owner-centric or topic-centric views of the same graph.",
    bullets: ["Radial auto-layout", "Infinite branches", "Same edges as dependency view"],
    gradient: "linear-gradient(135deg, #FF02F0 0%, #FC6D2D 100%)",
  },
  {
    icon: Workflow,
    title: "Flowchart",
    href: "/features#canvas",
    body:
      "Top-down view of a path through your graph. Helpful for incident playbooks and runbooks.",
    bullets: ["Top-down auto-layout", "Decision diamonds", "Linked back to dependency view"],
    gradient: "linear-gradient(135deg, #16a34a 0%, #0091FF 100%)",
  },
];

const AVATARS = [
  { name: "Maya", initial: "MK", color: "#6647F0" },
  { name: "Dev", initial: "DR", color: "#FC6D2D" },
  { name: "Priya", initial: "PA", color: "#0091FF" },
  { name: "Sam", initial: "SH", color: "#16a34a" },
];

const TEMPLATES = [
  { title: "Microservice architecture", category: "Architecture", body: "Service mesh, API gateway, message queues, databases.", nodes: 24, edges: 38, color: "#6647F0" },
  { title: "Incident response playbook", category: "DevOps", body: "Detect → triage → mitigate → postmortem with owners.", nodes: 18, edges: 22, color: "#FC6D2D" },
  { title: "Data flow diagram", category: "Compliance", body: "GDPR/SOC2 ready. Data classes, residency, processors.", nodes: 16, edges: 24, color: "#0091FF" },
  { title: "RACI matrix", category: "Org", body: "Responsibility map across squads, products, and decisions.", nodes: 12, edges: 30, color: "#16a34a" },
];

const INTEGRATIONS = [
  { name: "Slack", icon: MessageSquare, color: "#4A154B", status: "live" as const },
  { name: "GitHub", icon: GitBranch, color: "#181717", status: "beta" as const },
  { name: "Linear", icon: ListTree, color: "#5E6AD2", status: "soon" as const },
  { name: "Jira", icon: KanbanSquare, color: "#0052CC", status: "soon" as const },
  { name: "Notion", icon: FileCode2, color: "#000000", status: "soon" as const },
  { name: "Datadog", icon: Database, color: "#632CA6", status: "soon" as const },
  { name: "PagerDuty", icon: Zap, color: "#06AC38", status: "soon" as const },
  { name: "Confluence", icon: FileCode2, color: "#172B4D", status: "soon" as const },
  { name: "MS Teams", icon: MessageSquare, color: "#5059C9", status: "soon" as const },
  { name: "MCP servers", icon: Plug, color: "#FF02F0", status: "live" as const },
  { name: "Webhooks", icon: Globe, color: "#0091FF", status: "live" as const },
  { name: "REST API", icon: Code2, color: "#52525b", status: "live" as const },
];

const TESTIMONIALS = [
  {
    quote: "We replaced four diagram tools with SwayMaps. The Sidekick is the reason we stayed — it actually understands our service graph.",
    author: "Lena Chen",
    role: "Staff Engineer · Atlas Bank",
    initials: "LC",
    color: "#6647F0",
  },
  {
    quote: "Our security team finally agreed to one source of truth for data flow diagrams. Audit log + SSO sealed the deal.",
    author: "Marcus Rivera",
    role: "Director, Platform · Northwind Health",
    initials: "MR",
    color: "#FC6D2D",
  },
  {
    quote: "Real-time editing actually works — no last-write-wins disasters. We run incident reviews live in SwayMaps now.",
    author: "Priya Anand",
    role: "Head of SRE · Vela Telecom",
    initials: "PA",
    color: "#0091FF",
  },
];

const FAQ = [
  {
    q: "How is SwayMaps different from Miro or Lucidchart?",
    a: "Miro is a freeform whiteboard — great for brainstorming, weak for structured systems. Lucidchart is a static diagramming tool. SwayMaps is structured: nodes have types, edges have semantics, and a graph-aware AI reasons over them. We also include all the freeform stuff.",
  },
  {
    q: "Is the AI really useful, or is it a gimmick?",
    a: "Sidekick has 8 graph-walk tools (find_dependencies, find_path, find_orphans, generate_runbook, etc.) and produces previewable change proposals you accept before anything is written. It works because the underlying maps are structured — pixels-only AI can't do this.",
  },
  {
    q: "Do you offer SSO and SCIM?",
    a: "Yes. SAML SSO via BoxyHQ Jackson (Okta, Azure AD, OneLogin, JumpCloud, anything SAML-compatible) and SCIM 2.0 for auto-provisioning. Both available on the Enterprise plan.",
  },
  {
    q: "Can I import from Lucidchart, Draw.io, or Miro?",
    a: "Yes. Native parsers for Draw.io XML, Lucidchart CSV, Miro JSON, and generic CSV. We preserve node types and edge labels where possible.",
  },
  {
    q: "What about a public API?",
    a: "REST API at /api/v1 (maps, nodes, edges) with workspace-scoped API keys. Signed webhooks for change events. Open to everyone on the Pro plan and above.",
  },
  {
    q: "What's your data residency story?",
    a: "US by default. EU on Enterprise. Single-tenant deployments available for regulated industries. Full encryption at rest (AES-256) and in transit (TLS 1.3).",
  },
];

const ENTERPRISE = [
  {
    icon: Lock,
    title: "SSO via SAML 2.0",
    body: "Okta, Azure AD, OneLogin, JumpCloud, and any SAML IdP.",
  },
  {
    icon: Users,
    title: "SCIM 2.0 provisioning",
    body: "Auto-provision and de-provision users and groups.",
  },
  {
    icon: ShieldCheck,
    title: "Granular RBAC",
    body: "Owner, Admin, Editor, Viewer, Guest. Per-folder ACL overrides.",
  },
  {
    icon: FileCode2,
    title: "Audit log + export",
    body: "Every action recorded. CSV / JSON export. SIEM-ready.",
  },
  {
    icon: Workflow,
    title: "API & webhooks",
    body: "Programmatic access for platform integrations and ETL.",
  },
  {
    icon: Boxes,
    title: "Data residency",
    body: "US default. EU on Enterprise. Single-tenant available.",
  },
  {
    icon: Clock,
    title: "Audit retention",
    body: "90 days standard, 7 years on Enterprise. SIEM streaming on request.",
  },
  {
    icon: Plug,
    title: "MCP servers",
    body: "Connect any MCP-compatible context source. Encrypted at rest.",
  },
];
