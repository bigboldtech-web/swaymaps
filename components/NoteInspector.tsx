"use client";

import React from "react";
import { useTheme } from "./providers/ThemeProvider";
import {
  MapEdgeMeta,
  MapNodeMeta,
  NodeKind,
  NodeStatus,
  NodePriority,
  EdgeLineStyle,
  EdgeRelationType,
  Note,
} from "../types/map";

/* ───────────────── Constants ───────────────── */

const ALL_KINDS: { kind: NodeKind; label: string; icon: string; color: string }[] = [
  { kind: "person", label: "Person", icon: "👤", color: "#38bdf8" },
  { kind: "system", label: "System", icon: "🖥", color: "#22c55e" },
  { kind: "process", label: "Process", icon: "⚙️", color: "#fbbf24" },
  { kind: "database", label: "Database", icon: "🗄", color: "#29a5e5" },
  { kind: "api", label: "API", icon: "🔌", color: "#2192dd" },
  { kind: "queue", label: "Queue", icon: "📬", color: "#f59e0b" },
  { kind: "cache", label: "Cache", icon: "⚡", color: "#ef4444" },
  { kind: "cloud", label: "Cloud", icon: "☁️", color: "#8b5cf6" },
  { kind: "team", label: "Team", icon: "👥", color: "#14b8a6" },
  { kind: "vendor", label: "Vendor", icon: "🏢", color: "#f97316" },
  { kind: "generic", label: "Generic", icon: "📦", color: "#29a5e5" },
];

const STATUS_OPTIONS: { value: NodeStatus; label: string; color: string; dot: string }[] = [
  { value: "active", label: "Active", color: "#22c55e", dot: "bg-green-500" },
  { value: "degraded", label: "Degraded", color: "#f59e0b", dot: "bg-yellow-500" },
  { value: "down", label: "Down", color: "#ef4444", dot: "bg-red-500" },
  { value: "maintenance", label: "Maint.", color: "#3b82f6", dot: "bg-blue-500" },
  { value: "deprecated", label: "Depr.", color: "#6b7280", dot: "bg-gray-500" },
  { value: "planned", label: "Planned", color: "#a78bfa", dot: "bg-violet-400" },
];

const PRIORITY_OPTIONS: { value: NodePriority; label: string; color: string }[] = [
  { value: "critical", label: "P0", color: "#ef4444" },
  { value: "high", label: "P1", color: "#f97316" },
  { value: "medium", label: "P2", color: "#f59e0b" },
  { value: "low", label: "P3", color: "#6b7280" },
];

const RELATION_GROUPS: { group: string; items: { value: EdgeRelationType; label: string; icon: string }[] }[] = [
  {
    group: "Common",
    items: [
      { value: "depends_on", label: "Depends On", icon: "🔗" },
      { value: "calls", label: "Calls", icon: "📞" },
      { value: "triggers", label: "Triggers", icon: "⚡" },
      { value: "contains", label: "Contains", icon: "📁" },
    ],
  },
  {
    group: "Data Flow",
    items: [
      { value: "reads_from", label: "Reads From", icon: "📖" },
      { value: "writes_to", label: "Writes To", icon: "✏️" },
      { value: "subscribes", label: "Subscribes", icon: "📡" },
      { value: "publishes", label: "Publishes", icon: "📢" },
    ],
  },
  {
    group: "Infrastructure",
    items: [
      { value: "deploys_to", label: "Deploys To", icon: "🚀" },
      { value: "proxies", label: "Proxies", icon: "🔀" },
      { value: "monitors", label: "Monitors", icon: "📊" },
      { value: "authenticates", label: "Auth", icon: "🔐" },
    ],
  },
  {
    group: "Other",
    items: [
      { value: "inherits", label: "Inherits", icon: "🧬" },
      { value: "custom", label: "Custom", icon: "✨" },
    ],
  },
];

const ALL_RELATIONS = RELATION_GROUPS.flatMap((g) => g.items);

const PALETTE = [
  "#3b82f6", "#22c55e", "#f59e0b", "#ec4899", "#8b5cf6",
  "#ef4444", "#2192dd", "#f97316", "#29a5e5", "#14b8a6", "#9ca3af",
];

const EDGE_COLORS = [
  "#64748b", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#2192dd", "#f97316", "#14b8a6",
];

/* ───────────────── Helpers ───────────────── */

function parseTagsInput(value: string): string[] {
  return value.split(",").map((t) => t.trim()).filter(Boolean);
}

const urlRegex = /(https?:\/\/[^\s]+)/g;

function renderLine(line: string, index: number) {
  const trimmed = line.trim();
  if (trimmed.startsWith("img:")) {
    const url = trimmed.slice(4).trim();
    return (
      <div key={index} className="my-2">
        <img src={url} alt="inline" className="max-h-64 w-full rounded-md object-cover" />
      </div>
    );
  }
  const mdImage = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
  if (mdImage) {
    return (
      <div key={index} className="my-2">
        <img src={mdImage[2]} alt={mdImage[1] || "image"} className="max-h-64 w-full rounded-md object-cover" />
      </div>
    );
  }
  const parts: (string | JSX.Element)[] = [];
  urlRegex.lastIndex = 0;
  let lastIndex = 0;
  let match;
  while ((match = urlRegex.exec(line)) !== null) {
    if (match.index > lastIndex) parts.push(line.slice(lastIndex, match.index));
    parts.push(
      <a key={`${index}-${match.index}`} href={match[0]} target="_blank" rel="noreferrer" className="text-brand-400 underline hover:text-brand-300">
        {match[0]}
      </a>
    );
    lastIndex = urlRegex.lastIndex;
  }
  if (lastIndex < line.length) parts.push(line.slice(lastIndex));
  return (
    <p key={index} className="text-sm leading-relaxed break-words break-all text-inherit">
      {parts.length ? parts : line}
    </p>
  );
}

function kindInfo(kind?: NodeKind) {
  return ALL_KINDS.find((k) => k.kind === kind) ?? ALL_KINDS[ALL_KINDS.length - 1];
}

/* ───────────────── Sub-components ───────────────── */

function Section({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const { theme: secTheme } = useTheme();
  const isSecLight = secTheme === "light";
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className={`rounded-lg border ${isSecLight ? "border-slate-200 bg-slate-50/50" : "border-slate-700/30 bg-slate-800/15"}`}>
      <button
        className={`flex w-full items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition ${isSecLight ? "text-slate-500 hover:text-slate-700" : "text-slate-500 hover:text-slate-300"}`}
        onClick={() => setOpen(!open)}
      >
        {title}
        <svg className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-3 pb-3 space-y-2.5">{children}</div>}
    </div>
  );
}

function TabBar({ tabs, active, onChange }: { tabs: { id: string; label: string; count?: number }[]; active: string; onChange: (id: string) => void }) {
  const { theme: tabTheme } = useTheme();
  const isTabLight = tabTheme === "light";
  return (
    <div className={`flex ${isTabLight ? "border-b border-slate-200 bg-slate-50" : "border-b border-slate-700/30 bg-slate-900/30"}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flex-1 px-2 py-2 text-[11px] font-semibold uppercase tracking-wider transition ${
            active === tab.id
              ? "text-brand-400 border-b-2 border-brand-400"
              : "text-slate-500 hover:text-slate-300 border-b-2 border-transparent"
          }`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {tab.count !== undefined && tab.count > 0 && (
            <span className={`ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold ${isTabLight ? "bg-slate-200 text-slate-600" : "bg-slate-700/50 text-slate-300"}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/** Compact dropdown for selecting from a categorized list */
function RelationDropdown({ value, onChange }: { value?: EdgeRelationType; onChange: (v: EdgeRelationType) => void }) {
  const { theme: relTheme } = useTheme();
  const isRelLight = relTheme === "light";
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const current = ALL_RELATIONS.find((r) => r.value === value);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
          value
            ? (isRelLight ? "border-brand-500/30 bg-brand-500/5 text-brand-600" : "border-brand-500/30 bg-brand-500/5 text-brand-300")
            : (isRelLight ? "border-slate-200 bg-white text-slate-500" : "border-slate-700/40 bg-slate-800/30 text-slate-400")
        } hover:border-slate-500`}
        onClick={() => setOpen(!open)}
      >
        {current ? (
          <>
            <span className="text-sm">{current.icon}</span>
            <span className="flex-1 text-left font-medium">{current.label}</span>
          </>
        ) : (
          <span className="flex-1 text-left">Select relationship...</span>
        )}
        <svg className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className={`absolute left-0 right-0 top-full z-50 mt-1 max-h-[280px] overflow-y-auto rounded-lg border ${isRelLight ? "border-slate-200 bg-white" : "border-slate-700/40 bg-[#0a1628]"} shadow-xl shadow-black/40`}>
          {RELATION_GROUPS.map((group) => (
            <div key={group.group}>
              <div className={`sticky top-0 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${isRelLight ? "bg-white text-slate-500" : "bg-[#0a1628] text-slate-600"}`}>
                {group.group}
              </div>
              {group.items.map((item) => (
                <button
                  key={item.value}
                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm transition ${isRelLight ? "hover:bg-slate-100" : "hover:bg-slate-800/50"} ${
                    value === item.value ? (isRelLight ? "text-brand-600 bg-brand-500/10" : "text-brand-300 bg-brand-500/10") : (isRelLight ? "text-slate-600" : "text-slate-300")
                  }`}
                  onClick={() => { onChange(item.value); setOpen(false); }}
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Compact node type selector as a dropdown */
function StatusPriorityDropdown({
  type,
  currentValue,
  isLight,
  statusOpt,
  priorityOpt,
  onSelect,
}: {
  type: "status" | "priority";
  currentValue?: string;
  isLight: boolean;
  statusOpt?: (typeof STATUS_OPTIONS)[number];
  priorityOpt?: (typeof PRIORITY_OPTIONS)[number];
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (type === "status") {
    return (
      <div className="relative" ref={ref}>
        <button
          className="flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold transition"
          style={
            statusOpt
              ? { borderColor: `${statusOpt.color}40`, backgroundColor: `${statusOpt.color}10`, color: statusOpt.color }
              : { borderColor: "rgb(51 65 85 / 0.3)", backgroundColor: "rgb(30 41 59 / 0.2)", color: "#94a3b8" }
          }
          onClick={() => setOpen(!open)}
        >
          {statusOpt && <span className={`inline-block h-1.5 w-1.5 rounded-full ${statusOpt.dot}`} />}
          {statusOpt?.label || "Status"}
          <svg className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open && (
          <div className={`absolute left-0 top-full z-50 mt-1 w-32 rounded-lg border ${isLight ? "border-slate-200 bg-white" : "border-slate-700/40 bg-[#0a1628]"} shadow-xl shadow-black/40 py-1 animate-fade-in`}>
            {STATUS_OPTIONS.map(({ value, label, dot }) => (
              <button
                key={value}
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-[11px] font-medium transition ${isLight ? "hover:bg-slate-100" : "hover:bg-slate-800/50"} ${
                  currentValue === value ? (isLight ? "text-brand-600" : "text-brand-300") : (isLight ? "text-slate-600" : "text-slate-300")
                }`}
                onClick={() => { onSelect(value); setOpen(false); }}
              >
                <span className={`inline-block h-2 w-2 rounded-full ${dot}`} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Priority
  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold transition"
        style={
          priorityOpt
            ? { borderColor: `${priorityOpt.color}40`, backgroundColor: `${priorityOpt.color}10`, color: priorityOpt.color }
            : { borderColor: "rgb(51 65 85 / 0.3)", backgroundColor: "rgb(30 41 59 / 0.2)", color: "#94a3b8" }
        }
        onClick={() => setOpen(!open)}
      >
        {priorityOpt?.label || "Priority"}
        <svg className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className={`absolute left-0 top-full z-50 mt-1 w-28 rounded-lg border ${isLight ? "border-slate-200 bg-white" : "border-slate-700/40 bg-[#0a1628]"} shadow-xl shadow-black/40 py-1 animate-fade-in`}>
          {PRIORITY_OPTIONS.map(({ value, label, color }) => (
            <button
              key={value}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-[11px] font-medium transition ${isLight ? "hover:bg-slate-100" : "hover:bg-slate-800/50"} ${
                currentValue === value ? (isLight ? "text-brand-600" : "text-brand-300") : (isLight ? "text-slate-600" : "text-slate-300")
              }`}
              onClick={() => { onSelect(value); setOpen(false); }}
            >
              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NodeTypeDropdown({ value, onChange }: { value: NodeKind; onChange: (kind: NodeKind, label: string, color: string) => void }) {
  const { theme: ntTheme } = useTheme();
  const isNTLight = ntTheme === "light";
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const current = kindInfo(value);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition ${isNTLight ? "border-slate-200 bg-white hover:border-slate-300" : "border-slate-700/30 bg-slate-800/20 hover:border-slate-600"}`}
        onClick={() => setOpen(!open)}
      >
        <span
          className="flex h-5 w-5 items-center justify-center rounded text-xs"
          style={{ backgroundColor: `${current.color}20`, color: current.color }}
        >
          {current.icon}
        </span>
        <span className={`font-medium ${isNTLight ? "text-slate-700" : "text-slate-200"}`}>{current.label}</span>
        <svg className={`h-3 w-3 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className={`absolute left-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border ${isNTLight ? "border-slate-200 bg-white" : "border-slate-700/40 bg-[#0a1628]"} shadow-xl shadow-black/40`}>
          {ALL_KINDS.map(({ kind, label, icon, color }) => (
            <button
              key={kind}
              className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition ${isNTLight ? "hover:bg-slate-100" : "hover:bg-slate-800/50"} ${
                value === kind ? (isNTLight ? "text-brand-600 bg-brand-500/10" : "text-brand-300 bg-brand-500/10") : (isNTLight ? "text-slate-600" : "text-slate-300")
              }`}
              onClick={() => { onChange(kind, label, color); setOpen(false); }}
            >
              <span className="text-sm" style={{ color }}>{icon}</span>
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────── CommentsSection ───────────────── */

interface CommentData {
  id: string;
  text: string;
  createdAt: string;
  author?: { id: string; name: string | null; avatarUrl: string | null } | null;
}

function CommentsSection({ noteId }: { noteId: string }) {
  const { theme: csTheme } = useTheme();
  const isCSLight = csTheme === "light";
  const [comments, setComments] = React.useState<CommentData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [posting, setPosting] = React.useState(false);
  const [text, setText] = React.useState("");
  const [open, setOpen] = React.useState(true);
  const listRef = React.useRef<HTMLDivElement>(null);

  const inputClass = isCSLight
    ? "border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/30 rounded-lg"
    : "border-slate-700/40 bg-slate-800/20 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/30 rounded-lg";

  const fetchComments = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/notes/${noteId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [noteId]);

  React.useEffect(() => {
    setLoading(true);
    setComments([]);
    setText("");
    fetchComments();
  }, [noteId, fetchComments]);

  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [comments.length]);

  const handlePost = async () => {
    if (!text.trim() || posting) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/notes/${noteId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [...prev, newComment]);
        setText("");
      }
    } catch {
      // silently fail
    } finally {
      setPosting(false);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Collapsible header */}
      <button
        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition ${isCSLight ? "border-slate-200 bg-slate-50/50 text-slate-500 hover:text-slate-700" : "border-slate-700/30 bg-slate-800/15 text-slate-500 hover:text-slate-300"}`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          Comments
          {comments.length > 0 && (
            <span className={`inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold ${
              isCSLight ? "bg-sky-100 text-brand-600" : "bg-brand-500/20 text-brand-300"
            }`}>
              {comments.length}
            </span>
          )}
        </div>
        <svg className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          {/* Comment list */}
          <div ref={listRef} className="max-h-[45vh] space-y-2 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-6">
                <div className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${isCSLight ? "border-slate-400" : "border-slate-500"}`} />
                <span className="ml-2 text-[11px] text-slate-500">Loading comments...</span>
              </div>
            )}

            {!loading && comments.length === 0 && (
              <div className={`rounded-lg border px-4 py-6 text-center ${
                isCSLight ? "border-slate-200 bg-slate-50" : "border-slate-700/20 bg-slate-800/10"
              }`}>
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800/20 text-sm text-slate-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="text-xs text-slate-500">No comments yet. Start the conversation.</div>
              </div>
            )}

            {comments.map((c) => (
              <div key={c.id} className={`rounded-lg border px-3 py-2 ${
                isCSLight ? "border-slate-200 bg-slate-50" : "border-slate-700/25 bg-slate-800/15"
              }`}>
                <div className="flex items-start gap-2">
                  {/* Avatar initials */}
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-[9px] font-bold text-white">
                    {getInitials(c.author?.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-semibold ${isCSLight ? "text-slate-700" : "text-slate-200"}`}>
                        {c.author?.name || "Anonymous"}
                      </span>
                      <span className="text-[9px] text-slate-500">{formatTime(c.createdAt)}</span>
                    </div>
                    <div className={`mt-0.5 text-xs leading-relaxed ${isCSLight ? "text-slate-600" : "text-slate-300"}`}>
                      {c.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className={`rounded-lg border p-2.5 ${
            isCSLight ? "border-slate-200 bg-slate-50" : "border-slate-700/20 bg-slate-800/10"
          }`}>
            <textarea
              className={`w-full border px-2.5 py-2 text-xs ${inputClass}`}
              placeholder="Write a comment... (Cmd+Enter to post)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  handlePost();
                }
              }}
              rows={2}
            />
            <button
              className="mt-1.5 w-full rounded-lg bg-gradient-to-r from-brand-600 to-brand-400 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-brand-500/15 transition hover:shadow-brand-500/30 disabled:opacity-40"
              onClick={handlePost}
              disabled={!text.trim() || posting}
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ───────────────── Props ───────────────── */

interface NoteInspectorProps {
  selectedNote: Note | null;
  selectedMeta: MapNodeMeta | null;
  selectedEdge: MapEdgeMeta | null;
  selectedEdgeNote: Note | null;
  allNodes?: MapNodeMeta[];
  onChange: (note: Note) => void;
  onUpdateTags: (tags: string[]) => void;
  onUpdateMeta: (meta: MapNodeMeta) => void;
  onUpdateEdge: (edge: MapEdgeMeta) => void;
  onUpdateNodeColor: (color: string) => void;
  onFocusNode?: (nodeId: string) => void;
  onNoSelectionMessage?: string;
}

/* ───────────────── Main Component ───────────────── */

export default function NoteInspector({
  selectedNote,
  selectedMeta,
  selectedEdge,
  selectedEdgeNote,
  allNodes,
  onChange,
  onUpdateTags,
  onUpdateMeta,
  onUpdateEdge,
  onFocusNode,
  onNoSelectionMessage,
}: NoteInspectorProps) {
  const { theme: inspTheme } = useTheme();
  const isLight = inspTheme === "light";
  const [draft, setDraft] = React.useState<Note | null>(selectedNote);
  const [tagInput, setTagInput] = React.useState(selectedNote ? selectedNote.tags.join(", ") : "");
  const [metaDraft, setMetaDraft] = React.useState<MapNodeMeta | null>(selectedMeta);
  const [edgeNoteDraft, setEdgeNoteDraft] = React.useState<Note | null>(selectedEdgeNote);
  const [edgeDraft, setEdgeDraft] = React.useState<MapEdgeMeta | null>(selectedEdge);
  const [nodeTab, setNodeTab] = React.useState("details");
  const [edgeTab, setEdgeTab] = React.useState("connection");

  const prevNodeIdRef = React.useRef<string | null>(selectedMeta?.id ?? null);
  const prevEdgeIdRef = React.useRef<string | null>(selectedEdge?.id ?? null);

  const inputClass = isLight
    ? "border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/30 rounded-lg"
    : "border-slate-700/40 bg-slate-800/20 text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-brand-500/40 focus:ring-1 focus:ring-brand-500/30 rounded-lg";

  React.useEffect(() => {
    const newNodeId = selectedMeta?.id ?? null;
    const isNewSelection = newNodeId !== prevNodeIdRef.current;
    prevNodeIdRef.current = newNodeId;
    if (isNewSelection) {
      setDraft(selectedNote ? { ...selectedNote, comments: selectedNote.comments ?? [] } : selectedNote);
      setTagInput(selectedNote ? selectedNote.tags.join(", ") : "");
      setMetaDraft(selectedMeta);
      setNodeTab("details");
    }
  }, [selectedNote, selectedMeta]);

  React.useEffect(() => {
    const newEdgeId = selectedEdge?.id ?? null;
    const isNewSelection = newEdgeId !== prevEdgeIdRef.current;
    prevEdgeIdRef.current = newEdgeId;
    if (isNewSelection) {
      setEdgeNoteDraft(selectedEdgeNote);
      setEdgeDraft(selectedEdge);
      setEdgeTab("connection");
    }
  }, [selectedEdgeNote, selectedEdge]);

  /* ── Note helpers ── */
  const updateNote = (changes: Partial<Note>) => {
    if (!draft) return;
    const next: Note = { ...draft, ...changes, updatedAt: new Date().toISOString() };
    next.comments = next.comments ?? [];
    setDraft(next);
    onChange(next);
  };

  const handleTagBlur = () => {
    if (!draft) return;
    const tags = parseTagsInput(tagInput);
    updateNote({ tags });
    onUpdateTags(tags);
  };

  /* ── Meta helpers ── */
  const updateMeta = (changes: Partial<MapNodeMeta>) => {
    if (!metaDraft) return;
    const next = { ...metaDraft, ...changes };
    setMetaDraft(next);
    onUpdateMeta(next);
  };

  /* ── Edge helpers ── */
  const updateEdge = (changes: Partial<MapEdgeMeta>) => {
    if (!edgeDraft) return;
    const next = { ...edgeDraft, ...changes };
    setEdgeDraft(next);
    onUpdateEdge(next);
  };

  const updateEdgeNote = (changes: Partial<Note>) => {
    if (!edgeNoteDraft) return;
    const next: Note = { ...edgeNoteDraft, ...changes, updatedAt: new Date().toISOString() };
    setEdgeNoteDraft(next);
    onChange(next);
  };

  /* ── Pin helpers ── */
  const pinLabel = React.useMemo(() => {
    if (!metaDraft) return "";
    const pinTag = metaDraft.tags.find((t) => t.startsWith("__pin:"));
    return pinTag ? pinTag.replace("__pin:", "") : "";
  }, [metaDraft]);

  const handlePinToggle = () => {
    if (!metaDraft) return;
    const cleaned = metaDraft.tags.filter((t) => !t.startsWith("__pin:"));
    if (pinLabel) {
      updateMeta({ tags: cleaned });
    } else {
      updateMeta({ tags: [...cleaned, `__pin:${metaDraft.kindLabel || metaDraft.title || "Pinned"}`] });
    }
  };

  /* ── Edge node lookup ── */
  const sourceNode = React.useMemo(() => allNodes?.find((n) => n.id === edgeDraft?.sourceId), [allNodes, edgeDraft?.sourceId]);
  const targetNode = React.useMemo(() => allNodes?.find((n) => n.id === edgeDraft?.targetId), [allNodes, edgeDraft?.targetId]);

  /* ───────────────── Empty State ───────────────── */

  if (!draft && !edgeNoteDraft) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <div className={`rounded-2xl border p-8 ${isLight ? "border-slate-200/60 bg-slate-50" : "border-slate-700/20 bg-slate-800/10"}`}>
          <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${isLight ? "bg-slate-100" : "bg-slate-800/30"}`}>
            🎯
          </div>
          <div className={`text-sm font-semibold ${isLight ? "text-slate-600" : "text-slate-300"}`}>
            {onNoSelectionMessage || "Select a node or edge"}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Click any element on the canvas to inspect and edit its properties.
          </p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════
     ███ EDGE INSPECTOR ███
     ═══════════════════════════════════════════════════ */

  if (edgeNoteDraft && edgeDraft) {
    const currentRelation = ALL_RELATIONS.find((r) => r.value === edgeDraft.relationType);
    const protocolBadges = [
      edgeDraft.protocol,
      edgeDraft.dataFlow,
      edgeDraft.latency,
    ].filter(Boolean);

    return (
      <div className={`flex h-full flex-col ${isLight ? "bg-white text-slate-800" : "bg-[#040915] text-slate-100"}`}>
        {/* ── Visual sentence header: Source → relation → Target ── */}
        <div className={`border-b px-4 py-3 space-y-2.5 ${isLight ? "border-slate-200" : "border-slate-700/30"}`}>
          <div className="flex items-center gap-2 text-sm">
            {/* Source chip */}
            <button
              className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition truncate max-w-[110px] ${isLight ? "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100" : "border-slate-700/30 bg-slate-800/30 text-slate-300 hover:bg-slate-700/30"}`}
              onClick={() => sourceNode && onFocusNode?.(sourceNode.id)}
              title={sourceNode?.title || "Source"}
            >
              <span className="text-[10px]">{kindInfo(sourceNode?.kind).icon}</span>
              <span className="truncate">{sourceNode?.title || "Source"}</span>
            </button>

            {/* Relation arrow */}
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <span className="text-slate-600">―</span>
              <span className="whitespace-nowrap font-medium" style={{ color: currentRelation ? "#67e8f9" : undefined }}>
                {currentRelation?.label || "connects"}
              </span>
              <span className="text-slate-600">→</span>
            </div>

            {/* Target chip */}
            <button
              className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition truncate max-w-[110px] ${isLight ? "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100" : "border-slate-700/30 bg-slate-800/30 text-slate-300 hover:bg-slate-700/30"}`}
              onClick={() => targetNode && onFocusNode?.(targetNode.id)}
              title={targetNode?.title || "Target"}
            >
              <span className="text-[10px]">{kindInfo(targetNode?.kind).icon}</span>
              <span className="truncate">{targetNode?.title || "Target"}</span>
            </button>
          </div>

          {/* Label inline edit */}
          <input
            className={`w-full border px-2.5 py-1.5 text-sm font-semibold ${inputClass}`}
            value={edgeDraft.label ?? ""}
            onChange={(e) => updateEdge({ label: e.target.value })}
            placeholder="Connection label..."
          />

          {/* Quick badges row */}
          {protocolBadges.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {edgeDraft.protocol && (
                <span className="inline-flex items-center rounded-md border border-brand-500/20 bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-300">
                  {edgeDraft.protocol}
                </span>
              )}
              {edgeDraft.dataFlow && (
                <span className="inline-flex items-center rounded-md border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-violet-300">
                  {edgeDraft.dataFlow}
                </span>
              )}
              {edgeDraft.latency && (
                <span className="inline-flex items-center rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                  {edgeDraft.latency}
                </span>
              )}
            </div>
          )}
        </div>

        <TabBar
          tabs={[
            { id: "connection", label: "Connection" },
            { id: "style", label: "Style" },
            { id: "notes", label: "Notes" },
          ]}
          active={edgeTab}
          onChange={setEdgeTab}
        />

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* ── Connection Tab ── */}
          {edgeTab === "connection" && (
            <>
              {/* Relationship Type Dropdown */}
              <div>
                <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Relationship</label>
                <div className="mt-1">
                  <RelationDropdown
                    value={edgeDraft.relationType}
                    onChange={(v) => updateEdge({ relationType: v })}
                  />
                </div>
              </div>

              {/* Protocol & Data Format — compact row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-medium text-slate-500">Protocol</label>
                  <select
                    className={`mt-0.5 w-full border px-2 py-1.5 text-xs ${inputClass}`}
                    value={edgeDraft.protocol ?? ""}
                    onChange={(e) => updateEdge({ protocol: e.target.value || undefined })}
                  >
                    <option value="">None</option>
                    <option value="REST">REST</option>
                    <option value="GraphQL">GraphQL</option>
                    <option value="gRPC">gRPC</option>
                    <option value="WebSocket">WebSocket</option>
                    <option value="Kafka">Kafka</option>
                    <option value="RabbitMQ">RabbitMQ</option>
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                    <option value="MQTT">MQTT</option>
                    <option value="AMQP">AMQP</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-500">Data Format</label>
                  <select
                    className={`mt-0.5 w-full border px-2 py-1.5 text-xs ${inputClass}`}
                    value={edgeDraft.dataFlow ?? ""}
                    onChange={(e) => updateEdge({ dataFlow: e.target.value || undefined })}
                  >
                    <option value="">None</option>
                    <option value="JSON">JSON</option>
                    <option value="Protobuf">Protobuf</option>
                    <option value="XML">XML</option>
                    <option value="Avro">Avro</option>
                    <option value="CSV">CSV</option>
                    <option value="Binary">Binary</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
              </div>

              {/* Latency */}
              <div>
                <label className="text-[10px] font-medium text-slate-500">Latency / SLA</label>
                <input
                  className={`mt-0.5 w-full border px-2.5 py-1.5 text-xs ${inputClass}`}
                  value={edgeDraft.latency ?? ""}
                  onChange={(e) => updateEdge({ latency: e.target.value || undefined })}
                  placeholder="e.g., < 50ms"
                />
              </div>

              {/* Edge Shape — compact inline */}
              <div>
                <label className="text-[10px] font-medium text-slate-500">Shape</label>
                <div className="mt-1 flex gap-1">
                  {([
                    { value: "smoothstep", label: "Rounded" },
                    { value: "default", label: "Curved" },
                    { value: "straight", label: "Straight" },
                    { value: "step", label: "Step" },
                  ] as const).map(({ value, label }) => {
                    const active = (edgeDraft.edgeType ?? "smoothstep") === value;
                    return (
                      <button
                        key={value}
                        className={`flex-1 rounded-md px-1 py-1 text-[10px] font-medium transition ${
                          active
                            ? "bg-brand-500/15 border border-brand-500/30 text-brand-300"
                            : isLight ? "bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700" : "bg-slate-800/20 border border-slate-700/20 text-slate-500 hover:text-slate-300"
                        }`}
                        onClick={() => updateEdge({ edgeType: value })}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ── Style Tab ── */}
          {edgeTab === "style" && (
            <>
              {/* Line Pattern */}
              <div>
                <label className="text-[10px] font-medium text-slate-500">Line Pattern</label>
                <div className="mt-1 flex gap-1.5">
                  {([
                    { value: "solid" as EdgeLineStyle, label: "━━━" },
                    { value: "dashed" as EdgeLineStyle, label: "╌ ╌ ╌" },
                    { value: "dotted" as EdgeLineStyle, label: "• • •" },
                  ]).map(({ value, label }) => {
                    const active = (edgeDraft.lineStyle ?? "solid") === value;
                    return (
                      <button
                        key={value}
                        className={`flex-1 rounded-md py-2 text-center text-xs font-medium tracking-wider transition ${
                          active
                            ? "bg-brand-500/15 border border-brand-500/30 text-brand-300"
                            : isLight ? "bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700" : "bg-slate-800/20 border border-slate-700/20 text-slate-500 hover:text-slate-300"
                        }`}
                        onClick={() => updateEdge({ lineStyle: value })}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weight */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-medium text-slate-500">Weight</label>
                  <span className="text-[10px] text-slate-600">{edgeDraft.weight ?? 2}</span>
                </div>
                <input
                  type="range"
                  min={1} max={5} step={1}
                  value={edgeDraft.weight ?? 2}
                  onChange={(e) => updateEdge({ weight: Number(e.target.value) })}
                  className="mt-1 w-full accent-brand-500"
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-[10px] font-medium text-slate-500">Color</label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {EDGE_COLORS.map((color) => {
                    const active = edgeDraft.color === color;
                    return (
                      <button
                        key={color}
                        className={`h-6 w-6 rounded-full border-2 transition ${
                          active ? "border-white ring-2 ring-brand-500/30 scale-110" : (isLight ? "border-slate-300 hover:border-slate-400" : "border-slate-700/40 hover:border-slate-500")
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateEdge({ color })}
                      />
                    );
                  })}
                  {edgeDraft.color && (
                    <button
                      className={`h-6 rounded-full border px-2 text-[9px] ${isLight ? "border-slate-200 text-slate-500 hover:text-slate-700" : "border-slate-700/30 text-slate-500 hover:text-slate-300"}`}
                      onClick={() => updateEdge({ color: undefined })}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Animated Flow */}
              <div className={`flex items-center justify-between rounded-lg border px-3 py-2 ${isLight ? "border-slate-200 bg-slate-50" : "border-slate-700/20 bg-slate-800/10"}`}>
                <span className={`text-xs ${isLight ? "text-slate-600" : "text-slate-300"}`}>Animated Flow</span>
                <button
                  className={`h-5 w-9 rounded-full border transition ${
                    edgeDraft.animated
                      ? "border-brand-500/50 bg-brand-500/30"
                      : "border-slate-700 bg-slate-800"
                  }`}
                  onClick={() => updateEdge({ animated: !edgeDraft.animated })}
                >
                  <div className={`h-4 w-4 rounded-full bg-white shadow transition ${edgeDraft.animated ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
            </>
          )}

          {/* ── Notes Tab ── */}
          {edgeTab === "notes" && (
            <>
              <div>
                <label className="text-[10px] font-medium text-slate-500">Title</label>
                <input
                  className={`mt-0.5 w-full border px-2.5 py-1.5 text-sm font-semibold ${inputClass}`}
                  value={edgeNoteDraft.title}
                  onChange={(e) => updateEdgeNote({ title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-slate-500">Tags</label>
                <input
                  className={`mt-0.5 w-full border px-2.5 py-1.5 text-xs ${inputClass}`}
                  placeholder="ops, vendor, priority"
                  value={edgeNoteDraft.tags.join(", ")}
                  onChange={(e) => updateEdgeNote({ tags: parseTagsInput(e.target.value) })}
                />
                {edgeNoteDraft.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {edgeNoteDraft.tags.map((tag) => (
                      <span key={tag} className={`rounded-md border px-1.5 py-0.5 text-[10px] uppercase tracking-wide ${isLight ? "border-slate-200 bg-slate-50 text-slate-500" : "border-slate-700/30 bg-slate-800/30 text-slate-400"}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-[10px] font-medium text-slate-500">Content</label>
                <textarea
                  className={`min-h-[120px] flex-1 border px-2.5 py-2 text-sm ${inputClass}`}
                  value={edgeNoteDraft.content}
                  onChange={(e) => updateEdgeNote({ content: e.target.value })}
                  placeholder="Add notes about this connection..."
                />
                {edgeNoteDraft.content.trim() && (
                  <Section title="Preview" defaultOpen={false}>
                    <div className="space-y-1">
                      {edgeNoteDraft.content.split("\n").map((line, idx) => renderLine(line, idx))}
                    </div>
                  </Section>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════
     ███ NODE INSPECTOR ███
     ═══════════════════════════════════════════════════ */

  const currentBaseColor = metaDraft?.kind
    ? metaDraft.color || kindInfo(metaDraft.kind).color
    : undefined;

  const statusOpt = STATUS_OPTIONS.find((s) => s.value === metaDraft?.status);
  const priorityOpt = PRIORITY_OPTIONS.find((p) => p.value === metaDraft?.priority);

  return (
    <div className={`flex h-full flex-col ${isLight ? "bg-white text-slate-800" : "bg-[#040915] text-slate-100"}`}>

      {/* ═══ ZONE 1: Header — Always visible ═══ */}
      {metaDraft && (
        <div className={`border-b px-4 py-3 space-y-2 ${isLight ? "border-slate-200" : "border-slate-700/30"}`}>
          {/* Row 1: Icon + Name + Pin */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-base shrink-0"
              style={{ backgroundColor: `${currentBaseColor}15`, border: `1px solid ${currentBaseColor}30` }}
            >
              {kindInfo(metaDraft.kind).icon}
            </div>
            <div className="flex-1 min-w-0">
              <input
                className={`w-full bg-transparent text-sm font-bold outline-none border-none p-0 ${isLight ? "text-slate-800 placeholder:text-slate-400" : "text-slate-100 placeholder:text-slate-500"}`}
                value={draft?.title ?? metaDraft.title ?? ""}
                onChange={(e) => {
                  updateNote({ title: e.target.value });
                  updateMeta({ title: e.target.value });
                }}
                placeholder="Node name..."
              />
            </div>
            {/* Pin */}
            <button
              className={`rounded-md p-1 transition ${pinLabel ? "text-brand-400 bg-brand-500/10" : "text-slate-600 hover:text-slate-400"}`}
              onClick={handlePinToggle}
              title={pinLabel ? "Unpin" : "Pin"}
            >
              <svg className="h-3.5 w-3.5" fill={pinLabel ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            {/* Open URL */}
            {metaDraft.url && (
              <a
                href={metaDraft.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-md p-1 text-slate-500 hover:text-brand-400 transition"
                title="Open external link"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>

          {/* Row 2: Type dropdown + Status + Priority */}
          <div className="flex items-center gap-2 flex-wrap">
            <NodeTypeDropdown
              value={metaDraft.kind}
              onChange={(kind, label, color) => updateMeta({ kind, kindLabel: label, color })}
            />

            {/* Status chip */}
            <StatusPriorityDropdown
              type="status"
              currentValue={metaDraft.status}
              isLight={isLight}
              statusOpt={statusOpt}
              onSelect={(value) => updateMeta({ status: metaDraft.status === value ? undefined : value as any })}
            />

            {/* Priority chip */}
            <StatusPriorityDropdown
              type="priority"
              currentValue={metaDraft.priority}
              isLight={isLight}
              priorityOpt={priorityOpt}
              onSelect={(value) => updateMeta({ priority: metaDraft.priority === value ? undefined : value as any })}
            />
          </div>

          {/* Row 3: Owner + quick info badges */}
          <div className="flex items-center gap-2 text-xs">
            <input
              className={`flex-1 bg-transparent text-xs outline-none border-none p-0 ${isLight ? "text-slate-600 placeholder:text-slate-400" : "text-slate-300 placeholder:text-slate-600"}`}
              value={metaDraft.owner ?? ""}
              onChange={(e) => updateMeta({ owner: e.target.value || undefined })}
              placeholder="Owner / Team..."
            />
            {metaDraft.version && (
              <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-mono ${isLight ? "border-slate-200 bg-slate-50 text-slate-500" : "border-slate-700/30 bg-slate-800/20 text-slate-400"}`}>
                {metaDraft.version}
              </span>
            )}
            {metaDraft.sla && (
              <span className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                {metaDraft.sla}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ═══ ZONE 2: Tabs ═══ */}
      <TabBar
        tabs={[
          { id: "details", label: "Details" },
          { id: "notes", label: "Notes" },
          { id: "style", label: "Style" },
          { id: "comments", label: "Chat", count: draft?.comments?.length ?? 0 },
        ]}
        active={nodeTab}
        onChange={setNodeTab}
      />

      {/* ═══ ZONE 3: Tab Content ═══ */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">

        {/* ── Details Tab ── */}
        {nodeTab === "details" && metaDraft && (
          <>
            {/* Custom Type Label */}
            <div>
              <label className="text-[10px] font-medium text-slate-500">Type Label</label>
              <input
                className={`mt-0.5 w-full border px-2.5 py-1.5 text-xs ${inputClass}`}
                value={metaDraft.kindLabel}
                onChange={(e) => updateMeta({ kindLabel: e.target.value })}
                placeholder="Custom label..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[10px] font-medium text-slate-500">Description</label>
              <textarea
                className={`mt-0.5 w-full border px-2.5 py-1.5 text-xs leading-relaxed ${inputClass}`}
                rows={2}
                value={metaDraft.description ?? ""}
                onChange={(e) => updateMeta({ description: e.target.value || undefined })}
                placeholder="Brief description of this component..."
              />
            </div>

            {/* Version + SLA row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-medium text-slate-500">Version</label>
                <input
                  className={`mt-0.5 w-full border px-2.5 py-1.5 text-xs ${inputClass}`}
                  value={metaDraft.version ?? ""}
                  onChange={(e) => updateMeta({ version: e.target.value || undefined })}
                  placeholder="v2.3.1"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-slate-500">SLA</label>
                <input
                  className={`mt-0.5 w-full border px-2.5 py-1.5 text-xs ${inputClass}`}
                  value={metaDraft.sla ?? ""}
                  onChange={(e) => updateMeta({ sla: e.target.value || undefined })}
                  placeholder="99.99%"
                />
              </div>
            </div>

            {/* External URL */}
            <div>
              <label className="text-[10px] font-medium text-slate-500">External URL</label>
              <div className="mt-0.5 flex gap-1.5">
                <input
                  className={`flex-1 border px-2.5 py-1.5 text-xs ${inputClass}`}
                  value={metaDraft.url ?? ""}
                  onChange={(e) => updateMeta({ url: e.target.value || undefined })}
                  placeholder="https://docs.example.com"
                />
                {metaDraft.url && (
                  <a
                    href={metaDraft.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center justify-center rounded-lg border px-2 text-brand-400 hover:bg-brand-500/10 transition ${isLight ? "border-slate-200 bg-slate-50" : "border-slate-700/30 bg-slate-800/20"}`}
                    title="Open link"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-[10px] font-medium text-slate-500">Tags</label>
              <input
                className={`mt-0.5 w-full border px-2.5 py-1.5 text-xs ${inputClass}`}
                placeholder="ops, vendor, priority"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onBlur={handleTagBlur}
              />
              {(draft?.tags ?? []).length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {(draft?.tags ?? []).map((tag) => (
                    <span key={tag} className={`rounded-md border px-1.5 py-0.5 text-[10px] uppercase tracking-wide ${isLight ? "border-slate-200 bg-slate-50 text-slate-500" : "border-slate-700/30 bg-slate-800/30 text-slate-400"}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Notes Tab ── */}
        {nodeTab === "notes" && (
          <>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-[10px] font-medium text-slate-500">Content</label>
              <textarea
                className={`min-h-[200px] flex-1 border px-2.5 py-2 text-sm leading-relaxed ${inputClass}`}
                value={draft?.content ?? ""}
                onChange={(e) => updateNote({ content: e.target.value })}
                placeholder="Write notes about this node... Supports URLs and img: links."
              />
              {(draft?.content ?? "").trim() && (
                <Section title="Preview" defaultOpen={false}>
                  <div className="space-y-1">
                    {(draft?.content ?? "").split("\n").map((line, idx) => renderLine(line, idx))}
                  </div>
                </Section>
              )}
            </div>
            <div className="text-[10px] text-slate-600">
              Updated: {draft?.updatedAt ? new Date(draft.updatedAt).toLocaleString() : "—"}
            </div>
          </>
        )}

        {/* ── Style Tab ── */}
        {nodeTab === "style" && metaDraft && (
          <>
            {/* Color */}
            <div>
              <label className="text-[10px] font-medium text-slate-500">Node Color</label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {PALETTE.map((color) => {
                  const active = currentBaseColor === color;
                  return (
                    <button
                      key={color}
                      className={`h-6 w-6 rounded-full border-2 transition ${
                        active ? "border-white ring-2 ring-brand-500/30 scale-110" : (isLight ? "border-slate-300 hover:border-slate-400" : "border-slate-700/40 hover:border-slate-500")
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => updateMeta({ color })}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ── Comments Tab ── */}
        {nodeTab === "comments" && draft && (
          <CommentsSection noteId={draft.id} />
        )}
      </div>
    </div>
  );
}
