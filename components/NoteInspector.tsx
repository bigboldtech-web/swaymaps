"use client";

import React from "react";
import { MapEdgeMeta, MapNodeMeta, Note } from "../types/map";

interface NoteInspectorProps {
  selectedNote: Note | null;
  selectedMeta: MapNodeMeta | null;
  selectedEdge: MapEdgeMeta | null;
  selectedEdgeNote: Note | null;
  onChange: (note: Note) => void;
  onUpdateTags: (tags: string[]) => void;
  onUpdateMeta: (meta: MapNodeMeta) => void;
  onUpdateEdge: (edge: MapEdgeMeta) => void;
  onUpdateNodeColor: (color: string) => void;
  onFocusNode?: (nodeId: string) => void;
  onNoSelectionMessage?: string;
}

function parseTagsInput(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
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
    const [, alt, url] = mdImage;
    return (
      <div key={index} className="my-2">
        <img src={url} alt={alt || "image"} className="max-h-64 w-full rounded-md object-cover" />
      </div>
    );
  }

  const parts: (string | JSX.Element)[] = [];
  urlRegex.lastIndex = 0;
  let lastIndex = 0;
  let match;
  while ((match = urlRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={`${index}-${match.index}`}
        href={match[0]}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline"
      >
        {match[0]}
      </a>
    );
    lastIndex = urlRegex.lastIndex;
  }
  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return (
    <p
      key={index}
      className={`text-sm leading-relaxed break-words break-all ${
        typeof document !== "undefined" && document.documentElement.classList.contains("dark")
          ? "text-slate-100"
          : "text-slate-800"
      }`}
    >
      {parts.length ? parts : line}
    </p>
  );
}

export default function NoteInspector({
  selectedNote,
  selectedMeta,
  selectedEdge,
  selectedEdgeNote,
  onChange,
  onUpdateTags,
  onUpdateMeta,
  onUpdateEdge,
  onUpdateNodeColor,
  onFocusNode,
  onNoSelectionMessage
}: NoteInspectorProps) {
  const [draft, setDraft] = React.useState<Note | null>(selectedNote);
  const [tagInput, setTagInput] = React.useState(
    selectedNote ? selectedNote.tags.join(", ") : ""
  );
  const [metaDraft, setMetaDraft] = React.useState<MapNodeMeta | null>(selectedMeta);
  const [edgeNoteDraft, setEdgeNoteDraft] = React.useState<Note | null>(selectedEdgeNote);
  const [edgeDraft, setEdgeDraft] = React.useState<MapEdgeMeta | null>(selectedEdge);
  const [commentAuthor, setCommentAuthor] = React.useState("");
  const [commentText, setCommentText] = React.useState("");

  React.useEffect(() => {
    setDraft(selectedNote ? { ...selectedNote, comments: selectedNote.comments ?? [] } : selectedNote);
    setTagInput(selectedNote ? selectedNote.tags.join(", ") : "");
    setMetaDraft(selectedMeta);
  }, [selectedNote, selectedMeta]);

  React.useEffect(() => {
    setEdgeNoteDraft(selectedEdgeNote);
    setEdgeDraft(selectedEdge);
  }, [selectedEdgeNote, selectedEdge]);

  const updateNote = (changes: Partial<Note>) => {
    if (!draft) return;
    const next: Note = {
      ...draft,
      ...changes,
      updatedAt: new Date().toISOString()
    };
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

  const handleAddComment = () => {
    if (!draft || !commentText.trim()) return;
    const newComment = {
      id: crypto.randomUUID ? crypto.randomUUID() : `c-${Date.now()}`,
      author: commentAuthor.trim() || "Anonymous",
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    };
    const comments = [...(draft.comments ?? []), newComment];
    updateNote({ comments });
    setCommentText("");
  };

  const handleKindLabelChange = (value: string) => {
    if (!metaDraft) return;
    const nextMeta = { ...metaDraft, kindLabel: value };
    setMetaDraft(nextMeta);
    onUpdateMeta(nextMeta);
  };

  const handleColorChange = (color: string) => {
    if (!metaDraft) return;
    const nextMeta = { ...metaDraft, color };
    setMetaDraft(nextMeta);
    onUpdateNodeColor(color);
  };

  const updateEdgeNote = (changes: Partial<Note>) => {
    if (!edgeNoteDraft) return;
    const next: Note = {
      ...edgeNoteDraft,
      ...changes,
      updatedAt: new Date().toISOString()
    };
    setEdgeNoteDraft(next);
    onChange(next);
  };

  const handleEdgeLabelChange = (label: string) => {
    if (!edgeDraft) return;
    const next = { ...edgeDraft, label };
    setEdgeDraft(next);
    onUpdateEdge(next);
  };

  const handleEdgeTypeChange = (edgeType: MapEdgeMeta["edgeType"]) => {
    if (!edgeDraft) return;
    const next = { ...edgeDraft, edgeType };
    setEdgeDraft(next);
    onUpdateEdge(next);
  };

  const pinLabel = React.useMemo(() => {
    if (!metaDraft) return "";
    const pinTag = metaDraft.tags.find((t) => t.startsWith("__pin:"));
    return pinTag ? pinTag.replace("__pin:", "") : "";
  }, [metaDraft]);

  const handlePinChange = (value: string) => {
    if (!metaDraft) return;
    const cleaned = metaDraft.tags.filter((t) => !t.startsWith("__pin:"));
    const nextTags = value.trim() ? [...cleaned, `__pin:${value.trim()}`] : cleaned;
    const nextMeta = { ...metaDraft, tags: nextTags };
    setMetaDraft(nextMeta);
    onUpdateMeta(nextMeta);
  };
  const pinEnabled = Boolean(pinLabel);

  const handlePinToggle = (enabled: boolean) => {
    if (!metaDraft) return;
    if (enabled) {
      const fallback = metaDraft.kindLabel || metaDraft.title || "Pinned";
      handlePinChange(pinLabel || fallback);
    } else {
      handlePinChange("");
    }
  };

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  const shell = isDark ? "bg-[#040915] text-slate-100 border-[#0f172a]" : "bg-white text-slate-900 border-slate-200";
  const muted = isDark ? "text-slate-400" : "text-slate-600";
  const input = isDark ? "border-[#0f172a] bg-[#0b1422] text-slate-100" : "border-slate-200 bg-white text-slate-800";

  if (!draft && !edgeNoteDraft) {
    return (
      <div className={`flex h-full flex-col items-center justify-center px-6 text-center ${muted}`}>
        <div className="text-lg font-semibold">{onNoSelectionMessage ? "Notice" : "No node selected"}</div>
        <p className="text-sm">
          {onNoSelectionMessage ?? "Click a node on the map to view or edit its note."}
        </p>
      </div>
    );
  }

  if (edgeNoteDraft && edgeDraft) {
    return (
      <div className={`flex h-full flex-col gap-4 p-4 ${shell}`}>
        <div>
          <div className={`text-xs uppercase tracking-wide ${muted}`}>Edge label</div>
          <input
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm font-semibold outline-none ring-0 focus:border-sky-500 ${input}`}
            value={edgeDraft.label ?? ""}
            onChange={(e) => handleEdgeLabelChange(e.target.value)}
            placeholder="Relationship label"
          />
        </div>

        <div>
          <label className={`text-xs uppercase tracking-wide ${muted}`}>Edge type</label>
          <select
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm font-semibold shadow-sm ${input}`}
            value={edgeDraft.edgeType ?? "smoothstep"}
            onChange={(e) => handleEdgeTypeChange(e.target.value as MapEdgeMeta["edgeType"])}
          >
            <option value="smoothstep">Rounded</option>
            <option value="default">Curved</option>
            <option value="straight">Straight</option>
            <option value="step">Step</option>
          </select>
        </div>

        <div>
          <label className={`text-xs uppercase tracking-wide ${muted}`}>Title</label>
          <input
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm font-semibold outline-none ring-0 focus:border-sky-500 ${input}`}
            value={edgeNoteDraft.title}
            onChange={(e) => updateEdgeNote({ title: e.target.value })}
          />
        </div>

        <div>
          <label className={`text-xs uppercase tracking-wide ${muted}`}>Tags</label>
          <input
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-sky-500 ${input}`}
            placeholder="ops, vendor, priority"
            value={edgeNoteDraft.tags.join(", ")}
            onChange={(e) => updateEdgeNote({ tags: parseTagsInput(e.target.value) })}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {edgeNoteDraft.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide ${
                  isDark ? "border-slate-700 bg-slate-800 text-slate-200" : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <label className={`text-xs uppercase tracking-wide ${muted}`}>Content</label>
          <textarea
            className={`min-h-[150px] flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-sky-500 ${input}`}
            value={edgeNoteDraft.content}
            onChange={(e) => updateEdgeNote({ content: e.target.value })}
          />
          <div className={`rounded-lg border p-3 ${isDark ? "border-[#0f172a] bg-[#0b1422]" : "border-slate-200 bg-slate-50"}`}>
            <div className={`text-xs uppercase tracking-wide ${muted}`}>Preview</div>
            <div className="mt-2 space-y-2">
              {edgeNoteDraft.content.split("\n").map((line, idx) => renderLine(line, idx))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const baseDefaults: Record<NonNullable<MapNodeMeta["kind"]>, string> = {
    person: "#38bdf8",
    system: "#22c55e",
    process: "#fbbf24",
    generic: "#6366f1"
  };

  const darkenColor = (hex: string, factor = 0.85) => {
    const h = hex.replace("#", "");
    if (h.length !== 6) return hex;
    const num = parseInt(h, 16);
    const r = Math.max(0, Math.floor(((num >> 16) & 255) * factor));
    const g = Math.max(0, Math.floor(((num >> 8) & 255) * factor));
    const b = Math.max(0, Math.floor((num & 255) * factor));
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  };

  const pastelize = (hex: string, mix = 0.8) => {
    const h = hex.replace("#", "");
    if (h.length !== 6) return hex;
    const num = parseInt(h, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    const blend = (channel: number) =>
      Math.round(channel * (1 - mix) + 255 * mix)
        .toString(16)
        .padStart(2, "0");
    return `#${blend(r)}${blend(g)}${blend(b)}`;
  };

  const currentBaseColor =
    metaDraft?.kind ? metaDraft.color || baseDefaults[metaDraft.kind] : undefined;
  const grayHex = "#9ca3af";
  const paletteColors = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ec4899",
    "#8b5cf6",
    "#ef4444",
    "#0ea5e9",
    "#f97316",
    "#6366f1",
    "#14b8a6",
    grayHex
  ];

  return (
    <div className={`flex h-full flex-col gap-4 p-4 ${shell}`}>
      {metaDraft && (
        <>
          <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <div>
              <div className={`text-xs uppercase tracking-wide ${muted}`}>Pin this node</div>
              <div className="text-sm font-semibold">{pinEnabled ? "Visible in Focus menu" : "Not pinned"}</div>
            </div>
            <button
              className={`h-6 w-11 rounded-full border transition ${
                pinEnabled
                  ? isDark
                    ? "border-sky-500 bg-sky-500/30"
                    : "border-sky-400 bg-sky-100"
                  : isDark
                  ? "border-slate-700 bg-slate-800"
                  : "border-slate-200 bg-slate-100"
              }`}
              onClick={() => handlePinToggle(!pinEnabled)}
              aria-label="Toggle pin"
            >
              <div
                className={`h-5 w-5 rounded-full bg-white shadow transition ${
                  pinEnabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {pinEnabled && (
            <div>
              <div className={`text-xs uppercase tracking-wide ${muted}`}>Pin label</div>
              <input
                className={`mt-1 w-full rounded-md border px-3 py-2 text-sm font-semibold outline-none ring-0 focus:border-sky-500 ${input}`}
                value={pinLabel}
                onChange={(e) => handlePinChange(e.target.value)}
                placeholder="e.g., Critical path"
              />
              {pinLabel && (
                <div className={`mt-1 text-xs ${muted}`}>Use Pins dropdown to focus</div>
              )}
            </div>
          )}

          <div>
            <label className={`text-xs uppercase tracking-wide ${muted}`}>Type label</label>
            <input
              className={`mt-1 w-full rounded-md border px-3 py-2 text-sm font-semibold outline-none ring-0 focus:border-sky-500 ${input}`}
              value={metaDraft.kindLabel}
              onChange={(e) => handleKindLabelChange(e.target.value)}
            />
          </div>
        </>
      )}

      {metaDraft && (
        <div>
          <label className={`text-xs uppercase tracking-wide ${muted}`}>Node color</label>
          <div className="mt-2 grid grid-cols-11 gap-2">
            {paletteColors.map((color) => {
              const display = isDark ? darkenColor(color) : color === grayHex ? color : pastelize(color);
              const active = (currentBaseColor ?? "") === color;
              return (
              <button
                  key={color}
                  className={`h-7 w-7 rounded-full border ${
                    active
                      ? "border-blue-500 ring-2 ring-blue-300"
                      : isDark
                      ? "border-slate-700"
                      : "border-slate-200"
                  }`}
                  style={{ backgroundColor: display }}
                  onClick={() => handleColorChange(color)}
                  aria-label={`Set color ${color}`}
                />
              );
            })}
          </div>
        </div>
      )}

      <div>
        <label className={`text-xs uppercase tracking-wide ${muted}`}>Title</label>
        <input
          className={`mt-1 w-full rounded-md border px-3 py-2 text-sm font-semibold outline-none ring-0 focus:border-sky-500 ${input}`}
          value={draft?.title ?? ""}
          onChange={(e) => updateNote({ title: e.target.value })}
        />
      </div>

      <div>
        <label className={`text-xs uppercase tracking-wide ${muted}`}>Tags</label>
        <input
          className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-sky-500 ${input}`}
          placeholder="ops, vendor, priority"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onBlur={handleTagBlur}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {(draft?.tags ?? []).map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] uppercase tracking-wide ${
                isDark ? "border-slate-700 bg-slate-800 text-slate-200" : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <label className={`text-xs uppercase tracking-wide ${muted}`}>Content</label>
        <textarea
          className={`min-h-[150px] flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-sky-500 ${input}`}
          value={draft?.content ?? ""}
          onChange={(e) => updateNote({ content: e.target.value })}
        />
        <div className={`rounded-lg border p-3 ${isDark ? "border-[#0f172a] bg-[#0b1422]" : "border-slate-200 bg-slate-50"}`}>
          <div className={`text-xs uppercase tracking-wide ${muted}`}>Preview</div>
          <div className="mt-2 space-y-2">
            {(draft?.content ?? "").split("\n").map((line, idx) => renderLine(line, idx))}
          </div>
        </div>
      </div>

      <div className={`text-xs ${muted}`}>
        Updated at: {draft?.updatedAt ? new Date(draft.updatedAt).toLocaleString() : "-"}
      </div>

      <div className={`mt-2 rounded-lg border p-3 ${isDark ? "border-[#0f172a] bg-[#0b1422]" : "border-slate-200 bg-slate-50"}`}>
        <div className="flex items-center justify-between gap-2">
          <div className={`text-xs uppercase tracking-wide ${muted}`}>Comments</div>
        </div>
        <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1">
          {(draft?.comments ?? []).length === 0 && (
            <div className={`text-xs ${muted}`}>No comments yet.</div>
          )}
          {(draft?.comments ?? []).map((c) => (
            <div key={c.id} className={`rounded-md border px-3 py-2 ${isDark ? "border-slate-800 bg-[#0f1422]" : "border-slate-200 bg-white"}`}>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={isDark ? "text-slate-100" : "text-slate-800"}>{c.author || "Anonymous"}</span>
                <span className={muted}>{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <div className={`mt-1 text-sm ${isDark ? "text-slate-100" : "text-slate-800"}`}>{c.text}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          <input
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-sky-500 ${input}`}
            placeholder="Your name (optional)"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
          />
          <textarea
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-sky-500 ${input}`}
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            className={`w-full rounded-md px-3 py-2 text-sm font-semibold text-white ${
              isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-900 hover:bg-slate-800"
            }`}
            onClick={handleAddComment}
          >
            Add comment
          </button>
        </div>
      </div>
    </div>
  );
}
