"use client";

import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

// Simple node component for embed
function EmbedNode({ data }: any) {
  const kindColors: Record<string, string> = {
    person: "#38bdf8",
    system: "#22c55e",
    process: "#fbbf24",
    database: "#6366f1",
    api: "#0ea5e9",
    queue: "#f59e0b",
    cache: "#ef4444",
    cloud: "#8b5cf6",
    team: "#14b8a6",
    vendor: "#f97316",
    generic: "#6366f1",
  };
  const color =
    data.meta?.color || kindColors[data.meta?.kind] || "#6366f1";

  return (
    <div
      style={{ borderColor: color + "40" }}
      className="rounded-xl border bg-slate-900/80 backdrop-blur-md px-4 py-3 shadow-lg min-w-[180px]"
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          style={{ backgroundColor: color }}
          className="h-2.5 w-2.5 rounded-full"
        />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {data.meta?.kindLabel || data.meta?.kind}
        </span>
      </div>
      <div className="text-sm font-semibold text-slate-100">
        {data.meta?.title || "Untitled"}
      </div>
      {data.meta?.tags?.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {data.meta.tags.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="rounded-full bg-slate-800/60 px-2 py-0.5 text-[9px] text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { decodeNode: EmbedNode };

export default function EmbedPage({
  params,
}: {
  params: { token: string };
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [mapName, setMapName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsEmbed(
        new URLSearchParams(window.location.search).get("embed") === "true"
      );
    }
  }, []);

  useEffect(() => {
    async function loadMap() {
      try {
        const res = await fetch(`/api/maps/share/${params.token}`);
        if (!res.ok) {
          setError("Map not found or not public");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setMapName(data.name || "Untitled Map");

        const flowNodes = (data.nodes || []).map((n: any) => ({
          id: n.id,
          type: "decodeNode",
          position: {
            x: n.posX ?? n.position?.x ?? 0,
            y: n.posY ?? n.position?.y ?? 0,
          },
          data: {
            meta: {
              title: n.title,
              kind: n.kind,
              kindLabel: n.kindLabel,
              tags:
                typeof n.tags === "string"
                  ? n.tags.split(",").filter(Boolean)
                  : n.tags || [],
              color: n.color,
            },
          },
          draggable: false,
          selectable: false,
        }));

        const flowEdges = (data.edges || []).map((e: any) => ({
          id: e.id,
          source: e.sourceNodeId || e.sourceId,
          target: e.targetNodeId || e.targetId,
          sourceHandle: e.sourceHandle || null,
          targetHandle: e.targetHandle || null,
          label: e.label || undefined,
          markerEnd: { type: MarkerType.ArrowClosed, color: "#64748b" },
          style: { stroke: "#64748b", strokeWidth: 1.5 },
          labelStyle: { fill: "#94a3b8", fontSize: 11 },
          labelBgStyle: { fill: "#0f172a", fillOpacity: 0.8 },
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
      } catch {
        setError("Failed to load map");
      } finally {
        setLoading(false);
      }
    }
    loadMap();
  }, [params.token]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="h-8 w-8 animate-spin text-sky-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm text-slate-400">Loading map...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#030712]">
        <div className="rounded-xl border border-slate-700/40 bg-slate-900/80 p-8 text-center">
          <div className="text-lg font-semibold text-slate-200">
            Map Unavailable
          </div>
          <p className="mt-2 text-sm text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#030712] relative">
      {/* Header - hidden in embed mode */}
      {!isEmbed && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-slate-900/90 to-transparent">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
              <svg
                className="h-3.5 w-3.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-200">
              {mapName}
            </span>
          </div>
          <a
            href="/"
            target="_blank"
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            Open in SwayMaps
          </a>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        zoomOnScroll={true}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls
          position="bottom-left"
          className="!bg-slate-900/80 !border-slate-700/40 !rounded-lg !shadow-lg [&>button]:!bg-slate-800/60 [&>button]:!border-slate-700/40 [&>button]:!text-slate-300 [&>button:hover]:!bg-slate-700/60"
        />
      </ReactFlow>

      {/* Powered by badge */}
      <div className="absolute bottom-3 right-3 z-10">
        <a
          href="https://swaymaps.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-slate-700/40 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1.5 text-[10px] text-slate-400 transition hover:text-slate-200 hover:border-slate-600"
        >
          <div className="h-3.5 w-3.5 rounded bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
            <svg
              className="h-2 w-2 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          Powered by SwayMaps
        </a>
      </div>
    </div>
  );
}
