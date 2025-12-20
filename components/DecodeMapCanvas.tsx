"use client";

import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  EdgeProps,
  Handle,
  MarkerType,
  MiniMap,
  Node,
  NodeProps,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  OnEdgesChange,
  OnNodesChange,
  OnEdgeUpdateFunc,
  Position,
  useReactFlow,
  ReactFlowProvider,
  BaseEdge,
  getSmoothStepPath,
  getBezierPath,
  getStraightPath,
  EdgeMouseHandler,
  NodeMouseHandler,
  ConnectionMode,
  ConnectionLineType,
  EdgeLabelRenderer
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
    border: "border border-sky-200",
    text: "text-sky-900",
    pill: "bg-sky-100 text-sky-700 border border-sky-200"
  },
  system: {
    bg: "bg-emerald-50",
    border: "border border-emerald-200",
    text: "text-emerald-900",
    pill: "bg-emerald-100 text-emerald-700 border border-emerald-200"
  },
  process: {
    bg: "bg-amber-50",
    border: "border border-amber-200",
    text: "text-amber-900",
    pill: "bg-amber-100 text-amber-800 border border-amber-200"
  },
  generic: {
    bg: "bg-white",
    border: "border border-slate-200",
    text: "text-slate-900",
    pill: "bg-slate-100 text-slate-700 border border-slate-200"
  }
};

const grayHex = "#9ca3af";
type EdgeShape = "smoothstep" | "default" | "straight" | "step";

const edgePathForType = (type: EdgeShape, props: EdgeProps<FlowEdgeData>) => {
  switch (type) {
    case "straight":
      return getStraightPath(props);
    case "default":
      return getBezierPath(props);
    case "step":
    case "smoothstep":
    default:
      return getSmoothStepPath(props);
  }
};

function GradientEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  data
}: EdgeProps<FlowEdgeData>) {
  const { getNode } = useReactFlow();
  const sourceNode = data?.meta.sourceId ? getNode?.(data.meta.sourceId) : undefined;
  const targetNode = data?.meta.targetId ? getNode?.(data.meta.targetId) : undefined;
  const defaultColor = "#38bdf8";
  const fromColor = (sourceNode?.data as FlowNodeData | undefined)?.meta.color ?? defaultColor;
  const toColor = (targetNode?.data as FlowNodeData | undefined)?.meta.color ?? defaultColor;

  const edgeShape = (data?.meta?.edgeType as EdgeShape) || (props.type as EdgeShape) || "smoothstep";
  const [edgePath, labelX, labelY] = edgePathForType(edgeShape, {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    style,
    data
  } as EdgeProps<FlowEdgeData>);
  const label = data?.meta?.label;
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  return (
    <>
      <defs>
        <linearGradient id={`grad-${id}`} gradientUnits="userSpaceOnUse" x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}>
          <stop offset="0%" stopColor={fromColor} />
          <stop offset="100%" stopColor={toColor} />
        </linearGradient>
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ ...(style || {}), stroke: `url(#grad-${id})`, strokeWidth: (style as any)?.strokeWidth ?? 1.6 }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "none"
            }}
            className={`rounded-md px-2 py-1 text-xs font-semibold shadow-sm ${
              isDark ? "bg-[#0b1422] text-slate-100" : "bg-white text-slate-800"
            }`}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
// Fallback straight edge that uses current theme for stroke
const BasicEdge = (props: EdgeProps<FlowEdgeData>) => {
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const strokeColor = (props.style as any)?.stroke || (isDark ? "#ffffff" : "#0f172a");
  const edgeShape = (props.data as any)?.meta?.edgeType || (props.type as EdgeShape) || "smoothstep";
  const [edgePath, labelX, labelY] = edgePathForType(edgeShape as EdgeShape, props);
  const label = (props.data as any)?.meta?.label as string | undefined;
  return (
    <>
      <BaseEdge
        id={props.id}
        path={edgePath}
        markerEnd={props.markerEnd}
        style={{
          ...(props.style || {}),
          stroke: strokeColor,
          strokeWidth: (props.style as any)?.strokeWidth ?? 1.6
        }}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY - 8}px)`,
              pointerEvents: "none"
            }}
            className={`rounded-md px-2 py-1 text-xs font-semibold shadow-sm ${
              isDark ? "bg-[#0b1422] text-slate-100" : "bg-white text-slate-800"
            }`}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

function DecodeNode({ data, selected }: NodeProps<FlowNodeData>) {
  const styles = kindStyles[data.meta.kind];
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const bgClass = data.meta.color ? "" : styles.bg;
  const [title, setTitle] = React.useState(data.meta.title);

  React.useEffect(() => {
    setTitle(data.meta.title);
  }, [data.meta.title]);

  const commitMeta = (next: Partial<MapNodeMeta>) => {
    data.onUpdateMeta({ ...data.meta, ...next });
  };

  const pinTag = data.meta.tags.find((t) => t.startsWith("__pin:"));
  const pinLabel = pinTag?.replace("__pin:", "");
  const visibleTags = data.meta.tags.filter((tag) => !tag.startsWith("__pin:"));

  const darkDefaults: Record<MapNodeMeta["kind"], string> = {
    person: "#0f2f4a",
    system: "#0e3727",
    process: "#3a2a0c",
    generic: "#0f172a"
  };

  const baseDefaults: Record<MapNodeMeta["kind"], string> = {
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

  const contrastText = (hex?: string) => {
    if (!hex) return isDark ? "#e2e8f0" : "#0f172a";
    const c = hex.replace("#", "");
    if (c.length !== 6) return isDark ? "#e2e8f0" : "#0f172a";
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "#0b0f19" : "#e5e7eb";
  };

  const effectiveBg = (() => {
    const base = data.meta.color || baseDefaults[data.meta.kind];
    if (isDark) return darkenColor(base);
    return base === grayHex ? base : pastelize(base, 0.8);
  })();

  const textColor = contrastText(effectiveBg);

  return (
    <div
      className={`relative w-[240px] rounded-xl px-3 py-2 text-sm shadow-sm transition ${bgClass} ${
        selected ? "ring-2 ring-blue-300" : "ring-0 ring-transparent"
      }`}
      style={{ backgroundColor: effectiveBg, overflow: "visible" }}
    >
      {[
        { id: "top-source", position: Position.Top, type: "source" as const },
        { id: "bottom-source", position: Position.Bottom, type: "source" as const },
        { id: "left-source", position: Position.Left, type: "source" as const },
        { id: "right-source", position: Position.Right, type: "source" as const },
        { id: "top-target", position: Position.Top, type: "target" as const },
        { id: "bottom-target", position: Position.Bottom, type: "target" as const },
        { id: "left-target", position: Position.Left, type: "target" as const },
        { id: "right-target", position: Position.Right, type: "target" as const }
      ].map((h) => (
        <Handle
          key={`${h.id}-${h.type}`}
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
          className={`w-full min-w-0 flex-1 rounded border border-transparent bg-transparent text-sm font-semibold leading-tight outline-none ${styles.text} truncate`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => commitMeta({ title })}
          style={{ color: textColor }}
        />
        <div className="flex items-center gap-1">
          <span
            className={`max-w-[80px] truncate whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${styles.pill}`}
            style={
              effectiveBg
                ? { backgroundColor: effectiveBg, borderColor: "#0b0f19", color: textColor }
                : { borderColor: "#0b0f19", color: textColor }
            }
          >
            {data.meta.kindLabel || data.meta.kind}
          </span>
          {pinTag && (
            <span
              className="absolute -right-2 -top-2 inline-flex h-4 w-4 items-center justify-center text-[9px] leading-none shrink-0"
              title={pinLabel || "Pinned"}
              style={{
                color: "#0b0f19",
                backgroundColor: "transparent",
                boxShadow: "none"
              }}
            >
              📌
            </span>
          )}
        </div>
      </div>
      {visibleTags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {visibleTags.map((tag) => (
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
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onSelectNode: (meta: MapNodeMeta) => void;
  onSelectEdge: (edge: FlowEdgeData) => void;
  onClearSelection: () => void;
  onConnectEdge: (connection: Connection) => void;
  onEdgeUpdate?: OnEdgeUpdateFunc<FlowEdgeData>;
  onCreateNodeAt?: (
    position: { x: number; y: number },
    from: { nodeId: string; handleId?: string }
  ) => void;
  focusNodeId?: string | null;
  theme?: "light" | "dark";
  useGradientEdges?: boolean;
  onViewportCenterChange?: (center: { x: number; y: number }) => void;
  readOnly?: boolean;
}

export default function DecodeMapCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onSelectNode,
  onSelectEdge,
  onClearSelection,
  onConnectEdge,
  onEdgeUpdate,
  onCreateNodeAt,
  focusNodeId,
  theme = "light",
  useGradientEdges = false,
  onViewportCenterChange,
  readOnly = false
}: DecodeMapCanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasBody
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectNode={onSelectNode}
        onSelectEdge={onSelectEdge}
        onClearSelection={onClearSelection}
        onConnectEdge={onConnectEdge}
        onEdgeUpdate={onEdgeUpdate}
        onCreateNodeAt={onCreateNodeAt}
        focusNodeId={focusNodeId}
        theme={theme}
        useGradientEdges={useGradientEdges}
        onViewportCenterChange={onViewportCenterChange}
        readOnly={readOnly}
      />
    </ReactFlowProvider>
  );
}

function CanvasBody(props: DecodeMapCanvasProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onSelectNode,
    onSelectEdge,
    onClearSelection,
    onConnectEdge,
    onEdgeUpdate,
    onCreateNodeAt,
    focusNodeId,
    theme = "light",
    useGradientEdges = false,
    onViewportCenterChange,
    readOnly = false
  } = props;

  const isDark = theme === "dark";
  const reactFlowInstance = useReactFlow();
  const connectFrom = React.useRef<{ nodeId: string; handleId?: string } | null>(null);
  const [isPanning, setIsPanning] = React.useState(false);
  const handCursor = isPanning ? "grabbing" : "grab";
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const defaultEdgeOptions = useMemo(
    () => ({
      type: "smoothstep" as const,
      markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
      animated: true,
      style: {
        stroke: isDark ? "#cbd5e1" : "#0f172a",
        strokeWidth: 1.6,
        zIndex: 10
      }
    }),
    [isDark]
  );

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    onSelectNode((node.data as FlowNodeData).meta);
  };

  const handlePaneClick: NonNullable<React.ComponentProps<typeof ReactFlow>["onPaneClick"]> = () => {
    onClearSelection();
  };

  const handleConnect: OnConnect = (connection) => {
    onConnectEdge(connection);
    connectFrom.current = null;
  };

  const handleEdgeClick: EdgeMouseHandler = (_, edge) => {
    onSelectEdge(edge.data as FlowEdgeData);
  };

  const handleEdgeUpdate: OnEdgeUpdateFunc = (oldEdge, newConnection) => {
    onEdgeUpdate?.(oldEdge, newConnection);
    return true;
  };

  const handleConnectStart: OnConnectStart = (_, params) => {
    connectFrom.current = { nodeId: params.nodeId ?? "", handleId: params.handleId ?? undefined };
  };

  const handleConnectEnd: OnConnectEnd = (event) => {
    const from = connectFrom.current;
    if (!from) return;
    const target = event.target as HTMLElement | null;
    if (
      target &&
      target.classList.contains("react-flow__pane") &&
      !(event as MouseEvent).altKey &&
      !(event as MouseEvent).metaKey &&
      !(event as MouseEvent).ctrlKey
    ) {
      const bounds = target.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: (event as MouseEvent).clientX - bounds.left,
        y: (event as MouseEvent).clientY - bounds.top
      });
      onCreateNodeAt?.(position, from);
    }
    connectFrom.current = null;
  };

  const handleMoveStart: NonNullable<React.ComponentProps<typeof ReactFlow>["onMoveStart"]> = () => {
    setIsPanning(true);
  };

  const handleMoveEnd: NonNullable<React.ComponentProps<typeof ReactFlow>["onMoveEnd"]> = () => {
    setIsPanning(false);
  };

  const reportCenter = React.useCallback(() => {
    if (!containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const center = reactFlowInstance.project({
      x: bounds.width / 2,
      y: bounds.height / 2
    });
    onViewportCenterChange?.(center);
  }, [onViewportCenterChange, reactFlowInstance]);

  const handleSelectionChange: NonNullable<
    React.ComponentProps<typeof ReactFlow>["onSelectionChange"]
  > = ({ nodes: selectedNodes, edges: selectedEdges }) => {
    if ((selectedNodes?.length ?? 0) === 0 && (selectedEdges?.length ?? 0) === 0) {
      onClearSelection();
    }
  };

  React.useEffect(() => {
    reportCenter();
  }, [reportCenter]);

  React.useEffect(() => {
    if (!focusNodeId) return;
    const node = reactFlowInstance.getNode(focusNodeId);
    if (!node) return;
    const rect = node.positionAbsolute ?? {
      x: node.position.x,
      y: node.position.y,
      width: 240,
      height: 80
    };
    const width = (rect as any).width ?? 0;
    const height = (rect as any).height ?? 0;
    reactFlowInstance.setCenter(
      rect.x + width / 2,
      rect.y + height / 2,
      {
        zoom: 1.2,
        duration: 500
      }
    );
  }, [focusNodeId, reactFlowInstance]);

  return (
    <div
      className={`decode-canvas h-full w-full relative pan-mode ${isPanning ? "is-panning" : ""}`}
      style={{ cursor: handCursor }}
      ref={containerRef}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onEdgeUpdate={handleEdgeUpdate}
        onPaneClick={handlePaneClick}
        onSelectionChange={handleSelectionChange}
        onConnect={handleConnect}
        onConnectStart={handleConnectStart}
        onConnectEnd={handleConnectEnd}
        panOnDrag={[0, 1, 2]}
        selectionOnDrag={false}
        selectNodesOnDrag={false}
        edgeUpdaterRadius={16}
        connectionMode={ConnectionMode.Loose}
        snapToGrid
        snapGrid={[10, 10]}
        connectionLineStyle={{
          stroke: isDark ? "#cbd5e1" : "#0f172a",
          strokeWidth: 2.4,
          pointerEvents: "none"
        }}
        connectionLineType={ConnectionLineType.SmoothStep}
        isValidConnection={() => true}
        nodeTypes={nodeTypes}
        edgeTypes={
          useGradientEdges
            ? { smoothstep: GradientEdge, default: GradientEdge, straight: GradientEdge, step: GradientEdge }
            : { smoothstep: BasicEdge, default: BasicEdge, straight: BasicEdge, step: BasicEdge }
        }
        nodesConnectable={!readOnly}
        nodesDraggable={!readOnly}
        nodesFocusable
        edgesFocusable
        elementsSelectable
        onMoveStart={handleMoveStart}
        onMoveEnd={handleMoveEnd}
        onMove={reportCenter}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={{ hideAttribution: true }}
        className={`${isDark ? "bg-slate-900" : "bg-slate-50"}`}
        style={{ cursor: handCursor }}
      >
        <Background gap={14} size={1} color={isDark ? "#475569" : "#cbd5e1"} />
        <style>{`
          .react-flow__edge-path.edge-glow {
            stroke-dasharray: 14 8;
            stroke-linecap: round;
            stroke-dashoffset: 0;
            stroke-width: 1.6 !important;
            animation: edge-glow-move 1.1s linear infinite;
          }
          @keyframes edge-glow-move {
            to {
              stroke-dashoffset: -44;
            }
          }
          .decode-canvas.pan-mode,
          .decode-canvas.pan-mode .react-flow__pane,
          .decode-canvas.pan-mode .react-flow__background,
          .decode-canvas.pan-mode .react-flow__viewport,
          .decode-canvas.pan-mode .react-flow__renderer {
            cursor: grab !important;
          }
          .decode-canvas.pan-mode.is-panning,
          .decode-canvas.pan-mode.is-panning .react-flow__pane,
          .decode-canvas.pan-mode.is-panning .react-flow__background,
          .decode-canvas.pan-mode.is-panning .react-flow__viewport,
          .decode-canvas.pan-mode.is-panning .react-flow__renderer {
            cursor: grabbing !important;
          }
        `}</style>
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
        <Controls
          className={
            isDark
              ? "bg-slate-800/90 text-slate-100 border border-slate-700 shadow"
              : "bg-white text-slate-900 shadow-md"
          }
        />
      </ReactFlow>
    </div>
  );
}
