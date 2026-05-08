"use client";

import * as React from "react";
import { Handle, Position, type Node, type Edge, type NodeProps } from "reactflow";
import { GraphEditorShell, type GraphAPI, type GraphEditorState } from "../graph/GraphEditorShell";
import { Smartphone, Monitor, Mail, AlertCircle } from "lucide-react";

type ScreenKind = "mobile" | "web" | "email" | "modal";

interface ScreenNodeData {
  title: string;
  description: string;
  kind: ScreenKind;
  state?: string;
}

const KIND_META: Record<ScreenKind, { icon: typeof Smartphone; label: string; color: string }> = {
  mobile: { icon: Smartphone, label: "Mobile", color: "var(--color-accent)" },
  web: { icon: Monitor, label: "Web", color: "var(--color-info)" },
  email: { icon: Mail, label: "Email", color: "var(--color-success)" },
  modal: { icon: AlertCircle, label: "Modal", color: "var(--color-warning)" },
};

const cuid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function ScreenNode({ data, selected }: NodeProps<ScreenNodeData>) {
  const meta = KIND_META[data.kind];
  const Icon = meta.icon;
  return (
    <div
      style={{
        width: 220,
        background: "var(--color-panel)",
        border: "1.5px solid var(--color-border-strong)",
        borderRadius: 10,
        boxShadow: selected ? "0 0 0 2px var(--color-accent), var(--shadow-sm)" : "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0.4 }} />

      {/* Phone-style header */}
      <div
        style={{
          background: meta.color,
          color: "white",
          padding: "8px 12px",
          fontSize: 11,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Icon size={12} />
        <span>{meta.label}</span>
        {data.state && (
          <span
            style={{
              marginLeft: "auto",
              background: "rgba(255,255,255,0.2)",
              padding: "1px 6px",
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 500,
            }}
          >
            {data.state}
          </span>
        )}
      </div>

      {/* Screen body */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-fg)",
            marginBottom: 4,
          }}
        >
          {data.title}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--color-fg-muted)",
            lineHeight: 1.5,
            minHeight: 30,
          }}
        >
          {data.description || "Describe what happens on this screen."}
        </div>
      </div>

      <Handle type="source" position={Position.Right} style={{ opacity: 0.4 }} />
    </div>
  );
}

const nodeTypes = { screen: ScreenNode };

function buildSeed(): GraphEditorState {
  return {
    nodes: [
      {
        id: "splash",
        type: "screen",
        position: { x: 0, y: 0 },
        data: {
          title: "Splash / Launch",
          description: "App opens, shows logo, checks auth state.",
          kind: "mobile",
          state: "Cold start",
        } as ScreenNodeData,
      } as Node,
      {
        id: "signin",
        type: "screen",
        position: { x: 280, y: 0 },
        data: {
          title: "Sign in",
          description: "User enters email and password, taps Continue.",
          kind: "mobile",
          state: "Anon",
        } as ScreenNodeData,
      } as Node,
      {
        id: "feed",
        type: "screen",
        position: { x: 560, y: 0 },
        data: {
          title: "Feed",
          description: "Authenticated user sees their personalized feed.",
          kind: "mobile",
          state: "Logged in",
        } as ScreenNodeData,
      } as Node,
    ],
    edges: [
      {
        id: "splash-signin",
        source: "splash",
        target: "signin",
        type: "smoothstep",
        label: "Not authenticated",
        labelBgPadding: [4, 4],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: "var(--color-bg-muted)", opacity: 0.95 },
        labelStyle: { fontSize: 10, fill: "var(--color-fg-muted)" },
        markerEnd: { type: "arrowclosed" } as any,
      } as Edge,
      {
        id: "signin-feed",
        source: "signin",
        target: "feed",
        type: "smoothstep",
        label: "On valid login",
        labelBgPadding: [4, 4],
        labelBgBorderRadius: 4,
        labelBgStyle: { fill: "var(--color-bg-muted)", opacity: 0.95 },
        labelStyle: { fontSize: 10, fill: "var(--color-fg-muted)" },
        markerEnd: { type: "arrowclosed" } as any,
      } as Edge,
    ],
  };
}

interface ProductFlowEditorProps {
  mapId: string;
  initialName: string;
  initialState: GraphEditorState | null;
  onBack?: () => void;
}

export function ProductFlowEditor({
  mapId,
  initialName,
  initialState,
  onBack,
}: ProductFlowEditorProps) {
  const seed = React.useMemo(
    () =>
      initialState && initialState.nodes && initialState.nodes.length > 0
        ? initialState
        : buildSeed(),
    [initialState]
  );

  const handleAdd = (api: GraphAPI) => {
    const id = cuid();
    const lastX = Math.max(...api.nodes.map((n) => n.position.x), 0);
    const newNode: Node = {
      id,
      type: "screen",
      position: { x: lastX + 280, y: 0 },
      data: {
        title: "New screen",
        description: "Describe what happens here.",
        kind: "mobile",
        state: "",
      } as ScreenNodeData,
    };
    api.setNodes((prev) => [...prev, newNode]);
  };

  return (
    <GraphEditorShell
      mapId={mapId}
      initialName={initialName}
      initialState={seed}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={{
        type: "smoothstep",
        style: { strokeWidth: 1.5 },
        markerEnd: { type: "arrowclosed" } as any,
      }}
      onAddNode={handleAdd}
      onBack={onBack}
    />
  );
}
