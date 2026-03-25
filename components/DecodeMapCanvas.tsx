"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useTheme } from "./providers/ThemeProvider";
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
  EdgeLabelRenderer,
  useStore
} from "reactflow";
import "reactflow/dist/style.css";
import { MapEdgeMeta, MapNodeMeta, NodeStatus } from "../types/map";

/** Returns the set of currently selected node IDs from ReactFlow internal store */
const selectedNodeIdsSelector = (state: any): Set<string> => {
  const set = new Set<string>();
  if (state.nodeInternals) {
    for (const [id, node] of state.nodeInternals) {
      if (node.selected) set.add(id);
    }
  }
  return set;
};

function useSelectedNodeIds(): Set<string> {
  return useStore(selectedNodeIdsSelector);
}

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
  },
  database: {
    bg: "bg-indigo-50",
    border: "border border-indigo-200",
    text: "text-indigo-900",
    pill: "bg-indigo-100 text-indigo-700 border border-indigo-200"
  },
  api: {
    bg: "bg-cyan-50",
    border: "border border-cyan-200",
    text: "text-cyan-900",
    pill: "bg-cyan-100 text-cyan-700 border border-cyan-200"
  },
  queue: {
    bg: "bg-orange-50",
    border: "border border-orange-200",
    text: "text-orange-900",
    pill: "bg-orange-100 text-orange-700 border border-orange-200"
  },
  cache: {
    bg: "bg-rose-50",
    border: "border border-rose-200",
    text: "text-rose-900",
    pill: "bg-rose-100 text-rose-700 border border-rose-200"
  },
  cloud: {
    bg: "bg-violet-50",
    border: "border border-violet-200",
    text: "text-violet-900",
    pill: "bg-violet-100 text-violet-700 border border-violet-200"
  },
  team: {
    bg: "bg-teal-50",
    border: "border border-teal-200",
    text: "text-teal-900",
    pill: "bg-teal-100 text-teal-700 border border-teal-200"
  },
  vendor: {
    bg: "bg-amber-50",
    border: "border border-amber-200",
    text: "text-amber-900",
    pill: "bg-amber-100 text-amber-800 border border-amber-200"
  }
};

const kindAccentColors: Record<MapNodeMeta["kind"], string> = {
  person: "#38bdf8",
  system: "#22c55e",
  process: "#fbbf24",
  generic: "#29a5e5",
  database: "#818cf8",
  api: "#2192dd",
  queue: "#f59e0b",
  cache: "#ef4444",
  cloud: "#8b5cf6",
  team: "#14b8a6",
  vendor: "#f97316"
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
      return getSmoothStepPath({ ...props, borderRadius: 16 });
  }
};

/** Compute strokeDasharray from lineStyle */
function dashForStyle(s?: string): string | undefined {
  if (s === "dashed") return "8 4";
  if (s === "dotted") return "2 4";
  return undefined;
}

/** Compute strokeWidth from weight (1-5 scale) */
function widthForWeight(w?: number, selected?: boolean): number {
  const base = w ? Math.max(1, Math.min(5, w)) : 2;
  return selected ? base + 1 : base;
}

const statusColors: Record<NodeStatus, string> = {
  active: "#22c55e",
  degraded: "#f59e0b",
  down: "#ef4444",
  deprecated: "#6b7280",
  planned: "#8b5cf6",
  maintenance: "#f97316",
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
  data,
  selected
}: EdgeProps<FlowEdgeData>) {
  const { getNode } = useReactFlow();
  const sourceNode = data?.meta.sourceId ? getNode?.(data.meta.sourceId) : undefined;
  const targetNode = data?.meta.targetId ? getNode?.(data.meta.targetId) : undefined;
  const defaultColor = "#38bdf8";
  const fromColor = (sourceNode?.data as FlowNodeData | undefined)?.meta.color ?? defaultColor;
  const toColor = (targetNode?.data as FlowNodeData | undefined)?.meta.color ?? defaultColor;

  const edgeShape = (data?.meta?.edgeType as EdgeShape) || "smoothstep";
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
  const { theme: edgeTheme } = useTheme();
  const isDark = edgeTheme === "dark";

  const meta = data?.meta;
  const customColor = meta?.color;
  const strokeWidth = widthForWeight(meta?.weight, !!selected);
  const strokeDasharray = dashForStyle(meta?.lineStyle);
  const strokeVal = customColor || `url(#grad-${id})`;
  const protocol = meta?.protocol;
  const latency = meta?.latency;
  const labelParts = [label, protocol].filter(Boolean).join(" · ");

  const glowColor = customColor || fromColor;
  const selectedIds = useSelectedNodeIds();
  const edgeSourceId = meta?.sourceId;
  const edgeTargetId = meta?.targetId;
  const isConnected = !!(edgeSourceId && selectedIds.has(edgeSourceId)) || !!(edgeTargetId && selectedIds.has(edgeTargetId));
  const hasSelection = selectedIds.size > 0;
  // Dim unconnected edges when a node is selected; show orb on all edges (or only connected when filtered)
  const showOrb = hasSelection ? isConnected : true;
  const dimmed = hasSelection && !isConnected;

  return (
    <>
      <defs>
        <linearGradient id={`grad-${id}`} gradientUnits="userSpaceOnUse" x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}>
          <stop offset="0%" stopColor={fromColor} />
          <stop offset="100%" stopColor={toColor} />
        </linearGradient>
      </defs>
      {/* Invisible wide path for easier click targeting */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ pointerEvents: "stroke" }}
      />
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...(style || {}),
          stroke: strokeVal,
          strokeWidth: isConnected && hasSelection ? strokeWidth + 0.5 : strokeWidth,
          strokeDasharray,
          opacity: dimmed ? 0.15 : 1,
          filter: selected ? "drop-shadow(0 0 4px rgba(56,189,248,0.5))" : isConnected && hasSelection ? `drop-shadow(0 0 6px ${glowColor}60)` : undefined,
          transition: "stroke-width 0.3s cubic-bezier(0.16,1,0.3,1), filter 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.4s cubic-bezier(0.16,1,0.3,1)"
        }}
      />
      {/* Flowing dash overlay — CSS animation, no restart on re-render */}
      {showOrb && (
        <path
          d={edgePath}
          fill="none"
          stroke="#ffffff"
          strokeWidth={2.5}
          strokeDasharray="6 32"
          strokeLinecap="round"
          opacity={dimmed ? 0 : 0.7}
          className="edge-flow-dash"
          style={{ transition: "opacity 0.5s ease" }}
        />
      )}
      {(labelParts || latency) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
              opacity: dimmed ? 0.15 : 1,
              transition: "opacity 0.3s ease"
            }}
            className={`cursor-pointer rounded-md px-2 py-1 text-xs font-medium shadow-sm transition-all hover:scale-[1.03] ${isDark ? "border border-slate-700 bg-[#0b1422]/95 text-slate-200 hover:border-slate-500" : "border border-slate-300 bg-white/95 text-slate-700 hover:border-slate-400"}`}
          >
            <span>{labelParts}</span>
            {latency && <span className={`ml-1.5 text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>{latency}</span>}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const BasicEdge = (props: EdgeProps<FlowEdgeData>) => {
  const { theme: basicEdgeTheme } = useTheme();
  const isBasicDark = basicEdgeTheme === "dark";
  const meta = props.data?.meta;
  const customColor = meta?.color;
  const strokeColor = customColor || (props.style as any)?.stroke || "#94a3b8";
  const edgeShape = (meta?.edgeType as EdgeShape) || "smoothstep";
  const [edgePath, labelX, labelY] = edgePathForType(edgeShape, props);
  const label = meta?.label;
  const strokeWidth = widthForWeight(meta?.weight, !!props.selected);
  const strokeDasharray = dashForStyle(meta?.lineStyle);
  const protocol = meta?.protocol;
  const latency = meta?.latency;
  const labelParts = [label, protocol].filter(Boolean).join(" · ");

  const selectedIds = useSelectedNodeIds();
  const edgeSourceId = meta?.sourceId;
  const edgeTargetId = meta?.targetId;
  const isConnected = !!(edgeSourceId && selectedIds.has(edgeSourceId)) || !!(edgeTargetId && selectedIds.has(edgeTargetId));
  const hasSelection = selectedIds.size > 0;
  const showOrb = hasSelection ? isConnected : true;
  const dimmed = hasSelection && !isConnected;

  return (
    <>
      {/* Invisible wide path for easier click targeting */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ pointerEvents: "stroke" }}
      />
      <BaseEdge
        id={props.id}
        path={edgePath}
        markerEnd={props.markerEnd}
        style={{
          ...(props.style || {}),
          stroke: strokeColor,
          strokeWidth: isConnected ? strokeWidth + 0.5 : strokeWidth,
          strokeDasharray,
          opacity: dimmed ? 0.15 : 1,
          filter: props.selected ? `drop-shadow(0 0 4px ${strokeColor}50)` : isConnected ? `drop-shadow(0 0 6px ${strokeColor}60)` : undefined,
          transition: "stroke-width 0.3s cubic-bezier(0.16,1,0.3,1), filter 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.4s cubic-bezier(0.16,1,0.3,1)"
        }}
      />
      {/* Flowing dash overlay — CSS animation, no restart on re-render */}
      {showOrb && (
        <path
          d={edgePath}
          fill="none"
          stroke="#ffffff"
          strokeWidth={2.5}
          strokeDasharray="6 32"
          strokeLinecap="round"
          opacity={dimmed ? 0 : 0.7}
          className="edge-flow-dash"
          style={{ transition: "opacity 0.5s ease" }}
        />
      )}
      {(labelParts || latency) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY - 8}px)`,
              pointerEvents: "all",
              opacity: dimmed ? 0.15 : 1,
              transition: "opacity 0.3s ease"
            }}
            className={`cursor-pointer rounded-md px-2 py-1 text-xs font-medium shadow-sm transition-all hover:scale-[1.03] ${isBasicDark ? "border border-slate-700 bg-[#0b1422]/95 text-slate-200 hover:border-slate-500" : "border border-slate-300 bg-white/95 text-slate-700 hover:border-slate-400"}`}
          >
            <span>{labelParts}</span>
            {latency && <span className={`ml-1.5 text-[10px] ${isBasicDark ? "text-slate-500" : "text-slate-400"}`}>{latency}</span>}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

function DecodeNode({ data, selected }: NodeProps<FlowNodeData>) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [title, setTitle] = React.useState(data.meta.title);
  const [isHovered, setIsHovered] = useState(false);

  React.useEffect(() => {
    setTitle(data.meta.title);
  }, [data.meta.title]);

  const commitMeta = (next: Partial<MapNodeMeta>) => {
    data.onUpdateMeta({ ...data.meta, ...next });
  };

  const pinTag = data.meta.tags.find((t) => t.startsWith("__pin:"));
  const pinLabel = pinTag?.replace("__pin:", "");
  const visibleTags = data.meta.tags.filter((tag) => !tag.startsWith("__pin:"));
  const nodeStatus = data.meta.status;
  const statusColor = nodeStatus ? statusColors[nodeStatus] : undefined;

  const accentColor = data.meta.color || kindAccentColors[data.meta.kind];
  const textColor = "#e2e8f0";

  const handlePositions = [
    { id: "top-source", position: Position.Top, type: "source" as const },
    { id: "bottom-source", position: Position.Bottom, type: "source" as const },
    { id: "left-source", position: Position.Left, type: "source" as const },
    { id: "right-source", position: Position.Right, type: "source" as const },
    { id: "top-target", position: Position.Top, type: "target" as const },
    { id: "bottom-target", position: Position.Bottom, type: "target" as const },
    { id: "left-target", position: Position.Left, type: "target" as const },
    { id: "right-target", position: Position.Right, type: "target" as const }
  ];

  return (
    <div
      className={`decode-node relative min-w-[200px] max-w-[280px] w-auto rounded-xl px-3.5 py-3 text-sm`}
      style={{
        backgroundColor: isLight ? "rgba(248,250,255,0.95)" : "rgba(11,20,34,0.80)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: selected
          ? `1px solid ${accentColor}60`
          : isHovered
            ? isLight ? "1px solid rgba(148,163,184,0.60)" : "1px solid rgba(51,65,85,0.60)"
            : isLight ? "1px solid rgba(148,163,184,0.40)" : "1px solid rgba(51,65,85,0.30)",
        borderRadius: "12px",
        overflow: "visible",
        boxShadow: selected
          ? `0 0 0 1px ${accentColor}40, 0 0 24px ${accentColor}15, 0 4px 16px ${isLight ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.3)"}`
          : isHovered
            ? isLight ? "0 4px 20px rgba(0,0,0,0.07), 0 0 0 1px rgba(148,163,184,0.45)" : "0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(51,65,85,0.40)"
            : isLight ? "0 1px 4px rgba(0,0,0,0.04), 0 0 0 1px rgba(148,163,184,0.20)" : "0 2px 8px rgba(0,0,0,0.2)",
        transform: isHovered && !selected ? "translateY(-2px) scale(1.005)" : "translateY(0) scale(1)",
        willChange: "transform, box-shadow, border-color",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {handlePositions.map((h) => (
        <Handle
          key={`${h.id}-${h.type}`}
          id={h.id}
          type={h.type}
          position={h.position}
          isConnectable
          style={{
            pointerEvents: "all",
            zIndex: 50,
            cursor: "crosshair",
            width: isHovered || selected ? 10 : 6,
            height: isHovered || selected ? 10 : 6,
            backgroundColor: isHovered || selected ? accentColor : "#475569",
            border: `2px solid ${isHovered || selected ? (isLight ? "#f1f3f8" : "#0f172a") : "transparent"}`,
            borderRadius: "50%",
            opacity: isHovered || selected ? 1 : 0,
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: isHovered || selected ? `0 0 6px ${accentColor}60` : "none"
          }}
        />
      ))}

      <div className="flex items-center justify-between gap-2">
        <input
          className={`w-full min-w-0 flex-1 rounded border border-transparent bg-transparent text-sm font-semibold leading-tight outline-none ${isLight ? "text-slate-800" : "text-slate-100"}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => commitMeta({ title })}
          style={{ color: isLight ? undefined : textColor }}
        />
        <div className="flex items-center gap-1">
          <span
            className="max-w-[100px] truncate whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide shrink-0"
            style={{
              backgroundColor: `${accentColor}15`,
              border: `1px solid ${accentColor}30`,
              color: accentColor
            }}
          >
            {data.meta.kindLabel || data.meta.kind}
          </span>
          {/* Status dot */}
          {statusColor && (
            <span
              className="absolute -left-1 -top-1 flex h-3 w-3 items-center justify-center"
              title={nodeStatus}
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40" style={{ backgroundColor: statusColor }} />
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full border ${isLight ? "border-white" : "border-[#0b1422]"}`} style={{ backgroundColor: statusColor }} />
            </span>
          )}
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
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${isLight ? "border border-slate-300/50 bg-slate-200/60 text-slate-600" : "border border-slate-700/40 bg-slate-800/40 text-slate-400"}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {/* Description preview */}
      {data.meta.description && (
        <div className={`mt-1.5 text-[10px] leading-tight line-clamp-2 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
          {data.meta.description}
        </div>
      )}
      {/* Bottom meta badges (version / SLA) */}
      {(data.meta.version || data.meta.sla) && (
        <div className={`mt-1.5 flex items-center gap-1.5 text-[9px] ${isLight ? "text-slate-500" : "text-slate-500"}`}>
          {data.meta.version && <span className={`rounded px-1 py-px ${isLight ? "border border-slate-300/40 bg-slate-200/50" : "border border-slate-700/30 bg-slate-800/30"}`}>v{data.meta.version}</span>}
          {data.meta.sla && <span className={`rounded px-1 py-px ${isLight ? "border border-slate-300/40 bg-slate-200/50" : "border border-slate-700/30 bg-slate-800/30"}`}>{data.meta.sla}</span>}
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
  const [isConnecting, setIsConnecting] = useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const defaultEdgeOptions = useMemo(
    () => ({
      type: "smoothstep" as const,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 18,
        height: 18,
        color: isDark ? "#94a3b8" : "#475569"
      },
      animated: false,
      style: {
        stroke: isDark ? "#94a3b8" : "#475569",
        strokeWidth: 2,
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
    setIsConnecting(false);
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
    setIsConnecting(true);
  };

  const handleConnectEnd: OnConnectEnd = (event) => {
    const from = connectFrom.current;
    setIsConnecting(false);
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

  const reportCenter = useCallback(() => {
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
      width: 180,
      height: 80
    };
    const width = (rect as any).width ?? 0;
    const height = (rect as any).height ?? 0;
    reactFlowInstance.setCenter(
      rect.x + width / 2,
      rect.y + height / 2,
      {
        zoom: 1.2,
        duration: 800
      }
    );
  }, [focusNodeId, reactFlowInstance]);

  const miniMapNodeColor = useCallback((node: Node) => {
    const kind = (node.data as FlowNodeData | undefined)?.meta?.kind;
    return kindAccentColors[kind as MapNodeMeta["kind"]] ?? "#cbd5e1";
  }, []);

  const cursorClass = isConnecting ? "connecting" : isPanning ? "is-panning" : "";

  return (
    <div
      className={`decode-canvas h-full w-full relative pan-mode ${cursorClass}`}
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
        edgeUpdaterRadius={20}
        connectionMode={ConnectionMode.Loose}
        snapToGrid
        snapGrid={[10, 10]}
        connectionLineStyle={{
          stroke: "#38bdf8",
          strokeWidth: 2.5,
          strokeDasharray: "8 4",
          pointerEvents: "none",
          transition: "stroke-width 0.2s ease"
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
        className={isDark ? "bg-[#030712]" : "bg-[#edf0f7]"}
      >
        <Background
          gap={20}
          size={1}
          color={isDark ? "#1e293b" : "#c1c8d4"}
        />
        <style>{`
          .decode-canvas.pan-mode,
          .decode-canvas.pan-mode .react-flow__pane,
          .decode-canvas.pan-mode .react-flow__background,
          .decode-canvas.pan-mode .react-flow__viewport,
          .decode-canvas.pan-mode .react-flow__renderer { cursor: grab !important; }
          .decode-canvas.pan-mode.is-panning,
          .decode-canvas.pan-mode.is-panning .react-flow__pane,
          .decode-canvas.pan-mode.is-panning .react-flow__background,
          .decode-canvas.pan-mode.is-panning .react-flow__viewport,
          .decode-canvas.pan-mode.is-panning .react-flow__renderer { cursor: grabbing !important; }
          .decode-canvas.connecting,
          .decode-canvas.connecting .react-flow__pane { cursor: crosshair !important; }
          .decode-canvas.connecting .react-flow__handle { opacity: 1 !important; width: 10px !important; height: 10px !important; }
          .react-flow__edgeupdater { cursor: move; }
          .react-flow__edgeupdater circle { r: 8; fill: #38bdf8; stroke: #0f172a; stroke-width: 2; }
        `}</style>
        <MiniMap
          pannable
          zoomable
          nodeStrokeWidth={2}
          nodeColor={miniMapNodeColor}
          maskColor={isDark ? "rgba(3,7,18,0.7)" : "rgba(241,243,248,0.75)"}
        />
        <Controls />
      </ReactFlow>
    </div>
  );
}
