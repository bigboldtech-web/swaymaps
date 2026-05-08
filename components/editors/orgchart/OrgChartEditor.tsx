"use client";

import * as React from "react";
import { Handle, Position, type Node, type Edge, type NodeProps } from "reactflow";
import { GraphEditorShell, type GraphAPI, type GraphEditorState } from "../graph/GraphEditorShell";

interface OrgNodeData {
  name: string;
  title: string;
  level: number;
}

const cuid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function OrgNode({ data, selected }: NodeProps<OrgNodeData>) {
  const initials = (data.name || "?")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        background: "var(--color-panel)",
        border: "1.5px solid var(--color-border-strong)",
        borderRadius: 8,
        padding: 12,
        minWidth: 200,
        boxShadow: selected ? "0 0 0 2px var(--color-accent)" : "var(--shadow-xs)",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0.5 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            height: 32,
            width: 32,
            borderRadius: 999,
            background: "var(--color-bg-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--color-fg)",
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-fg)" }}>
            {data.name || "Untitled"}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-fg-muted)" }}>{data.title}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0.5 }} />
    </div>
  );
}

const nodeTypes = { org: OrgNode };

function buildSeed(): GraphEditorState {
  return {
    nodes: [
      {
        id: "ceo",
        type: "org",
        position: { x: 0, y: 0 },
        data: { name: "Alex Chen", title: "CEO", level: 0 } as OrgNodeData,
      } as Node,
      {
        id: "cto",
        type: "org",
        position: { x: -180, y: 140 },
        data: { name: "Priya Patel", title: "CTO", level: 1 } as OrgNodeData,
      } as Node,
      {
        id: "coo",
        type: "org",
        position: { x: 180, y: 140 },
        data: { name: "Marcus Reed", title: "COO", level: 1 } as OrgNodeData,
      } as Node,
    ],
    edges: [
      { id: "ceo-cto", source: "ceo", target: "cto", type: "smoothstep" } as Edge,
      { id: "ceo-coo", source: "ceo", target: "coo", type: "smoothstep" } as Edge,
    ],
  };
}

interface OrgChartEditorProps {
  mapId: string;
  initialName: string;
  initialState: GraphEditorState | null;
  onBack?: () => void;
}

export function OrgChartEditor({ mapId, initialName, initialState, onBack }: OrgChartEditorProps) {
  const seed = React.useMemo(
    () =>
      initialState && initialState.nodes && initialState.nodes.length > 0
        ? initialState
        : buildSeed(),
    [initialState]
  );

  const handleAdd = (api: GraphAPI) => {
    const id = cuid();
    const lastY = Math.max(...api.nodes.map((n) => n.position.y), 0);
    const newNode: Node = {
      id,
      type: "org",
      position: { x: 0, y: lastY + 140 },
      data: { name: "New person", title: "Role", level: 1 } as OrgNodeData,
    };
    api.setNodes((prev) => [...prev, newNode]);
  };

  return (
    <GraphEditorShell
      mapId={mapId}
      initialName={initialName}
      initialState={seed}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={{ type: "smoothstep", style: { strokeWidth: 1.5 } }}
      onAddNode={handleAdd}
      onBack={onBack}
    />
  );
}
