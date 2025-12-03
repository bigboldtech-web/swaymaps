"use client";

import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  Handle,
  MarkerType,
  MiniMap,
  Node,
  NodeProps,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  OnEdgeClick,
  OnNodeClick,
  Position
} from "reactflow";
import "reactflow/dist/style.css";
import { MapEdgeMeta, MapNodeMeta } from "../types/map";

export type FlowNodeData = {
  meta: MapNodeMeta;
  onUpdateMeta: (meta: MapNodeMeta) => void;
};
export type FlowEdgeData = { meta: MapEdgeMeta };

const kindStyles: Record<
  MapNodeMeta["kind"],
  { bg: string; border: string; text: string; pill: string }
> = {
  person: {
    bg: "bg-sky-50",
    text: "text-sky-900",
    pill: "bg-sky-100 text-sky-700 border border-sky-200"
  },
  system: {
    bg: "bg-emerald-50",
    text: "text-emerald-900",
    pill: "bg-emerald-100 text-emerald-700 border border-emerald-200"
  },
  process: {
    bg: "bg-amber-50",
    text: "text-amber-900",
    pill: "bg-amber-100 text-amber-800 border border-amber-200"
  },
  generic: {
    bg: "bg-white",
    text: "text-slate-900",
    pill: "bg-slate-100 text-slate-700 border border-slate-200"
  }
};

function DecodeNode({ data, selected }: NodeProps<FlowNodeData>) {
  const styles = kindStyles[data.meta.kind];
  const bgClass = data.meta.color ? "" : styles.bg;
  const [title, setTitle] = React.useState(data.meta.title);

  React.useEffect(() => {
    setTitle(data.meta.title);
  }, [data.meta.title]);

  const commitMeta = (next: Partial<MapNodeMeta>) => {
    data.onUpdateMeta({ ...data.meta, ...next });
  };

  return (
    <div
      className={`relative w-[220px] rounded-xl px-3 py-2 text-sm shadow-sm transition ${bgClass} ${
        selected ? "ring-2 ring-blue-300" : "ring-0 ring-transparent"
      }`}
      style={{ backgroundColor: data.meta.color || undefined }}
    >
      {[
        { id: "top-source", position: Position.Top, type: "source" as const },
        { id: "top-target", position: Position.Top, type: "target" as const },
        { id: "bottom-source", position: Position.Bottom, type: "source" as const },
        { id: "bottom-target", position: Position.Bottom, type: "target" as const },
        { id: "left-source", position: Position.Left, type: "source" as const },
        { id: "left-target", position: Position.Left, type: "target" as const },
        { id: "right-source", position: Position.Right, type: "source" as const },
        { id: "right-target", position: Position.Right, type: "target" as const }
      ].map((h) => (
        <Handle
          key={h.id}
          id={h.id}
          type={h.type}
          position={h.position}
          isConnectable
          style={{ pointerEvents: "all", zIndex: 50, cursor: "crosshair" }}
          className="h-3 w-3 rounded-full border border-slate-400 bg-slate-700 opacity-90 transition hover:scale-125 hover:ring-2 hover:ring-blue-300"
        />
      ))}
      <div className="flex items-center justify-between gap-2">
        <input
          className={`w-full min-w-0 flex-1 rounded border border-transparent bg-transparent text-base font-semibold leading-tight outline-none ${styles.text}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => commitMeta({ title })}
        />
        <span className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${styles.pill}`}>
          {data.meta.kindLabel || data.meta.kind}
        </span>
      </div>
      {data.meta.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {data.meta.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { decodeNode: DecodeNode };

interface DecodeMapCanvasProps {
  nodes: Node<FlowNodeData>[];
  edges: Edge<FlowEdgeData>[];
  onNodesChange: OnNodesChange<FlowNodeData>;
  onEdgesChange: OnEdgesChange<FlowEdgeData>;
  onSelectNode: (meta: MapNodeMeta) => void;
  onSelectEdge: (edge: FlowEdgeData) => void;
  onClearSelection: () => void;
  onConnectEdge: (connection: Connection) => void;
}

export default function DecodeMapCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onSelectNode,
  onSelectEdge,
  onClearSelection,
  onConnectEdge
}: DecodeMapCanvasProps) {
const defaultEdgeOptions = useMemo(
  () => ({
    type: "default" as const,
    markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
    animated: true,
    className: "edge-glow",
    style: {
      stroke: "#0f172a",
      strokeWidth: 1.5,
      zIndex: 10
    }
  }),
  []
);

  const handleNodeClick: OnNodeClick<FlowNodeData> = (_, node) => {
    onSelectNode((node.data as FlowNodeData).meta);
  };

  const handlePaneClick: NonNullable<React.ComponentProps<typeof ReactFlow>["onPaneClick"]> = () => {
    onClearSelection();
  };

  const handleConnect: OnConnect = (connection) => {
    onConnectEdge(connection);
  };

  const handleEdgeClick: OnEdgeClick<FlowEdgeData> = (_, edge) => {
    onSelectEdge(edge.data);
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      onEdgeClick={handleEdgeClick}
      onPaneClick={handlePaneClick}
      onConnect={handleConnect}
      connectionMode="loose"
      snapToGrid
      snapGrid={[10, 10]}
      connectionLineStyle={{
        stroke: "#0f172a",
        strokeWidth: 1.5
      }}
      connectionLineType="default"
      isValidConnection={() => true}
      nodeTypes={nodeTypes}
      nodesConnectable
      nodesDraggable
      elementsSelectable
      fitView
      fitViewOptions={{ padding: 0.2 }}
      defaultEdgeOptions={defaultEdgeOptions}
      proOptions={{ hideAttribution: true }}
    >
      <Background gap={14} size={1} color="#cbd5e1" />
      <MiniMap
        className="bg-white/90"
        pannable
        zoomable
        nodeStrokeWidth={3}
        nodeColor={(node) => {
          const kind = (node.data as FlowNodeData | undefined)?.meta?.kind;
          if (kind === "person") return "#38bdf8";
          if (kind === "system") return "#34d399";
          if (kind === "process") return "#facc15";
          return "#cbd5e1";
        }}
      />
      <Controls className="bg-white shadow-md" />
    </ReactFlow>
  );
}
