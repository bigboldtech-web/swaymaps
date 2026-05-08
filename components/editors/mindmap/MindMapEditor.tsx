"use client";

import * as React from "react";
import { Handle, Position, type Node, type Edge, type NodeProps } from "reactflow";
import { GraphEditorShell, type GraphAPI, type GraphEditorState } from "../graph/GraphEditorShell";

interface MindNodeData {
  label: string;
  level: 0 | 1 | 2;
}

const LEVEL_STYLE: Record<MindNodeData["level"], { bg: string; ring: string; text: string }> = {
  0: { bg: "var(--color-fg)", ring: "var(--color-fg)", text: "var(--color-fg-inverted)" },
  1: { bg: "var(--color-accent-subtle)", ring: "var(--color-accent)", text: "var(--color-accent)" },
  2: { bg: "var(--color-panel)", ring: "var(--color-border-strong)", text: "var(--color-fg)" },
};

function MindNode({ data, selected }: NodeProps<MindNodeData>) {
  const style = LEVEL_STYLE[data.level];
  const padX = data.level === 0 ? 18 : 14;
  const padY = data.level === 0 ? 12 : 8;
  return (
    <div
      style={{
        background: style.bg,
        color: style.text,
        border: `1.5px solid ${style.ring}`,
        borderRadius: data.level === 0 ? 999 : 8,
        padding: `${padY}px ${padX}px`,
        fontSize: data.level === 0 ? 15 : 13,
        fontWeight: data.level === 0 ? 600 : 500,
        minWidth: 120,
        textAlign: "center",
        boxShadow: selected ? "0 0 0 2px var(--color-accent)" : "var(--shadow-xs)",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      {data.label}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

const nodeTypes = { mind: MindNode };

const cuid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function buildSeed(): GraphEditorState {
  return {
    nodes: [
      {
        id: "root",
        type: "mind",
        position: { x: 0, y: 0 },
        data: { label: "Central topic", level: 0 } as MindNodeData,
      } as Node,
    ],
    edges: [],
  };
}

interface MindMapEditorProps {
  mapId: string;
  initialName: string;
  initialState: GraphEditorState | null;
  onBack?: () => void;
}

export function MindMapEditor({ mapId, initialName, initialState, onBack }: MindMapEditorProps) {
  const seed = React.useMemo(
    () =>
      initialState && initialState.nodes && initialState.nodes.length > 0
        ? initialState
        : buildSeed(),
    [initialState]
  );

  const handleAdd = (api: GraphAPI) => {
    const last = api.nodes.find((n) => (n.data as MindNodeData).level === 1) ?? api.nodes[0];
    const nextLevel: MindNodeData["level"] =
      ((last.data as MindNodeData).level + 1 > 2 ? 2 : ((last.data as MindNodeData).level + 1)) as MindNodeData["level"];
    const id = cuid();
    const newNode: Node = {
      id,
      type: "mind",
      position: { x: last.position.x + 220, y: last.position.y + (Math.random() - 0.5) * 200 },
      data: { label: nextLevel === 1 ? "New branch" : "New idea", level: nextLevel } as MindNodeData,
    };
    api.setNodes((prev) => [...prev, newNode]);
    api.setEdges((prev) => [
      ...prev,
      {
        id: `${last.id}-${id}`,
        source: last.id,
        target: id,
        type: "smoothstep",
        animated: false,
        style: { strokeWidth: 2 },
      } as Edge,
    ]);
  };

  return (
    <GraphEditorShell
      mapId={mapId}
      initialName={initialName}
      initialState={seed}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={{ type: "smoothstep", style: { strokeWidth: 2 } }}
      onAddNode={handleAdd}
      onBack={onBack}
    />
  );
}
