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
    <p key={index} className="text-sm leading-relaxed text-slate-800">
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
  onNoSelectionMessage
}: NoteInspectorProps) {
  const [draft, setDraft] = React.useState<Note | null>(selectedNote);
  const [tagInput, setTagInput] = React.useState(
    selectedNote ? selectedNote.tags.join(", ") : ""
  );
  const [metaDraft, setMetaDraft] = React.useState<MapNodeMeta | null>(selectedMeta);
  const [edgeNoteDraft, setEdgeNoteDraft] = React.useState<Note | null>(selectedEdgeNote);
  const [edgeDraft, setEdgeDraft] = React.useState<MapEdgeMeta | null>(selectedEdge);

  React.useEffect(() => {
    setDraft(selectedNote);
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
    setDraft(next);
    onChange(next);
  };

  const handleTagBlur = () => {
    if (!draft) return;
    const tags = parseTagsInput(tagInput);
    updateNote({ tags });
    onUpdateTags(tags);
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

  if (!draft && !edgeNoteDraft) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center text-slate-600">
        <div className="text-lg font-semibold text-slate-900">No node selected</div>
        <p className="text-sm">
          {onNoSelectionMessage ?? "Click a node on the map to view or edit its note."}
        </p>
      </div>
    );
  }

  if (edgeNoteDraft && edgeDraft) {
    return (
      <div className="flex h-full flex-col gap-4 p-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Edge label</div>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 outline-none ring-0 focus:border-slate-300 focus:bg-white"
            value={edgeDraft.label ?? ""}
            onChange={(e) => handleEdgeLabelChange(e.target.value)}
            placeholder="Relationship label"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500">Title</label>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 outline-none ring-0 focus:border-slate-300 focus:bg-white"
            value={edgeNoteDraft.title}
            onChange={(e) => updateEdgeNote({ title: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500">Tags</label>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-300 focus:bg-white"
            placeholder="ops, vendor, priority"
            value={edgeNoteDraft.tags.join(", ")}
            onChange={(e) => updateEdgeNote({ tags: parseTagsInput(e.target.value) })}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {edgeNoteDraft.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <label className="text-xs uppercase tracking-wide text-slate-500">Content</label>
          <textarea
            className="min-h-[150px] flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-300"
            value={edgeNoteDraft.content}
            onChange={(e) => updateEdgeNote({ content: e.target.value })}
          />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs uppercase tracking-wide text-slate-500">Preview</div>
            <div className="mt-2 space-y-2">
              {edgeNoteDraft.content.split("\n").map((line, idx) => renderLine(line, idx))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      {metaDraft && (
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500">Type label</label>
          <input
            className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 outline-none ring-0 focus:border-slate-300 focus:bg-white"
            value={metaDraft.kindLabel}
            onChange={(e) => handleKindLabelChange(e.target.value)}
          />
        </div>
      )}

      {metaDraft && (
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500">Node color</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {["#dbeafe", "#dcfce7", "#fef9c3", "#fee2e2", "#f3f4f6"].map((color) => (
              <button
                key={color}
                className={`h-7 w-7 rounded-full border ${metaDraft.color === color ? "border-blue-500 ring-2 ring-blue-300" : "border-slate-200"}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
                aria-label={`Set color ${color}`}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="text-xs uppercase tracking-wide text-slate-500">Title</label>
        <input
          className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-900 outline-none ring-0 focus:border-slate-300 focus:bg-white"
          value={draft.title}
          onChange={(e) => updateNote({ title: e.target.value })}
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-wide text-slate-500">Tags</label>
        <input
          className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-300 focus:bg-white"
          placeholder="ops, vendor, priority"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onBlur={handleTagBlur}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {draft.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <label className="text-xs uppercase tracking-wide text-slate-500">Content</label>
        <textarea
          className="min-h-[150px] flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-300"
          value={draft.content}
          onChange={(e) => updateNote({ content: e.target.value })}
        />
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="text-xs uppercase tracking-wide text-slate-500">Preview</div>
          <div className="mt-2 space-y-2">
            {draft.content.split("\n").map((line, idx) => renderLine(line, idx))}
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500">
        Updated at: {new Date(draft.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}
