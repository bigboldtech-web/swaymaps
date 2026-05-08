"use client";

import * as React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  type Connection,
  type DefaultEdgeOptions,
  type FitViewOptions,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import { ArrowLeft, Loader2, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { toast } from "@/components/ui/Toast";

export interface GraphEditorState {
  nodes: Node[];
  edges: Edge[];
}

interface GraphEditorShellProps {
  mapId: string;
  initialName: string;
  initialState: GraphEditorState;
  nodeTypes: NodeTypes;
  edgeTypes?: EdgeTypes;
  defaultEdgeOptions?: DefaultEdgeOptions;
  fitViewOptions?: FitViewOptions;
  toolbarExtras?: React.ReactNode;
  onAddNode?: (api: GraphAPI) => void;
  onBack?: () => void;
}

export interface GraphAPI {
  nodes: Node[];
  edges: Edge[];
  setNodes: (n: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (e: Edge[] | ((prev: Edge[]) => Edge[])) => void;
}

/**
 * Shared editor shell for all ReactFlow-based map types
 * (mind map, flowchart, org chart, product flow). Handles persistence,
 * top bar, save status, fit view, and a default toolbar.
 */
export function GraphEditorShell(props: GraphEditorShellProps) {
  return (
    <ReactFlowProvider>
      <Inner {...props} />
    </ReactFlowProvider>
  );
}

function Inner({
  mapId,
  initialName,
  initialState,
  nodeTypes,
  edgeTypes,
  defaultEdgeOptions,
  fitViewOptions,
  toolbarExtras,
  onAddNode,
  onBack,
}: GraphEditorShellProps) {
  const [name, setName] = React.useState(initialName);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialState.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialState.edges);
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  // Mark dirty whenever nodes or edges change
  React.useEffect(() => {
    setDirty(true);
  }, [nodes, edges]);

  // Auto-save (1.5s debounce)
  React.useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => save(), 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, dirty]);

  const save = React.useCallback(async () => {
    setSaving(true);
    try {
      await fetch(`/api/maps/${mapId}/canvas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: { nodes, edges } }),
      });
      setDirty(false);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [mapId, nodes, edges]);

  const renameMap = async (newName: string) => {
    setName(newName);
    await fetch(`/api/maps/${mapId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
  };

  const onConnect = React.useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "smoothstep" }, eds)
      ),
    [setEdges]
  );

  const api: GraphAPI = { nodes, edges, setNodes, setEdges };

  return (
    <div className="flex h-screen w-full flex-col bg-bg text-fg">
      <header className="flex h-12 items-center justify-between border-b border-border bg-bg px-3">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <Button variant="ghost" size="icon-sm" aria-label="Back" onClick={onBack}>
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
          {onAddNode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus />}
                  onClick={() => onAddNode(api)}
                >
                  Add
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add a node</TooltipContent>
            </Tooltip>
          )}
          {toolbarExtras}
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

      <div className="relative flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          fitViewOptions={fitViewOptions ?? { padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={24} size={1} color="rgba(0,0,0,0.08)" />
          <Controls position="bottom-right" />
          <MiniMap
            position="bottom-left"
            pannable
            zoomable
            nodeColor={() => "var(--color-fg-muted)"}
            maskColor="rgba(0,0,0,0.04)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
