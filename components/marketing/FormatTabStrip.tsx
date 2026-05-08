"use client";

import * as React from "react";
import { MAP_TYPES, type MapTypeId } from "@/lib/mapTypes";
import { cn } from "@/lib/cn";

/**
 * Marketing surface only shows the 3 supported public views of the same
 * dependency graph — the rest are platform-internal and not advertised.
 */
const MARKETING_VIEWS: MapTypeId[] = ["DEPENDENCY", "MINDMAP", "FLOWCHART"];
const VISIBLE_TYPES = MAP_TYPES.filter((t) => MARKETING_VIEWS.includes(t.id));

export function FormatTabStrip() {
  const [activeId, setActiveId] = React.useState<MapTypeId>(VISIBLE_TYPES[0].id);
  const active = VISIBLE_TYPES.find((t) => t.id === activeId) ?? VISIBLE_TYPES[0];
  const ActiveIcon = active.icon;

  return (
    <div className="rounded-2xl border border-border bg-panel shadow-overlay overflow-hidden">
      {/* Tab strip */}
      <div className="flex items-center gap-1 px-2 sm:px-3 py-2 border-b border-border bg-bg-subtle overflow-x-auto scrollbar-hide">
        {VISIBLE_TYPES.map((t) => {
          const Icon = t.icon;
          const isActive = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(t.id)}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-fg text-fg-inverted shadow-sm"
                  : "text-fg-muted hover:text-fg hover:bg-bg-muted"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {t.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Preview body */}
      <div className="grid lg:grid-cols-[1fr,minmax(280px,360px)]">
        <div className="relative bg-bg-subtle min-h-[420px] sm:min-h-[480px] overflow-hidden border-b lg:border-b-0 lg:border-r border-border">
          {/* Subtle dot grid */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              color: "var(--color-fg)",
            }}
          />
          <FormatPreview kind={active.id} />
        </div>

        {/* Side caption */}
        <div className="p-6 sm:p-8 flex flex-col justify-between gap-6 bg-panel">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-subtle px-2.5 py-1 text-[11px] font-eyebrow text-fg-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {active.shortLabel} · Live now
            </div>
            <h3 className="mt-4 text-2xl font-display font-bold tracking-tight text-fg">
              {active.label}
            </h3>
            <p className="mt-3 text-sm text-fg-muted leading-relaxed">
              {active.description}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-eyebrow uppercase tracking-wide text-fg-subtle">
              Built for
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {active.examples.map((ex) => (
                <li
                  key={ex}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-subtle px-2 py-1 text-xs text-fg-muted"
                >
                  <ActiveIcon className="h-3 w-3 text-fg-subtle" />
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Per-format preview renderers — small, real-feeling vignettes
   ────────────────────────────────────────────────────────── */

function FormatPreview({ kind }: { kind: string }) {
  switch (kind) {
    case "DEPENDENCY":
      return <DependencyPreview />;
    case "WHITEBOARD":
      return <WhiteboardPreview />;
    case "MINDMAP":
      return <MindmapPreview />;
    case "FLOWCHART":
      return <FlowchartPreview />;
    case "KANBAN":
      return <KanbanPreview />;
    case "ORGCHART":
      return <OrgChartPreview />;
    case "PRODUCTFLOW":
      return <ProductFlowPreview />;
    default:
      return null;
  }
}

function NodePill({
  x,
  y,
  label,
  kind,
  accent,
}: {
  x: number;
  y: number;
  label: string;
  kind?: string;
  accent?: string;
}) {
  return (
    <div
      className="absolute rounded-md border border-border bg-panel px-3 py-2 shadow-sm"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      <div className="flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: accent ?? "var(--color-fg-subtle)" }}
        />
        <span className="text-xs font-medium text-fg whitespace-nowrap">{label}</span>
      </div>
      {kind && (
        <span className="mt-0.5 block text-[9px] uppercase tracking-wide text-fg-subtle">
          {kind}
        </span>
      )}
    </div>
  );
}

function Edge({
  x1, y1, x2, y2, dashed,
}: {
  x1: number; y1: number; x2: number; y2: number; dashed?: boolean;
}) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      <line
        x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
        stroke="var(--color-fg-muted)"
        strokeWidth="1.5"
        strokeDasharray={dashed ? "4 4" : undefined}
        opacity="0.6"
      />
    </svg>
  );
}

function DependencyPreview() {
  return (
    <div className="relative w-full h-full min-h-[420px]">
      <Edge x1={20} y1={30} x2={50} y2={30} />
      <Edge x1={50} y1={30} x2={80} y2={30} />
      <Edge x1={50} y1={30} x2={50} y2={62} />
      <Edge x1={50} y1={62} x2={20} y2={75} />
      <Edge x1={50} y1={62} x2={80} y2={75} />
      <NodePill x={20} y={30} label="API Gateway" kind="API" accent="#0091FF" />
      <NodePill x={50} y={30} label="Auth Service" kind="System" accent="#6647F0" />
      <NodePill x={80} y={30} label="User Service" kind="System" accent="#6647F0" />
      <NodePill x={50} y={62} label="Postgres" kind="Database" accent="#FF02F0" />
      <NodePill x={20} y={75} label="Redis" kind="Cache" accent="#FC6D2D" />
      <NodePill x={80} y={75} label="Stripe" kind="External" accent="#FC6D2D" />
    </div>
  );
}

function WhiteboardPreview() {
  return (
    <div className="relative w-full h-full min-h-[420px]">
      <div
        className="absolute"
        style={{
          left: "10%", top: "15%", width: "120px", height: "100px",
          background: "#FFE082",
          boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
          borderRadius: 4,
          padding: 12,
          fontSize: 12,
          color: "#09090b",
          transform: "rotate(-2deg)",
        }}
      >
        Brainstorm new onboarding flows
      </div>
      <div
        className="absolute"
        style={{
          left: "38%", top: "22%", width: "120px", height: "90px",
          background: "#A5D6A7",
          boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
          borderRadius: 4,
          padding: 12,
          fontSize: 12,
          color: "#09090b",
          transform: "rotate(1deg)",
        }}
      >
        Reduce time to first map
      </div>
      <div
        className="absolute"
        style={{
          left: "60%", top: "10%", width: "130px", height: "100px",
          background: "#90CAF9",
          boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
          borderRadius: 4,
          padding: 12,
          fontSize: 12,
          color: "#09090b",
          transform: "rotate(-1.5deg)",
        }}
      >
        Templates by use case
      </div>
      <svg className="absolute" style={{ left: "12%", top: "60%", width: "60%", height: "30%" }}>
        <path d="M 0 30 Q 80 0, 160 50 T 320 30" stroke="#09090b" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      <div
        className="absolute"
        style={{
          right: "8%", bottom: "15%", border: "1.5px dashed var(--color-fg-muted)",
          borderRadius: 4, padding: "10px 14px", fontSize: 11, color: "var(--color-fg-muted)",
        }}
      >
        Frame: Q1 themes
      </div>
    </div>
  );
}

function MindmapPreview() {
  return (
    <div className="relative w-full h-full min-h-[420px]">
      <Edge x1={50} y1={50} x2={20} y2={28} />
      <Edge x1={50} y1={50} x2={80} y2={28} />
      <Edge x1={50} y1={50} x2={20} y2={72} />
      <Edge x1={50} y1={50} x2={80} y2={72} />
      <Edge x1={20} y1={28} x2={8} y2={18} />
      <Edge x1={80} y1={28} x2={92} y2={18} />
      <NodePill x={50} y={50} label="Q2 Strategy" accent="#6647F0" />
      <NodePill x={20} y={28} label="Growth" accent="#0091FF" />
      <NodePill x={80} y={28} label="Product" accent="#FF02F0" />
      <NodePill x={20} y={72} label="Revenue" accent="#FC6D2D" />
      <NodePill x={80} y={72} label="People" accent="#0091FF" />
    </div>
  );
}

function FlowchartPreview() {
  return (
    <div className="relative w-full h-full min-h-[420px]">
      <Edge x1={50} y1={15} x2={50} y2={32} />
      <Edge x1={50} y1={42} x2={50} y2={56} />
      <Edge x1={50} y1={66} x2={25} y2={80} />
      <Edge x1={50} y1={66} x2={75} y2={80} />
      <div className="absolute left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-medium text-white"
           style={{ top: "8%", background: "#16a34a" }}>Start</div>
      <NodePill x={50} y={37} label="Submit form" accent="#0091FF" />
      <div className="absolute left-1/2 -translate-x-1/2"
           style={{ top: "55%", width: 130, height: 80 }}>
        <svg viewBox="0 0 100 70" preserveAspectRatio="none" className="w-full h-full">
          <polygon points="50,2 98,35 50,68 2,35" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-warning">
          Valid?
        </div>
      </div>
      <div className="absolute left-[18%] -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-medium text-white"
           style={{ top: "82%", background: "#0284c7" }}>Save</div>
      <div className="absolute left-[78%] -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-medium text-white"
           style={{ top: "82%", background: "#dc2626" }}>Reject</div>
    </div>
  );
}

function KanbanPreview() {
  const cols = [
    { title: "To do", count: 3, cards: [{ t: "Design tokens", c: "#FFE082" }, { t: "Audit log UI", c: "#90CAF9" }, { t: "Fix mobile nav", c: "#F48FB1" }] },
    { title: "In progress", count: 2, cards: [{ t: "Folder permissions", c: "#A5D6A7" }, { t: "Stripe webhook", c: "#CE93D8" }] },
    { title: "Done", count: 4, cards: [{ t: "RBAC enum migration", c: "#B0BEC5" }, { t: "Marketing refresh", c: "#B0BEC5" }] },
  ];
  return (
    <div className="relative w-full h-full min-h-[420px] p-4 flex gap-3">
      {cols.map((col) => (
        <div key={col.title} className="flex-1 rounded-md border border-border bg-bg flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="text-xs font-semibold text-fg">{col.title}</span>
            <span className="text-[10px] text-fg-subtle">{col.count}</span>
          </div>
          <div className="p-2 space-y-1.5 flex-1">
            {col.cards.map((c, i) => (
              <div
                key={i}
                className="rounded-sm border border-border bg-panel p-2"
                style={{ borderLeft: `3px solid ${c.c}` }}
              >
                <div className="text-xs text-fg">{c.t}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function OrgChartPreview() {
  return (
    <div className="relative w-full h-full min-h-[420px]">
      <Edge x1={50} y1={22} x2={20} y2={55} />
      <Edge x1={50} y1={22} x2={50} y2={55} />
      <Edge x1={50} y1={22} x2={80} y2={55} />
      <Edge x1={20} y1={55} x2={20} y2={82} />
      <Edge x1={80} y1={55} x2={80} y2={82} />
      <PersonCard x={50} y={22} initials="AC" name="Alex Chen" role="CEO" />
      <PersonCard x={20} y={55} initials="PP" name="Priya Patel" role="CTO" />
      <PersonCard x={50} y={55} initials="MR" name="Marcus Reed" role="COO" />
      <PersonCard x={80} y={55} initials="SK" name="Sara Kim" role="CFO" />
      <PersonCard x={20} y={82} initials="JD" name="Jordan Doe" role="VP Eng" />
      <PersonCard x={80} y={82} initials="LM" name="Liam Moore" role="VP Fin" />
    </div>
  );
}

function PersonCard({
  x, y, initials, name, role,
}: {
  x: number; y: number; initials: string; name: string; role: string;
}) {
  return (
    <div
      className="absolute rounded-md border border-border bg-panel px-3 py-2 shadow-sm flex items-center gap-2"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      <div
        className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
        style={{ background: "var(--gradient-cool)" }}
      >
        {initials}
      </div>
      <div>
        <div className="text-xs font-medium text-fg">{name}</div>
        <div className="text-[10px] text-fg-subtle">{role}</div>
      </div>
    </div>
  );
}

function ProductFlowPreview() {
  return (
    <div className="relative w-full h-full min-h-[420px]">
      <Edge x1={20} y1={45} x2={48} y2={45} />
      <Edge x1={52} y1={45} x2={80} y2={45} />
      <ScreenCard x={20} y={45} title="Splash" stage="Cold start" tone="#0091FF" />
      <ScreenCard x={50} y={45} title="Sign in" stage="Anon" tone="#6647F0" />
      <ScreenCard x={80} y={45} title="Feed" stage="Logged in" tone="#FC6D2D" />
      <div className="absolute text-[10px] text-fg-subtle"
           style={{ left: "33%", top: "39%", transform: "translateX(-50%)" }}>
        Not authenticated
      </div>
      <div className="absolute text-[10px] text-fg-subtle"
           style={{ left: "65%", top: "39%", transform: "translateX(-50%)" }}>
        On valid login
      </div>
    </div>
  );
}

function ScreenCard({
  x, y, title, stage, tone,
}: {
  x: number; y: number; title: string; stage: string; tone: string;
}) {
  return (
    <div
      className="absolute rounded-md border border-border bg-panel shadow-sm overflow-hidden"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", width: 130 }}
    >
      <div className="px-2.5 py-1 text-[10px] font-semibold text-white" style={{ background: tone }}>
        Mobile
      </div>
      <div className="p-2.5">
        <div className="text-xs font-semibold text-fg">{title}</div>
        <div className="text-[10px] text-fg-subtle mt-0.5">{stage}</div>
      </div>
    </div>
  );
}
