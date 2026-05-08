"use client";

import * as React from "react";
import { Handle, Position, type Node, type Edge, type NodeProps } from "reactflow";
import { GraphEditorShell, type GraphAPI, type GraphEditorState } from "../graph/GraphEditorShell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

type FlowShape = "start" | "end" | "process" | "decision" | "io";

interface FlowNodeData {
  label: string;
  shape: FlowShape;
}

const cuid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function StartEndNode({ data, selected }: NodeProps<FlowNodeData>) {
  return (
    <div
      style={{
        background: data.shape === "start" ? "var(--color-success-subtle)" : "var(--color-danger-subtle)",
        color: data.shape === "start" ? "var(--color-success)" : "var(--color-danger)",
        border: `1.5px solid ${data.shape === "start" ? "var(--color-success)" : "var(--color-danger)"}`,
        borderRadius: 999,
        padding: "8px 18px",
        fontSize: 13,
        fontWeight: 600,
        boxShadow: selected ? "0 0 0 2px var(--color-accent)" : "var(--shadow-xs)",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0.5 }} />
      {data.label}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0.5 }} />
    </div>
  );
}

function ProcessNode({ data, selected }: NodeProps<FlowNodeData>) {
  return (
    <div
      style={{
        background: "var(--color-panel)",
        color: "var(--color-fg)",
        border: "1.5px solid var(--color-border-strong)",
        borderRadius: 6,
        padding: "10px 16px",
        fontSize: 13,
        minWidth: 140,
        textAlign: "center",
        boxShadow: selected ? "0 0 0 2px var(--color-accent)" : "var(--shadow-xs)",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0.5 }} />
      {data.label}
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0.5 }} />
    </div>
  );
}

function DecisionNode({ data, selected }: NodeProps<FlowNodeData>) {
  return (
    <div
      style={{
        width: 140,
        height: 90,
        position: "relative",
        boxShadow: selected ? "0 0 0 2px var(--color-accent)" : undefined,
      }}
    >
      <svg
        viewBox="0 0 100 70"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <polygon
          points="50,2 98,35 50,68 2,35"
          fill="var(--color-warning-subtle)"
          stroke="var(--color-warning)"
          strokeWidth="1.5"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 500,
          color: "var(--color-warning)",
          padding: "0 18px",
          textAlign: "center",
        }}
      >
        {data.label}
      </div>
      <Handle type="target" position={Position.Top} style={{ opacity: 0.5 }} />
      <Handle type="source" position={Position.Bottom} id="yes" style={{ opacity: 0.5 }} />
      <Handle type="source" position={Position.Right} id="no" style={{ opacity: 0.5 }} />
    </div>
  );
}

function IONode({ data, selected }: NodeProps<FlowNodeData>) {
  return (
    <div
      style={{
        background: "var(--color-info-subtle)",
        color: "var(--color-info)",
        border: "1.5px solid var(--color-info)",
        borderRadius: 4,
        padding: "10px 22px",
        fontSize: 13,
        minWidth: 140,
        textAlign: "center",
        transform: "skewX(-12deg)",
        boxShadow: selected ? "0 0 0 2px var(--color-accent)" : "var(--shadow-xs)",
      }}
    >
      <span style={{ display: "inline-block", transform: "skewX(12deg)" }}>{data.label}</span>
      <Handle type="target" position={Position.Top} style={{ opacity: 0.5 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0.5 }} />
    </div>
  );
}

const nodeTypes = {
  startEnd: StartEndNode,
  process: ProcessNode,
  decision: DecisionNode,
  io: IONode,
};

function buildSeed(): GraphEditorState {
  return {
    nodes: [
      {
        id: "start",
        type: "startEnd",
        position: { x: 200, y: 0 },
        data: { label: "Start", shape: "start" } as FlowNodeData,
      } as Node,
      {
        id: "step1",
        type: "process",
        position: { x: 180, y: 100 },
        data: { label: "Process step", shape: "process" } as FlowNodeData,
      } as Node,
    ],
    edges: [
      {
        id: "start-step1",
        source: "start",
        target: "step1",
        type: "smoothstep",
        markerEnd: { type: "arrowclosed" } as any,
      } as Edge,
    ],
  };
}

interface FlowchartEditorProps {
  mapId: string;
  initialName: string;
  initialState: GraphEditorState | null;
  onBack?: () => void;
}

export function FlowchartEditor({ mapId, initialName, initialState, onBack }: FlowchartEditorProps) {
  const seed = React.useMemo(
    () =>
      initialState && initialState.nodes && initialState.nodes.length > 0
        ? initialState
        : buildSeed(),
    [initialState]
  );

  const apiRef = React.useRef<GraphAPI | null>(null);

  const addOfShape = (shape: FlowShape) => {
    const api = apiRef.current;
    if (!api) return;
    const id = cuid();
    const lastY = Math.max(...api.nodes.map((n) => n.position.y), 0);
    const node: Node = {
      id,
      type:
        shape === "start" || shape === "end"
          ? "startEnd"
          : shape === "decision"
          ? "decision"
          : shape === "io"
          ? "io"
          : "process",
      position: { x: 180, y: lastY + 100 },
      data: { label: shape.charAt(0).toUpperCase() + shape.slice(1), shape },
    };
    api.setNodes((prev) => [...prev, node]);
  };

  const toolbarExtras = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" icon={<Plus />}>
          Shape
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => addOfShape("start")}>Start / End</DropdownMenuItem>
        <DropdownMenuItem onClick={() => addOfShape("process")}>Process</DropdownMenuItem>
        <DropdownMenuItem onClick={() => addOfShape("decision")}>Decision</DropdownMenuItem>
        <DropdownMenuItem onClick={() => addOfShape("io")}>Input / Output</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

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
      toolbarExtras={toolbarExtras}
      onAddNode={(api) => {
        apiRef.current = api;
        addOfShape("process");
      }}
      onBack={onBack}
    />
  );
}
