"use client";

import * as React from "react";
import {
  StickyNote,
  Type,
  Square,
  Circle,
  Pen,
  MousePointer2,
  Frame,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Save,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/lib/cn";
import { toast } from "@/components/ui/Toast";
import {
  type WBObject,
  type WBState,
  type WBSticky,
  type WBText,
  type WBRect,
  type WBEllipse,
  type WBInk,
  type WBFrame,
  STICKY_COLORS,
  emptyState,
} from "./types";

type Tool = "select" | "sticky" | "text" | "rect" | "ellipse" | "pen" | "frame";

interface WhiteboardEditorProps {
  mapId: string;
  initialName: string;
  initialState: WBState | null;
  onBack?: () => void;
}

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3;

export function WhiteboardEditor({
  mapId,
  initialName,
  initialState,
  onBack,
}: WhiteboardEditorProps) {
  const [name, setName] = React.useState(initialName);
  const [state, setState] = React.useState<WBState>(initialState ?? emptyState());
  const [tool, setTool] = React.useState<Tool>("select");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [stickyColor, setStickyColor] = React.useState(STICKY_COLORS[0]);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const drawingRef = React.useRef<{
    object: WBObject;
    start: { x: number; y: number };
  } | null>(null);
  const inkRef = React.useRef<{ id: string; points: { x: number; y: number }[] } | null>(null);
  const dragRef = React.useRef<{
    ids: string[];
    origin: Record<string, { x: number; y: number }>;
    startScreen: { x: number; y: number };
  } | null>(null);
  const panningRef = React.useRef<{ start: { x: number; y: number }; pan0: { x: number; y: number } } | null>(null);

  // Bump z-index helper
  const bumpZ = React.useCallback(() => {
    let next = 0;
    setState((s) => {
      next = s.topZ + 1;
      return { ...s, topZ: next };
    });
    return next;
  }, []);

  // Save to API (auto-save with 1.5s debounce)
  React.useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => save(), 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, dirty]);

  const save = React.useCallback(async () => {
    setSaving(true);
    try {
      await fetch(`/api/maps/${mapId}/canvas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });
      setDirty(false);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [mapId, state]);

  // Convert a screen point to canvas coordinates
  const toCanvas = React.useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (clientX - rect.left - pan.x) / zoom,
        y: (clientY - rect.top - pan.y) / zoom,
      };
    },
    [pan, zoom]
  );

  /* ───── Object helpers ───── */
  const addObject = (obj: WBObject) => {
    setState((s) => ({ ...s, objects: [...s.objects, obj], topZ: Math.max(s.topZ, obj.z) }));
    setDirty(true);
  };
  const updateObject = (id: string, patch: Partial<WBObject>) => {
    setState((s) => ({
      ...s,
      objects: s.objects.map((o) => (o.id === id ? ({ ...o, ...patch } as WBObject) : o)),
    }));
    setDirty(true);
  };
  const deleteObjects = (ids: Set<string>) => {
    if (ids.size === 0) return;
    setState((s) => ({ ...s, objects: s.objects.filter((o) => !ids.has(o.id)) }));
    setSelectedIds(new Set());
    setDirty(true);
  };

  /* ───── Mouse / pointer handlers on the canvas surface ───── */
  const onSurfaceMouseDown = (e: React.MouseEvent) => {
    // Middle-click or space-drag panning is handled separately; left-click on empty surface = tool action
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      panningRef.current = {
        start: { x: e.clientX, y: e.clientY },
        pan0: { ...pan },
      };
      e.preventDefault();
      return;
    }
    if (e.button !== 0) return;

    const point = toCanvas(e.clientX, e.clientY);

    if (tool === "select") {
      // Clicked empty surface: clear selection
      setSelectedIds(new Set());
      return;
    }

    if (tool === "sticky") {
      const obj: WBSticky = {
        id: cuid(),
        type: "sticky",
        x: point.x - 80,
        y: point.y - 60,
        w: 160,
        h: 120,
        z: bumpZ(),
        text: "",
        color: stickyColor,
      };
      addObject(obj);
      setSelectedIds(new Set([obj.id]));
      setTool("select");
      // Focus into the new sticky after mount
      setTimeout(() => {
        const el = document.querySelector<HTMLTextAreaElement>(
          `[data-wb-id="${obj.id}"] textarea`
        );
        el?.focus();
      }, 30);
      return;
    }

    if (tool === "text") {
      const obj: WBText = {
        id: cuid(),
        type: "text",
        x: point.x,
        y: point.y - 12,
        w: 200,
        h: 24,
        z: bumpZ(),
        text: "",
        fontSize: 16,
        weight: 500,
      };
      addObject(obj);
      setSelectedIds(new Set([obj.id]));
      setTool("select");
      setTimeout(() => {
        const el = document.querySelector<HTMLTextAreaElement>(
          `[data-wb-id="${obj.id}"] textarea`
        );
        el?.focus();
      }, 30);
      return;
    }

    if (tool === "rect" || tool === "ellipse" || tool === "frame") {
      const base = {
        id: cuid(),
        x: point.x,
        y: point.y,
        w: 0,
        h: 0,
        z: bumpZ(),
      };
      const obj: WBObject =
        tool === "rect"
          ? { ...base, type: "rect", fill: "#ffffff", stroke: "#71717a", text: "" }
          : tool === "ellipse"
          ? { ...base, type: "ellipse", fill: "#ffffff", stroke: "#71717a", text: "" }
          : { ...base, type: "frame", label: "Frame" };
      drawingRef.current = { object: obj, start: point };
      addObject(obj);
      return;
    }

    if (tool === "pen") {
      const id = cuid();
      const obj: WBInk = {
        id,
        type: "ink",
        x: point.x,
        y: point.y,
        w: 0,
        h: 0,
        z: bumpZ(),
        path: "M0 0",
        stroke: "#09090b",
        strokeWidth: 2,
      };
      addObject(obj);
      inkRef.current = { id, points: [{ x: 0, y: 0 }] };
      return;
    }
  };

  const onSurfaceMouseMove = (e: React.MouseEvent) => {
    // Pan
    if (panningRef.current) {
      setPan({
        x: panningRef.current.pan0.x + (e.clientX - panningRef.current.start.x),
        y: panningRef.current.pan0.y + (e.clientY - panningRef.current.start.y),
      });
      return;
    }

    // Drag-resize when drawing rect/ellipse/frame
    if (drawingRef.current) {
      const point = toCanvas(e.clientX, e.clientY);
      const { object, start } = drawingRef.current;
      const x = Math.min(point.x, start.x);
      const y = Math.min(point.y, start.y);
      const w = Math.abs(point.x - start.x);
      const h = Math.abs(point.y - start.y);
      updateObject(object.id, { x, y, w, h });
      return;
    }

    // Pen draw
    if (inkRef.current) {
      const point = toCanvas(e.clientX, e.clientY);
      const obj = state.objects.find((o) => o.id === inkRef.current!.id) as WBInk | undefined;
      if (!obj) return;
      const rel = { x: point.x - obj.x, y: point.y - obj.y };
      const last = inkRef.current.points[inkRef.current.points.length - 1];
      // Throttle ~ every 3 px
      if (Math.hypot(rel.x - last.x, rel.y - last.y) < 3) return;
      inkRef.current.points.push(rel);
      const path = inkRef.current.points
        .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
        .join(" ");
      const xs = inkRef.current.points.map((p) => p.x);
      const ys = inkRef.current.points.map((p) => p.y);
      const w = Math.max(...xs) - Math.min(...xs);
      const h = Math.max(...ys) - Math.min(...ys);
      updateObject(obj.id, { path, w, h });
      return;
    }

    // Drag selected
    if (dragRef.current) {
      const dx = (e.clientX - dragRef.current.startScreen.x) / zoom;
      const dy = (e.clientY - dragRef.current.startScreen.y) / zoom;
      setState((s) => ({
        ...s,
        objects: s.objects.map((o) => {
          const origin = dragRef.current!.origin[o.id];
          if (!origin) return o;
          return { ...o, x: origin.x + dx, y: origin.y + dy };
        }),
      }));
      setDirty(true);
      return;
    }
  };

  const onSurfaceMouseUp = () => {
    panningRef.current = null;
    drawingRef.current = null;
    inkRef.current = null;
    if (dragRef.current) {
      dragRef.current = null;
    }
    if (tool !== "select") {
      // Stay in tool until user clicks; rect/ellipse/frame done = drop tool
      if (tool === "rect" || tool === "ellipse" || tool === "frame" || tool === "pen") {
        setTool("select");
      }
    }
  };

  /* ───── Object drag start (from inside an object) ───── */
  const onObjectMouseDown = (
    e: React.MouseEvent,
    obj: WBObject,
    additive: boolean
  ) => {
    e.stopPropagation();
    if (tool !== "select") return;
    const isSelected = selectedIds.has(obj.id);
    let newSelection = new Set(selectedIds);
    if (additive) {
      if (isSelected) newSelection.delete(obj.id);
      else newSelection.add(obj.id);
    } else if (!isSelected) {
      newSelection = new Set([obj.id]);
    }
    setSelectedIds(newSelection);

    const origin: Record<string, { x: number; y: number }> = {};
    for (const id of newSelection) {
      const o = state.objects.find((oo) => oo.id === id);
      if (o) origin[id] = { x: o.x, y: o.y };
    }
    dragRef.current = {
      ids: Array.from(newSelection),
      origin,
      startScreen: { x: e.clientX, y: e.clientY },
    };
  };

  /* ───── Wheel zoom ───── */
  const onWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) {
      // Normal scroll = pan
      setPan((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
      return;
    }
    e.preventDefault();
    const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * (e.deltaY < 0 ? 1.1 : 0.9)));
    // Zoom toward cursor
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const ratio = next / zoom;
    setPan((p) => ({
      x: cx - ratio * (cx - p.x),
      y: cy - ratio * (cy - p.y),
    }));
    setZoom(next);
  };

  /* ───── Keyboard ───── */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT")) return;
      if (e.key === "Backspace" || e.key === "Delete") {
        if (selectedIds.size > 0) {
          deleteObjects(selectedIds);
          e.preventDefault();
        }
      } else if (e.key === "v" || e.key === "Escape") {
        setTool("select");
      } else if (e.key === "n") setTool("sticky");
      else if (e.key === "t") setTool("text");
      else if (e.key === "r") setTool("rect");
      else if (e.key === "o") setTool("ellipse");
      else if (e.key === "p") setTool("pen");
      else if (e.key === "f") setTool("frame");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds]);

  /* ───── Rename ───── */
  const renameMap = async (newName: string) => {
    setName(newName);
    await fetch(`/api/maps/${mapId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
  };

  return (
    <div className="flex h-screen w-full flex-col bg-bg text-fg">
      {/* Top bar */}
      <header className="flex h-12 items-center justify-between border-b border-border bg-bg px-3">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Back"
              onClick={onBack}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          )}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v && v !== initialName) renameMap(v);
            }}
            className="bg-transparent border-0 text-sm font-medium text-fg focus:outline-none focus:ring-0 w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          {saving ? (
            <span className="text-xs text-fg-muted inline-flex items-center gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving…
            </span>
          ) : dirty ? (
            <span className="text-xs text-fg-muted">Unsaved</span>
          ) : (
            <span className="text-xs text-fg-subtle">Saved</span>
          )}
          <Button variant="outline" size="sm" icon={<Save />} onClick={save}>
            Save
          </Button>
        </div>
      </header>

      {/* Floating toolbar */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 rounded-md border border-border bg-panel p-1 shadow-overlay">
        <ToolButton tool="select" active={tool === "select"} onClick={() => setTool("select")} icon={<MousePointer2 />} label="Select · V" />
        <Separator orientation="vertical" className="h-5" />
        <ToolButton tool="sticky" active={tool === "sticky"} onClick={() => setTool("sticky")} icon={<StickyNote />} label="Sticky · N" />
        <ToolButton tool="text" active={tool === "text"} onClick={() => setTool("text")} icon={<Type />} label="Text · T" />
        <ToolButton tool="rect" active={tool === "rect"} onClick={() => setTool("rect")} icon={<Square />} label="Rectangle · R" />
        <ToolButton tool="ellipse" active={tool === "ellipse"} onClick={() => setTool("ellipse")} icon={<Circle />} label="Ellipse · O" />
        <ToolButton tool="pen" active={tool === "pen"} onClick={() => setTool("pen")} icon={<Pen />} label="Pen · P" />
        <ToolButton tool="frame" active={tool === "frame"} onClick={() => setTool("frame")} icon={<Frame />} label="Frame · F" />
        {tool === "sticky" && (
          <>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-1 px-1">
              {STICKY_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={cn(
                    "h-5 w-5 rounded-xs border border-border",
                    stickyColor === c && "ring-2 ring-fg"
                  )}
                  style={{ background: c }}
                  onClick={() => setStickyColor(c)}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </>
        )}
        {selectedIds.size > 0 && (
          <>
            <Separator orientation="vertical" className="h-5" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete"
                  onClick={() => deleteObjects(selectedIds)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-danger" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete · Del</TooltipContent>
            </Tooltip>
          </>
        )}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 z-30 flex items-center gap-1 rounded-md border border-border bg-panel p-1 shadow-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z * 0.9))}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom out</TooltipContent>
        </Tooltip>
        <span className="text-xs text-fg-muted px-1 tabular-nums w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z * 1.1))}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom in</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset view</TooltipContent>
        </Tooltip>
      </div>

      {/* Canvas surface */}
      <div
        ref={containerRef}
        className={cn(
          "relative flex-1 overflow-hidden bg-bg-subtle",
          tool === "select" ? "cursor-default" : "cursor-crosshair",
          panningRef.current && "cursor-grabbing"
        )}
        onMouseDown={onSurfaceMouseDown}
        onMouseMove={onSurfaceMouseMove}
        onMouseUp={onSurfaceMouseUp}
        onMouseLeave={onSurfaceMouseUp}
        onWheel={onWheel}
      >
        {/* Grid background */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)",
            backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        />
        {/* World */}
        <div
          className="absolute top-0 left-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            width: 1,
            height: 1,
          }}
        >
          {state.objects
            .slice()
            .sort((a, b) => a.z - b.z)
            .map((obj) => (
              <RenderObject
                key={obj.id}
                obj={obj}
                selected={selectedIds.has(obj.id)}
                onMouseDown={(e) => onObjectMouseDown(e, obj, e.shiftKey)}
                onChange={(patch) => updateObject(obj.id, patch)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function ToolButton({
  active,
  onClick,
  icon,
  label,
}: {
  tool: Tool;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={active ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={onClick}
          className={cn("h-7 w-7", active && "bg-fg text-fg-inverted hover:bg-fg/90")}
        >
          <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">{icon}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function RenderObject({
  obj,
  selected,
  onMouseDown,
  onChange,
}: {
  obj: WBObject;
  selected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onChange: (patch: Partial<WBObject>) => void;
}) {
  const selectionStyle = selected ? { boxShadow: "0 0 0 2px var(--color-accent)" } : {};

  if (obj.type === "sticky") {
    const o = obj as WBSticky;
    return (
      <div
        data-wb-id={o.id}
        className="absolute"
        style={{
          left: o.x,
          top: o.y,
          width: o.w,
          height: o.h,
          background: o.color,
          borderRadius: 4,
          padding: 12,
          fontSize: 14,
          color: "#09090b",
          boxShadow: selected
            ? "0 0 0 2px var(--color-accent), 0 4px 12px rgba(0,0,0,0.10)"
            : "0 4px 12px rgba(0,0,0,0.10)",
          cursor: "move",
        }}
        onMouseDown={onMouseDown}
      >
        <textarea
          value={o.text}
          onChange={(e) => onChange({ text: e.target.value } as Partial<WBSticky>)}
          onMouseDown={(e) => e.stopPropagation()}
          placeholder="Type…"
          className="w-full h-full resize-none bg-transparent border-0 outline-none text-sm placeholder:text-black/40"
        />
      </div>
    );
  }

  if (obj.type === "text") {
    const o = obj as WBText;
    return (
      <div
        data-wb-id={o.id}
        className="absolute"
        style={{
          left: o.x,
          top: o.y,
          minWidth: o.w,
          minHeight: o.h,
          ...selectionStyle,
        }}
        onMouseDown={onMouseDown}
      >
        <textarea
          value={o.text}
          onChange={(e) => onChange({ text: e.target.value } as Partial<WBText>)}
          onMouseDown={(e) => e.stopPropagation()}
          placeholder="Text…"
          className="bg-transparent border-0 outline-none resize-none text-fg whitespace-pre"
          style={{
            fontSize: o.fontSize,
            fontWeight: o.weight,
            lineHeight: 1.4,
            width: Math.max(o.w, 100),
            height: Math.max(o.h, 24),
          }}
        />
      </div>
    );
  }

  if (obj.type === "rect") {
    const o = obj as WBRect;
    return (
      <div
        data-wb-id={o.id}
        className="absolute flex items-center justify-center text-center"
        style={{
          left: o.x,
          top: o.y,
          width: o.w,
          height: o.h,
          background: o.fill,
          border: `1.5px solid ${o.stroke}`,
          borderRadius: 4,
          ...selectionStyle,
          cursor: "move",
        }}
        onMouseDown={onMouseDown}
      >
        <textarea
          value={o.text ?? ""}
          onChange={(e) => onChange({ text: e.target.value } as Partial<WBRect>)}
          onMouseDown={(e) => e.stopPropagation()}
          placeholder=""
          className="w-full h-full resize-none bg-transparent border-0 outline-none text-sm text-fg text-center p-2"
        />
      </div>
    );
  }

  if (obj.type === "ellipse") {
    const o = obj as WBEllipse;
    return (
      <div
        data-wb-id={o.id}
        className="absolute flex items-center justify-center"
        style={{
          left: o.x,
          top: o.y,
          width: o.w,
          height: o.h,
          background: o.fill,
          border: `1.5px solid ${o.stroke}`,
          borderRadius: "50%",
          ...selectionStyle,
          cursor: "move",
        }}
        onMouseDown={onMouseDown}
      >
        <textarea
          value={o.text ?? ""}
          onChange={(e) => onChange({ text: e.target.value } as Partial<WBEllipse>)}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-full h-full resize-none bg-transparent border-0 outline-none text-sm text-fg text-center p-2"
        />
      </div>
    );
  }

  if (obj.type === "ink") {
    const o = obj as WBInk;
    return (
      <svg
        data-wb-id={o.id}
        className="absolute pointer-events-auto"
        style={{
          left: o.x - 10,
          top: o.y - 10,
          width: o.w + 20,
          height: o.h + 20,
          overflow: "visible",
        }}
        onMouseDown={onMouseDown}
      >
        <path
          d={o.path}
          stroke={o.stroke}
          strokeWidth={o.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          transform="translate(10, 10)"
        />
        {selected && (
          <rect
            x={5}
            y={5}
            width={o.w + 10}
            height={o.h + 10}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        )}
      </svg>
    );
  }

  if (obj.type === "frame") {
    const o = obj as WBFrame;
    return (
      <div
        data-wb-id={o.id}
        className="absolute"
        style={{
          left: o.x,
          top: o.y,
          width: o.w,
          height: o.h,
          border: "1.5px dashed var(--color-fg-muted)",
          borderRadius: 4,
          ...selectionStyle,
          cursor: "move",
        }}
        onMouseDown={onMouseDown}
      >
        <div className="absolute -top-6 left-0 text-xs font-medium text-fg-muted">
          {o.label}
        </div>
      </div>
    );
  }

  return null;
}

function cuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
