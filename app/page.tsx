"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Connection,
  Edge,
  Node,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useEdgesState,
  useNodesState
} from "reactflow";
import DecodeMapCanvas, {
  FlowEdgeData,
  FlowNodeData
} from "../components/DecodeMapCanvas";
import NoteInspector from "../components/NoteInspector";
import { Sidebar, MapListItem } from "../components/Sidebar";
import { AdminPanel } from "../components/AdminPanel";
import { UpgradeModal } from "../components/UpgradeModal";
import { InviteModal } from "../components/InviteModal";
import { MembersModal } from "../components/MembersModal";
import { SettingsModal } from "../components/SettingsModal";
import { ConfirmDialog, InputDialog } from "../components/Dialogs";
import { DecodeMap, MapEdgeMeta, MapNodeMeta, Note, NodeKind, User, Workspace } from "../types/map";
import { initialMaps, initialUsers, initialWorkspaces } from "../data/initialData";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type FlowNode = Node<FlowNodeData>;
type FlowEdge = Edge<FlowEdgeData>;

const baseX = 240;
const baseY = 180;

const sanitizeHandle = (
  handle: string | null | undefined,
  role: "source" | "target"
) => {
  if (!handle) return null;
  const other = role === "source" ? "target" : "source";
  return handle.includes(other) ? handle.replace(other, role) : handle;
};

const now = () => new Date().toISOString();

function toFlowNodes(
  metas: MapNodeMeta[],
  onUpdateMeta: (meta: MapNodeMeta) => void
): FlowNode[] {
  return metas.map((meta, idx) => ({
    id: meta.id,
    type: "decodeNode",
    connectable: true,
    draggable: true,
    selectable: true,
    position: meta.position ?? {
      x: (idx % 3) * baseX + (idx % 2 === 0 ? 20 : 60),
      y: Math.floor(idx / 3) * baseY + 40
    },
    data: { meta, onUpdateMeta }
  }));
}

function toFlowEdges(edges: MapEdgeMeta[]): FlowEdge[] {
  return edges.map((edge) => {
    const fixedMeta: MapEdgeMeta = {
      ...edge,
      sourceHandle: sanitizeHandle(edge.sourceHandle, "source"),
      targetHandle: sanitizeHandle(edge.targetHandle, "target"),
      edgeType: "smoothstep"
    };

    return {
      id: fixedMeta.id,
      source: fixedMeta.sourceId,
      target: fixedMeta.targetId,
      sourceHandle: fixedMeta.sourceHandle ?? undefined,
      targetHandle: fixedMeta.targetHandle ?? undefined,
      label: fixedMeta.label ?? "",
      type: "smoothstep",
      className: "edge-glow",
      style: { strokeWidth: 1.6 },
      data: { meta: fixedMeta }
    };
  });
}

function nextKind(idx: number): NodeKind {
  const kinds: NodeKind[] = ["person", "system", "process", "generic"];
  return kinds[idx % kinds.length];
}

const defaultColorForKind = (kind: NodeKind) => {
  if (kind === "person") return "#38bdf8";
  if (kind === "system") return "#22c55e";
  if (kind === "process") return "#fbbf24";
  return "#6366f1";
};

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mapSummaries, setMapSummaries] = useState<MapListItem[]>([]);
  const [activeMap, setActiveMap] = useState<DecodeMap | null>(null);
  const [activeMapId, setActiveMapId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("decode-workspace-id");
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);
  const [useGradientEdges, setUseGradientEdges] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem("swaymaps-edge-style");
    if (stored === "solid") return false;
    if (stored === "gradient") return true;
    return true;
  });
  const [toast, setToast] = useState<string | null>(null);
  const [mapSearch, setMapSearch] = useState("");
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage.getItem("swaymaps-theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [inputDialog, setInputDialog] = useState<{
    open: boolean;
    title: string;
    placeholder?: string;
    initialValue?: string;
    onSubmit?: (value: string) => void;
  }>({ open: false, title: "" });
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message?: string;
    destructive?: boolean;
    onConfirm?: () => void;
  }>({ open: false, title: "" });

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdgeData>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const [viewportCenter, setViewportCenter] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("swaymaps-theme", theme);
    }
  }, [theme]);

  // Persist edge style preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("swaymaps-edge-style", useGradientEdges ? "gradient" : "solid");
  }, [useGradientEdges]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (workspaceId) {
      window.localStorage.setItem("decode-workspace-id", workspaceId);
    } else {
      window.localStorage.removeItem("decode-workspace-id");
    }
  }, [workspaceId]);

  // Update edge stroke color when theme changes so arrows adapt without reload.
  useEffect(() => {
    const stroke = theme === "dark" ? "#cbd5e1" : "#0f172a";
    setEdges((prev) =>
      prev.map((edge) => ({
        ...edge,
        style: (() => {
          const next = { ...(edge.style || {}) };
          next.strokeWidth = 1.6;
          if (useGradientEdges) {
            delete (next as any).stroke;
          } else {
            (next as any).stroke = stroke;
          }
          return next;
        })(),
        markerEnd: edge.markerEnd ? { ...edge.markerEnd, color: theme === "dark" ? "#fff" : "#000" } : edge.markerEnd,
        type: "smoothstep",
        className: "edge-glow",
        data: { meta: { ...edge.data.meta, edgeType: "smoothstep" } }
      }))
    );
  }, [theme, setEdges, useGradientEdges]);

  // Reapply edge types/styles when toggling gradient to ensure colors show up immediately.
  useEffect(() => {
    setEdges((prev) =>
      prev.map((edge) => {
        const nextStyle = { ...(edge.style || {}) };
        nextStyle.strokeWidth = 1.6;
        if (useGradientEdges) delete (nextStyle as any).stroke;
        else nextStyle.stroke = theme === "dark" ? "#cbd5e1" : "#0f172a";
        return {
          ...edge,
          type: "smoothstep",
          className: "edge-glow",
          style: nextStyle,
          data: { meta: { ...edge.data.meta, edgeType: "smoothstep" } }
        };
      })
    );
    setActiveMap((prev) =>
      prev
        ? {
            ...prev,
            edges: prev.edges.map((e) => ({ ...e, edgeType: "smoothstep" })),
            updatedAt: now()
          }
        : prev
    );
  }, [useGradientEdges, theme]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const load = async () => {
      try {
        const res = await fetch("/api/maps");
        const data = await res.json();
        const maps: MapListItem[] = (data.maps ?? []).map((m: any) => ({
          id: m.id,
          name: m.name,
          nodeCount: m.nodeCount ?? 0,
          ownerName: m.ownerName,
          ownerUserId: m.ownerUserId,
          workspaceId: m.workspaceId
        }));
        if (maps.length === 0) throw new Error("No maps from API");
        setMapSummaries(maps);
        setUsers(data.users ?? []);
        const firstUserId = (data.users ?? [])[0]?.id ?? null;
        setCurrentUserId(firstUserId);
        const workspacesFromApi: Workspace[] = data.workspaces ?? initialWorkspaces;
        setWorkspaces(workspacesFromApi);
        const storedWorkspaceId =
          typeof window !== "undefined" ? window.localStorage.getItem("decode-workspace-id") : null;
        const defaultWorkspace =
          workspacesFromApi.find((ws: Workspace) =>
            ws.members?.some((m: any) => m.userId === firstUserId)
          ) ?? workspacesFromApi[0] ?? null;
        const chosenWorkspace =
          (storedWorkspaceId && workspacesFromApi.find((ws) => ws.id === storedWorkspaceId)) ||
          defaultWorkspace;
        setWorkspaceId(chosenWorkspace?.id ?? null);
        const firstMap = chosenWorkspace
          ? maps.find((m) => m.workspaceId === chosenWorkspace.id)
          : null;
        setActiveMapId(firstMap?.id ?? maps[0].id);
      } catch (err) {
        // Fallback to local initial data
        const maps: MapListItem[] = initialMaps.map((m) => ({
          id: m.id,
          name: m.name,
          nodeCount: m.nodes.length,
          ownerName: initialUsers.find((u) => u.id === m.ownerUserId)?.name ?? "Owner",
          ownerUserId: m.ownerUserId,
          workspaceId: m.workspaceId
        }));
        setMapSummaries(maps);
        setUsers(initialUsers);
        setCurrentUserId(initialUsers[0]?.id ?? null);
        setWorkspaces(initialWorkspaces);
        const storedWorkspaceId =
          typeof window !== "undefined" ? window.localStorage.getItem("decode-workspace-id") : null;
        const fallbackWorkspace =
          (storedWorkspaceId && initialWorkspaces.find((ws) => ws.id === storedWorkspaceId)) ||
          initialWorkspaces[0] ||
          null;
        setWorkspaceId(fallbackWorkspace?.id ?? null);
        const firstMap = fallbackWorkspace
          ? maps.find((m) => m.workspaceId === fallbackWorkspace.id)
          : maps[0];
        setActiveMapId(firstMap?.id ?? null);
        const active = firstMap ? initialMaps.find((m) => m.id === firstMap.id) : initialMaps[0];
        if (active) {
          setActiveMap(active);
          setNodes(toFlowNodes(active.nodes ?? [], handleUpdateMeta));
          setEdges(toFlowEdges(active.edges ?? []));
        }
      }
    };
    load();
  }, [status]);

  useEffect(() => {
    if (session?.user?.id) {
      setCurrentUserId(session.user.id as string);
      const ws = workspaces.find((w) =>
        w.members.some((m) => m.userId === session.user?.id)
      );
      if (ws && !workspaceId) setWorkspaceId(ws.id);
    }
  }, [session?.user?.id, workspaces, workspaceId]);

  useEffect(() => {
    if (!activeMapId) return;
    const loadMap = async () => {
      try {
        const res = await fetch(`/api/maps/${activeMapId}/full`);
        if (!res.ok) throw new Error("Full map fetch failed");
        const data = await res.json();
        const map: DecodeMap = data.map;
        setActiveMap(map);
        setNodes(toFlowNodes(map.nodes, handleUpdateMeta));
        setEdges(toFlowEdges(map.edges));
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
      } catch (err) {
        const local = initialMaps.find((m) => m.id === activeMapId);
        if (local) {
        setActiveMap(local);
        setNodes(toFlowNodes(local.nodes, handleUpdateMeta));
        setEdges(toFlowEdges(local.edges));
        }
      }
    };
    loadMap();
  }, [activeMapId]);

  useEffect(() => {
    if (!workspaceId) return;
    const inWorkspace = mapSummaries.find(
      (m) => m.id === activeMapId && m.workspaceId === workspaceId
    );
    if (!inWorkspace) {
      const next = mapSummaries.find((m) => m.workspaceId === workspaceId);
      setActiveMapId(next?.id ?? null);
      if (!next) {
        setActiveMap(null);
        setNodes([]);
        setEdges([]);
      }
    }
  }, [workspaceId, mapSummaries, activeMapId, setNodes, setEdges]);

  const selectedMeta = useMemo(() => {
    if (!selectedNodeId) return null;
    const found = nodes.find((node) => node.id === selectedNodeId);
    return found?.data.meta ?? null;
  }, [nodes, selectedNodeId]);

  const selectedEdgeMeta = useMemo(() => {
    if (!selectedEdgeId || !activeMap) return null;
    return activeMap.edges.find((edge) => edge.id === selectedEdgeId) ?? null;
  }, [activeMap, selectedEdgeId]);

  const selectedNote = useMemo(() => {
    if (!selectedMeta || !activeMap) return null;
    return activeMap.notes.find((note) => note.id === selectedMeta.noteId) ?? null;
  }, [activeMap, selectedMeta]);

  const selectedEdgeNote = useMemo(() => {
    if (!selectedEdgeMeta || !activeMap || !selectedEdgeMeta.noteId) return null;
    return activeMap.notes.find((note) => note.id === selectedEdgeMeta.noteId) ?? null;
  }, [activeMap, selectedEdgeMeta]);

  const currentWorkspace = useMemo(
    () => workspaces.find((w) => w.id === workspaceId) ?? null,
    [workspaces, workspaceId]
  );

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) ?? null,
    [users, currentUserId]
  );

  const isFreePlan = currentUser?.plan === "free";
  const allowedMapId = useMemo(() => {
    if (!isFreePlan) return null;
    const list = workspaceId
      ? mapSummaries.filter((m) => m.workspaceId === workspaceId)
      : mapSummaries;
    return list[0]?.id ?? mapSummaries[0]?.id ?? null;
  }, [isFreePlan, mapSummaries, workspaceId]);
  const disabledMapIds = useMemo(() => {
    if (!isFreePlan) return [];
    const allow = allowedMapId;
    return mapSummaries.filter((m) => m.id !== allow).map((m) => m.id);
  }, [isFreePlan, mapSummaries, allowedMapId]);

  useEffect(() => {
    if (!isFreePlan) return;
    if (activeMapId && disabledMapIds.includes(activeMapId)) {
      setActiveMapId(allowedMapId);
    }
  }, [isFreePlan, disabledMapIds, activeMapId, allowedMapId]);

  const currentRole = useMemo(() => {
    if (!currentWorkspace || !currentUserId) return "viewer";
    return currentWorkspace.members.find((m) => m.userId === currentUserId)?.role ?? "viewer";
  }, [currentWorkspace, currentUserId]);

  const userWorkspaces = useMemo(
    () => workspaces.filter((ws) => currentUserId && ws.members.some((m) => m.userId === currentUserId)),
    [workspaces, currentUserId]
  );

  const mapsForWorkspace = useMemo(
    () =>
      (workspaceId
        ? mapSummaries.filter((m) => m.workspaceId === workspaceId)
        : mapSummaries
      ).filter((m) => m.name.toLowerCase().includes(mapSearch.toLowerCase())),
    [mapSummaries, workspaceId, mapSearch]
  );

  const ownedMapsCount = useMemo(
    () => mapSummaries.filter((m) => m.ownerUserId === currentUserId).length,
    [mapSummaries, currentUserId]
  );
const mapCreationBlocked = isFreePlan && ownedMapsCount >= 1;

  const ownedWorkspaceCount = useMemo(
    () => workspaces.filter((w) => w.ownerId === currentUserId).length,
    [workspaces, currentUserId]
  );
  const workspaceCreationBlocked = isFreePlan && ownedWorkspaceCount >= 1;

  const persistState = async (
    mapId: string | null,
    payload: { nodes: FlowNode[]; edges: MapEdgeMeta[]; notes: Note[] }
  ) => {
    if (!mapId) return;
    try {
      const serializedNodes = payload.nodes.map((node) => ({
        id: node.id,
        position: node.position,
        data: { meta: node.data.meta }
      }));
      const serializedEdges = payload.edges.map((edge) => ({
        ...edge,
        sourceHandle: edge.sourceHandle ?? null,
        targetHandle: edge.targetHandle ?? null
      }));
      const res = await fetch(`/api/maps/${mapId}/state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, nodes: serializedNodes, edges: serializedEdges })
      });
      if (!res.ok) {
        const msg = await res.text();
        console.error("Persist failed", res.status, msg);
      }
    } catch (err) {
      console.error("Failed to persist map state", err);
    }
  };

  const currentEdgesMeta = React.useCallback(
    () =>
      edges.map((e) => {
        return {
          ...e.data.meta,
          sourceHandle: sanitizeHandle(e.data.meta.sourceHandle),
          targetHandle: sanitizeHandle(e.data.meta.targetHandle),
          edgeType: e.data.meta.edgeType ?? "smoothstep"
        };
      }),
    [edges]
  );

  useEffect(() => {
    if (!activeMap) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      persistState(activeMap.id, {
        nodes,
        edges: edges.map((e) => e.data.meta),
        notes: activeMap.notes
      });
    }, 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, activeMap?.notes, activeMap?.id]);

  useEffect(() => {
    if (!activeMap) return;
    const mappedNodes = nodes.map((node) => ({
      ...node.data.meta,
      position: node.position
    }));
    const mappedEdges = edges.map((edge) => ({
      ...edge.data.meta,
      sourceHandle: edge.data.meta.sourceHandle ?? null,
      targetHandle: edge.data.meta.targetHandle ?? null,
      edgeType: "smoothstep"
    }));
    setActiveMap((prev) =>
      prev
        ? {
            ...prev,
            nodes: mappedNodes,
            edges: mappedEdges,
            updatedAt: now()
          }
        : prev
    );
    syncMapSummaryCounts(activeMap.id, mappedNodes.length);
  }, [nodes, edges]);

  const syncMapSummaryCounts = (mapId: string, nodeCount: number) => {
    setMapSummaries((prev) =>
      prev.map((m) => (m.id === mapId ? { ...m, nodeCount } : m))
    );
  };

  const handleConnectEdge = (connection: Connection) => {
    if (!connection.source || !connection.target || !activeMap) return;
    // If the user starts from a target handle, swap direction so the arrow points from drag-start to drop-end.
    let sourceId = connection.source;
    let targetId = connection.target;
    let sourceHandle = connection.sourceHandle ?? null;
    let targetHandle = connection.targetHandle ?? null;

    if (sourceHandle && sourceHandle.includes("target")) {
      [sourceId, targetId] = [targetId, sourceId];
      [sourceHandle, targetHandle] = [targetHandle, sourceHandle];
    }

    sourceHandle = sanitizeHandle(sourceHandle, "source");
    targetHandle = sanitizeHandle(targetHandle, "target");

    const id = crypto.randomUUID ? crypto.randomUUID() : `edge-${Date.now()}`;
    const meta: MapEdgeMeta = {
      id,
      sourceId,
      targetId,
      sourceHandle,
      targetHandle,
      label: "",
      noteId: null,
      edgeType: "smoothstep"
    };

    const nextEdgesMeta = [...currentEdgesMeta(), meta];

    setEdges((eds) =>
      addEdge(
        {
          id,
          source: meta.sourceId,
          target: meta.targetId,
          sourceHandle: meta.sourceHandle ?? undefined,
          targetHandle: meta.targetHandle ?? undefined,
      type: "smoothstep",
      markerEnd: { type: "arrowclosed", color: theme === "dark" ? "#fff" : "#000" },
      className: "edge-glow",
      data: { meta }
    },
        eds
      )
    );
    persistState(activeMap.id, { nodes, edges: nextEdgesMeta, notes: activeMap.notes });
    setActiveMap((prev) =>
      prev
        ? {
            ...prev,
            edges: [...prev.edges, meta],
            updatedAt: now()
          }
        : prev
    );
  };

  const handleSelectNode = (meta: MapNodeMeta) => {
    setSelectedNodeId(meta.id);
    setSelectedEdgeId(null);
  };

  const handleSelectEdge = (edgeData: FlowEdgeData) => {
    const meta = edgeData.meta;
    setSelectedEdgeId(meta.id);
    setSelectedNodeId(null);
    if (activeMap && !meta.noteId) {
      const noteId = crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}`;
      const newNote: Note = {
        id: noteId,
        title: "Edge note",
        tags: [],
        content: "",
        createdAt: now(),
        updatedAt: now()
      };
      const updatedEdge = { ...meta, noteId };
      setActiveMap((prev) =>
        prev
          ? {
              ...prev,
              edges: prev.edges.map((e) => (e.id === meta.id ? updatedEdge : e)),
              notes: [...prev.notes, newNote],
              updatedAt: now()
            }
          : prev
      );
      setEdges((prev) =>
        prev.map((e) => (e.id === meta.id ? { ...e, data: { meta: updatedEdge } } : e))
      );
      setSelectedEdgeId(meta.id);
    }
  };

  const handleClearSelection = () => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  };

  const handleNoteChange = (updated: Note) => {
    if (!activeMap) return;
    setActiveMap((prev) =>
      prev
        ? {
            ...prev,
            notes: prev.notes.map((note) => (note.id === updated.id ? updated : note)),
            nodes: prev.nodes.map((node) =>
              node.noteId === updated.id ? { ...node, title: updated.title } : node
            ),
            updatedAt: now()
          }
        : prev
    );

    setNodes((prev) =>
      prev.map((node) =>
        node.data.meta.noteId === updated.id
          ? { ...node, data: { ...node.data, meta: { ...node.data.meta, title: updated.title } } }
          : node
      )
    );
  };

  const handleUpdateTags = (tags: string[]) => {
    if (!selectedMeta || !activeMap) return;
    setActiveMap((prev) =>
      prev
        ? {
            ...prev,
            nodes: prev.nodes.map((node) =>
              node.id === selectedMeta.id ? { ...node, tags } : node
            ),
            updatedAt: now()
          }
        : prev
    );
    setNodes((prev) =>
      prev.map((node) =>
        node.id === selectedMeta.id
          ? { ...node, data: { ...node.data, meta: { ...node.data.meta, tags } } }
          : node
      )
    );
  };

  const handleUpdateMeta = (meta: MapNodeMeta) => {
    if (!activeMap) return;
    setActiveMap((prev) =>
      prev
        ? {
            ...prev,
            nodes: prev.nodes.map((node) => (node.id === meta.id ? meta : node)),
            notes: prev.notes.map((note) =>
              note.id === meta.noteId ? { ...note, title: meta.title } : note
            ),
            updatedAt: now()
          }
        : prev
    );
    setNodes((prev) =>
      prev.map((node) =>
        node.id === meta.id
          ? { ...node, data: { ...node.data, meta, onUpdateMeta: handleUpdateMeta } }
          : node
      )
    );
  };

  const handleUpdateEdge = (edge: MapEdgeMeta) => {
    if (!activeMap) return;
    const finalEdge = {
      ...edge,
      edgeType: edge.edgeType ?? (useGradientEdges ? "gradient" : "basic")
    };
    setActiveMap((prev) =>
      prev
        ? {
            ...prev,
            edges: prev.edges.map((e) => (e.id === edge.id ? finalEdge : e)),
            updatedAt: now()
          }
        : prev
    );
    setEdges((prev) =>
      prev.map((e) =>
        e.id === edge.id
          ? {
              ...e,
              label: finalEdge.label ?? "",
              type: "smoothstep",
              sourceHandle: finalEdge.sourceHandle ?? e.sourceHandle,
              targetHandle: finalEdge.targetHandle ?? e.targetHandle,
              className: "edge-glow",
              data: { meta: finalEdge }
            }
          : e
      )
    );
  };

  const handleEdgeUpdate = (oldEdge: FlowEdge, newConnection: Connection) => {
    let sourceId = newConnection.source ?? oldEdge.source;
    let targetId = newConnection.target ?? oldEdge.target;
    let sourceHandle = newConnection.sourceHandle ?? oldEdge.sourceHandle ?? null;
    let targetHandle = newConnection.targetHandle ?? oldEdge.targetHandle ?? null;

    if (sourceHandle && sourceHandle.includes("target")) {
      [sourceId, targetId] = [targetId, sourceId];
      [sourceHandle, targetHandle] = [targetHandle, sourceHandle];
    }

    sourceHandle = sanitizeHandle(sourceHandle, "source");
    targetHandle = sanitizeHandle(targetHandle, "target");

    const updatedMeta: MapEdgeMeta = {
      ...(oldEdge.data.meta as MapEdgeMeta),
      sourceId,
      targetId,
      sourceHandle,
      targetHandle,
      edgeType: "smoothstep"
    };
    setEdges((eds) =>
      eds.map((edge) =>
        edge.id === oldEdge.id
          ? {
              ...edge,
              source: updatedMeta.sourceId,
              target: updatedMeta.targetId,
              sourceHandle: updatedMeta.sourceHandle ?? undefined,
              targetHandle: updatedMeta.targetHandle ?? undefined,
              data: { meta: updatedMeta },
              type: "smoothstep"
            }
          : edge
      )
    );
    const nextEdgesMeta = currentEdgesMeta().map((m) => (m.id === oldEdge.id ? updatedMeta : m));
    if (activeMap) {
      persistState(activeMap.id, { nodes, edges: nextEdgesMeta, notes: activeMap.notes });
    }
    setActiveMap((prev) =>
      prev
        ? {
            ...prev,
            edges: prev.edges.map((e) => (e.id === oldEdge.id ? updatedMeta : e)),
            updatedAt: now()
          }
        : prev
    );
  };

  const handleUpdateNodeColor = (color: string) => {
    if (!selectedMeta) return;
    handleUpdateMeta({ ...selectedMeta, color });
  };

  const handleFocusNode = (id: string) => {
    setFocusNodeId(id);
    setTimeout(() => setFocusNodeId(null), 500);
  };

  const pinOptions = useMemo(() => {
    if (!activeMap) return [];
    return activeMap.nodes
      .map((n) => {
        const tag = n.tags.find((t) => t.startsWith("__pin:"));
        if (!tag) return null;
        return { id: n.id, label: tag.replace("__pin:", "") || n.title };
      })
      .filter(Boolean) as { id: string; label: string }[];
  }, [activeMap]);

  const addNodeToMap = (targetMap: DecodeMap) => {
    const baseNode =
      targetMap.id === activeMap?.id
        ? (selectedNodeId && nodes.find((n) => n.id === selectedNodeId)) || nodes[0] || null
        : null;
    const basePos = viewportCenter ?? baseNode?.position ?? { x: 100, y: 100 };
    const position = { x: basePos.x, y: basePos.y };
    const id = crypto.randomUUID ? crypto.randomUUID() : `node-${Date.now()}`;
    const noteId = crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}`;
    const kind = nextKind(nodes.length);
    const meta: MapNodeMeta = {
      id,
      kind,
      kindLabel: kind.charAt(0).toUpperCase() + kind.slice(1),
      title: "New Node",
      tags: [],
      noteId,
      color: defaultColorForKind(kind),
      position
    };
    const note: Note = {
      id: noteId,
      title: "New Note",
      tags: [],
      content: "Add details here...",
      createdAt: now(),
      updatedAt: now()
    };

    setActiveMap((prev) => {
      const mapRef = prev && prev.id === targetMap.id ? prev : targetMap;
      return mapRef
        ? {
            ...mapRef,
            nodes: [...(mapRef.nodes ?? []), meta],
            notes: [...(mapRef.notes ?? []), note],
            updatedAt: now()
          }
        : prev;
    });
    setNodes((prev) => [
      ...prev,
      { id, type: "decodeNode", position: meta.position!, data: { meta, onUpdateMeta: handleUpdateMeta } }
    ]);
    const currentCount =
      targetMap.id === activeMap?.id ? nodes.length : (targetMap.nodes?.length ?? 0);
    syncMapSummaryCounts(targetMap.id, currentCount + 1);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  };

  const handleAddNode = () => {
    if (!activeMap) {
      if (currentRole === "viewer" || currentRole === "editor") {
        setToast("Only owners/admins can create maps in this workspace.");
        return;
      }
      if (mapCreationBlocked) {
        setToast("Free plan allows 1 map. Upgrade to create more.");
        setShowUpgrade(true);
        return;
      }
      const ownerId = session?.user?.id ?? currentUserId ?? users[0]?.id;
      setInputDialog({
        open: true,
        title: "Name this board to add a node",
        placeholder: "Board name",
        onSubmit: async (name) => {
          const res = await fetch("/api/maps", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, ownerUserId: ownerId ?? undefined, workspaceId })
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setToast(data.error ?? "Could not create map. Please try again.");
            return;
          }
          const map = await res.json();
          const workspaceForMap = workspaceId ?? map.workspaceId ?? null;
          const newMap: DecodeMap = {
            id: map.id,
            name: map.name,
            nodes: [],
            edges: [],
            notes: [],
            ownerUserId: ownerId ?? null,
            workspaceId: workspaceForMap,
            createdAt: map.createdAt ?? now(),
            updatedAt: now()
          };
          setMapSummaries((prev) => [
            {
              id: map.id,
              name: map.name,
              nodeCount: 0,
              ownerName: users.find((u) => u.id === ownerId)?.name,
              ownerUserId: ownerId ?? undefined,
              workspaceId: workspaceForMap ?? undefined
            },
            ...prev
          ]);
          setActiveMap(newMap);
          setActiveMapId(map.id);
          setNodes([]);
          setEdges([]);
          setSelectedNodeId(null);
          setSelectedEdgeId(null);
          setToast("Map created");
          addNodeToMap(newMap);
        }
      });
      return;
    }

    addNodeToMap(activeMap);
  };

  // Shortcut: "N" to add a new node (ignored when typing in inputs).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "n" || e.key === "N") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName?.toLowerCase();
        const isEditable =
          tag === "input" ||
          tag === "textarea" ||
          tag === "select" ||
          target?.isContentEditable;
        if (isEditable) return;
        e.preventDefault();
        handleAddNode();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleAddNode]);

  const handleResetLayout = async () => {
    if (!activeMapId) return;
    try {
      const res = await fetch(`/api/maps/${activeMapId}/full`);
      if (!res.ok) throw new Error("reset failed");
      const data = await res.json();
      const map: DecodeMap = data.map;
      setActiveMap(map);
      setNodes(toFlowNodes(map.nodes, handleUpdateMeta));
      setEdges(toFlowEdges(map.edges));
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setToast("Layout reset");
    } catch {
      const local = initialMaps.find((m) => m.id === activeMapId);
      if (local) {
        setActiveMap(local);
        setNodes(toFlowNodes(local.nodes, handleUpdateMeta));
        setEdges(toFlowEdges(local.edges));
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setToast("Layout reset");
      } else {
        setToast("Could not reset layout");
      }
    }
  };

  const handleCreateNodeAt = (
    position: { x: number; y: number },
    from: { nodeId: string; handleId?: string }
  ) => {
    if (!activeMap) return;
    // Create node then edge; ensure edge targets a valid handle on the new node.
    const id = crypto.randomUUID ? crypto.randomUUID() : `node-${Date.now()}`;
    const noteId = crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}`;
    const kind = nextKind(nodes.length);
    const meta: MapNodeMeta = {
      id,
      kind,
      kindLabel: kind.charAt(0).toUpperCase() + kind.slice(1),
      title: "New Node",
      tags: [],
      noteId,
      color: defaultColorForKind(kind),
      position
    };
    const note: Note = {
      id: noteId,
      title: "New Note",
      tags: [],
      content: "Add details here...",
      createdAt: now(),
      updatedAt: now()
    };
    const edgeId = crypto.randomUUID ? crypto.randomUUID() : `edge-${Date.now()}`;
    const edgeMeta: MapEdgeMeta = {
      id: edgeId,
      sourceId: from.nodeId,
      targetId: id,
      sourceHandle: sanitizeHandle(from.handleId, "source"),
      targetHandle: "top-target",
      label: "",
      noteId: null,
      edgeType: "smoothstep"
    };
    setActiveMap((prev) =>
      prev
        ? {
            ...prev,
            nodes: [...prev.nodes, meta],
            edges: [...prev.edges, edgeMeta],
            notes: [...prev.notes, note],
            updatedAt: now()
          }
        : prev
    );
    setNodes((prev) => [
      ...prev,
      { id, type: "decodeNode", position: meta.position!, data: { meta, onUpdateMeta: handleUpdateMeta } }
    ]);
    setEdges((eds) => [
      ...eds,
      {
        id: edgeId,
        source: edgeMeta.sourceId,
        target: edgeMeta.targetId,
      sourceHandle: edgeMeta.sourceHandle ?? undefined,
      targetHandle: edgeMeta.targetHandle ?? undefined,
      type: "smoothstep",
      animated: true,
      markerEnd: { type: "arrowclosed", color: theme === "dark" ? "#fff" : "#000" },
      className: "edge-glow",
      data: { meta: edgeMeta }
    }
    ]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
    syncMapSummaryCounts(activeMap.id, (activeMap.nodes.length ?? 0) + 1);
  };

  const handleCreateMap = () => {
    if (currentRole === "viewer" || currentRole === "editor") {
      setToast("Only owners/admins can create maps in this workspace.");
      return;
    }
    const ownerId = session?.user?.id ?? currentUserId ?? users[0]?.id;
    if (mapCreationBlocked) {
      setToast("Free plan allows 1 map. Upgrade to create more.");
      setShowUpgrade(true);
      return;
    }

    setInputDialog({
      open: true,
      title: "New board",
      placeholder: "Board name",
      onSubmit: async (name) => {
        const res = await fetch("/api/maps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, ownerUserId: ownerId ?? undefined, workspaceId })
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setToast(data.error ?? "Could not create map. Please try again.");
          return;
        }
        const map = await res.json();
        setMapSummaries((prev) => [
          {
            id: map.id,
            name: map.name,
            nodeCount: 0,
            ownerName: users.find((u) => u.id === ownerId)?.name,
            ownerUserId: ownerId ?? undefined,
            workspaceId: workspaceId ?? map.workspaceId
          },
          ...prev
        ]);
        setActiveMapId(map.id);
        setToast("Map created");
      }
    });
  };

  const handleDeleteMap = async (id: string) => {
    if (currentRole === "viewer" || currentRole === "editor") {
      setToast("Only owners/admins can delete maps.");
      return;
    }
    setConfirmDialog({
      open: true,
      title: "Delete board",
      message: "This cannot be undone. Delete this board?",
      destructive: true,
      onConfirm: async () => {
        await fetch(`/api/maps/${id}`, { method: "DELETE" });
        setMapSummaries((prev) => {
          const filtered = prev.filter((m) => m.id !== id);
          if (activeMapId === id) {
            const nextId = filtered[0]?.id ?? null;
            setActiveMap(null);
            setNodes([]);
            setEdges([]);
            setSelectedEdgeId(null);
            setSelectedNodeId(null);
            setActiveMapId(nextId);
          }
          return filtered;
        });
      }
    });
  };

  const handleCreateUser = async (name?: string, color?: string) => {
    const finalName = name ?? "";
    setInputDialog({
      open: true,
      title: "Add user",
      placeholder: "Name",
      initialValue: finalName,
      onSubmit: async (val) => {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: val.trim(), color })
        });
        if (!res.ok) return;
        const user = await res.json();
        setUsers((prev) => [...prev, user]);
        setCurrentUserId(user.id);
      }
    });
  };

  const handleCreateWorkspace = () => {
    if (workspaceCreationBlocked) {
      setToast("Free plan allows 1 workspace. Upgrade to add more.");
      setShowUpgrade(true);
      return;
    }
    setInputDialog({
      open: true,
      title: "New workspace",
      placeholder: "Workspace name",
      onSubmit: async (name) => {
        const res = await fetch("/api/workspaces", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setToast(data.error ?? "Could not create workspace.");
          return;
        }
        const ws = await res.json();
        setWorkspaces((prev) => [...prev, ws]);
        setWorkspaceId(ws.id);
      }
    });
  };

  const handleRenameWorkspace = (id: string) => {
    const current = workspaces.find((w) => w.id === id)?.name ?? "";
    setInputDialog({
      open: true,
      title: "Rename workspace",
      placeholder: "Workspace name",
      initialValue: current,
      onSubmit: async (name) => {
        const res = await fetch(`/api/workspaces/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setToast(data.error ?? "Could not rename workspace.");
          return;
        }
        setWorkspaces((prev) => prev.map((w) => (w.id === id ? { ...w, name } : w)));
      }
    });
  };

  const handleDeleteWorkspace = async (id: string) => {
    try {
      await fetch(`/api/workspaces/${id}`, { method: "DELETE" });
    } catch {
      // ignore failure; proceed with local cleanup
    }
    setWorkspaces((prev) => prev.filter((w) => w.id !== id));
    setMapSummaries((prev) => prev.filter((m) => m.workspaceId !== id));
    if (workspaceId === id) {
      const nextWs = workspaces.find((w) => w.id !== id) ?? workspaces[0] ?? null;
      setWorkspaceId(nextWs?.id ?? null);
      const nextMap = mapSummaries.find((m) => m.workspaceId === nextWs?.id) ?? null;
      setActiveMapId(nextMap?.id ?? null);
      if (!nextMap) {
        setActiveMap(null);
        setNodes([]);
        setEdges([]);
      }
    }
  };

  const handleRenameMap = async (id: string) => {
    const current = mapSummaries.find((m) => m.id === id)?.name ?? activeMap?.name ?? "";
    setInputDialog({
      open: true,
      title: "Rename board",
      placeholder: "Board name",
      initialValue: current,
      onSubmit: async (name) => {
        await fetch(`/api/maps/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        });
        setMapSummaries((prev) =>
          prev.map((m) => (m.id === id ? { ...m, name } : m))
        );
        setActiveMap((prev) => (prev?.id === id ? { ...prev, name } : prev));
      }
    });
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  const handleChangeMemberRole = async (userId: string, role: Workspace["members"][number]["role"]) => {
    if (!workspaceId) return;
    const res = await fetch(`/api/workspaces/${workspaceId}/members`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setToast(data.error ?? "Unable to change role");
      return;
    }
    const data = await res.json();
    const updated = data.workspace as Workspace;
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === updated.id ? { ...ws, members: updated.members } : ws))
    );
    setToast("Role updated");
  };

  const handleRemoveMember = async (userId: string) => {
    if (!workspaceId) return;
    const res = await fetch(`/api/workspaces/${workspaceId}/members`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setToast(data.error ?? "Unable to remove member");
      return;
    }
    const data = await res.json();
    const updated = data.workspace as Workspace;
    setWorkspaces((prev) =>
      prev.map((ws) => (ws.id === updated.id ? { ...ws, members: updated.members } : ws))
    );
    setToast("Member removed");
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading...
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen relative ${theme === "dark" ? "bg-[#050b15] text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      {sidebarOpen ? (
        <Sidebar
          maps={mapsForWorkspace}
          activeMapId={activeMapId}
          onSelectMap={(id) => setActiveMapId(id)}
          onCreateMap={handleCreateMap}
          onDeleteMap={handleDeleteMap}
          onClose={() => setSidebarOpen(false)}
          createDisabled={mapCreationBlocked}
          disabledMapIds={disabledMapIds}
          planLabel={users.find((u) => u.id === currentUserId)?.plan ?? "free"}
          onInvite={currentWorkspace ? () => setShowInvite(true) : undefined}
          onSettings={() => {
            setShowSettings(true);
          }}
          onMembers={() => setShowMembers(true)}
          onUpgrade={() => setShowUpgrade(true)}
          authLabel={session ? "Sign out" : "Sign in"}
          onAuthClick={() => (session ? handleSignOut() : signIn())}
          onEmbedMap={(id) => {
            const embed = `<iframe src="${window.location.origin}?map=${id}" width="100%" height="600" style="border:0;"></iframe>`;
            try {
              navigator.clipboard?.writeText(embed);
              setToast("Embed code copied");
            } catch {
              alert(embed);
            }
          }}
          onBoardInvite={(id) => {
            setActiveMapId(id);
            setShowInvite(true);
          }}
          onRename={(id) => handleRenameMap(id)}
          search={mapSearch}
          onSearchChange={(val) => setMapSearch(val)}
          theme={theme}
          workspaces={userWorkspaces}
          currentWorkspaceId={workspaceId}
          onSelectWorkspace={(id) => setWorkspaceId(id)}
        />
      ) : (
        <div
          className="w-3 cursor-pointer"
          onMouseEnter={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        />
      )}

      <div className="flex flex-1 flex-col">
        <header
          className={`flex items-center justify-between border-b px-6 py-4 shadow-sm backdrop-blur ${
            theme === "dark" ? "border-slate-800 bg-[#050b15]" : "border-slate-200 bg-white/90"
          }`}
        >
          <div className="space-y-1">
            <input
              className={`w-full max-w-md border-0 bg-transparent text-xl font-semibold outline-none focus:ring-0 ${
                theme === "dark" ? "text-slate-100" : "text-slate-900"
              }`}
              value={activeMap?.name ?? ""}
              onChange={(e) =>
                setActiveMap((prev) => (prev ? { ...prev, name: e.target.value } : prev))
              }
              onBlur={async (e) => {
                if (!activeMap) return;
                const newName = e.target.value.trim();
                if (!newName) return;
                await fetch(`/api/maps/${activeMap.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name: newName })
                });
                setActiveMap((prev) => (prev ? { ...prev, name: newName } : prev));
                setMapSummaries((prev) =>
                  prev.map((m) => (m.id === activeMap.id ? { ...m, name: newName } : m))
                );
              }}
              placeholder="Board name"
            />
          </div>
          <div className="flex items-center gap-3">
            {pinOptions.length > 0 && (
              <select
                className={`rounded-md border px-3 py-2 text-sm font-semibold shadow-sm ${
                  theme === "dark"
                    ? "border-slate-700 bg-[#0b1422] text-slate-100"
                    : "border-slate-200 bg-white text-slate-800"
                }`}
                onChange={(e) => {
                  const id = e.target.value;
                  if (id) handleFocusNode(id);
                }}
                defaultValue=""
              >
                <option value="">Pins</option>
                {pinOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            )}
            <div className="flex items-center gap-2">
              <button
                className={`rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
                  theme === "dark" ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-900 hover:bg-slate-800"
                }`}
                onClick={handleAddNode}
              >
                Add Node (N)
              </button>
              <button
                className={`rounded-md border px-3 py-2 text-sm font-semibold shadow-sm transition ${
                  theme === "dark"
                    ? "border-slate-600 text-slate-100 hover:border-slate-500 hover:bg-slate-700"
                    : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
                onClick={handleResetLayout}
              >
                Reset Layout
              </button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 overflow-hidden">
          <section className={`flex-1 ${theme === "dark" ? "bg-[#050b15]" : "bg-slate-50"}`}>
            <div className="h-full w-full p-4">
              <div
      className={`h-full overflow-hidden rounded-xl border shadow ${
        theme === "dark" ? "border-slate-800 bg-[#0b1422]" : "border-slate-200 bg-white"
      }`}
    >
                <DecodeMapCanvas
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onSelectNode={handleSelectNode}
        onSelectEdge={handleSelectEdge}
        onClearSelection={handleClearSelection}
                onConnectEdge={handleConnectEdge}
          onEdgeUpdate={handleEdgeUpdate}
          onCreateNodeAt={handleCreateNodeAt}
          focusNodeId={focusNodeId}
          theme={theme}
          useGradientEdges={useGradientEdges}
          onViewportCenterChange={setViewportCenter}
        />
            </div>
          </div>
        </section>
          {(selectedMeta || selectedEdgeMeta) && (
            <aside
              className={`w-[380px] border-l ${
                theme === "dark" ? "border-[#0f172a] bg-[#040915]" : "border-slate-200 bg-white"
              }`}
            >
              <NoteInspector
                selectedNote={selectedNote}
                selectedMeta={selectedMeta}
                selectedEdge={selectedEdgeMeta}
                selectedEdgeNote={selectedEdgeNote}
                onChange={handleNoteChange}
                onUpdateTags={handleUpdateTags}
                onUpdateMeta={handleUpdateMeta}
                onUpdateEdge={handleUpdateEdge}
                onUpdateNodeColor={handleUpdateNodeColor}
                onFocusNode={handleFocusNode}
                onNoSelectionMessage="Click a node or connection on the map to view or edit its note."
              />
            </aside>
          )}
        </main>
      </div>
      {showInvite && workspaceId && (
        <InviteModal
          onInvite={async (email, role) => {
            const res = await fetch(`/api/workspaces/${workspaceId}/invite`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, role })
            });
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error(data.error ?? "Invite failed");
            }
            setToast("Invite sent");
          }}
          onClose={() => setShowInvite(false)}
        />
      )}
      {showMembers && currentWorkspace && (
        <MembersModal
          workspace={currentWorkspace}
          users={users}
          onChangeRole={handleChangeMemberRole}
          onRemove={handleRemoveMember}
          onInvite={() => setShowInvite(true)}
          onClose={() => setShowMembers(false)}
        />
      )}
      <InputDialog
        open={inputDialog.open}
        title={inputDialog.title}
        placeholder={inputDialog.placeholder}
        initialValue={inputDialog.initialValue}
        onCancel={() => setInputDialog({ open: false, title: "" })}
        onConfirm={(val) => {
          const fn = inputDialog.onSubmit;
          setInputDialog({ open: false, title: "" });
          fn?.(val);
        }}
      />
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        destructive={confirmDialog.destructive}
        onCancel={() => setConfirmDialog({ open: false, title: "" })}
        onConfirm={() => {
          const fn = confirmDialog.onConfirm;
          setConfirmDialog({ open: false, title: "" });
          fn?.();
        }}
      />
      {showSettings && (
        <SettingsModal
          workspace={currentWorkspace}
          users={users}
          currentUser={users.find((u) => u.id === currentUserId) ?? null}
          workspaces={workspaces}
          onSelectWorkspace={(id) => setWorkspaceId(id)}
          onChangeRole={handleChangeMemberRole}
          onRemove={handleRemoveMember}
          onCreateWorkspace={handleCreateWorkspace}
          workspaceCreateDisabled={workspaceCreationBlocked}
          onRenameWorkspace={handleRenameWorkspace}
          onDeleteWorkspace={handleDeleteWorkspace}
          onUpgrade={() => setShowUpgrade(true)}
          onCancelSubscription={async () => {
            setConfirmDialog({
              open: true,
              title: "Cancel subscription?",
              message:
                "Your plan will move to free. Data is kept for 90 days and then deleted unless you resubscribe.",
              destructive: true,
              onConfirm: async () => {
                await fetch("/api/plan/upgrade", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ plan: "free" })
                });
                setUsers((prev) =>
                  prev.map((u) => (u.id === currentUserId ? { ...u, plan: "free" } : u))
                );
                setToast("Subscription cancelled");
              }
            });
          }}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          useGradientEdges={useGradientEdges}
          onToggleGradientEdges={() => setUseGradientEdges((v) => !v)}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showUpgrade && (
        <UpgradeModal
          currentUser={users.find((u) => u.id === currentUserId)}
          onSelectPlan={async (plan) => {
            const res = await fetch("/api/plan/upgrade", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ plan })
            });
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              throw new Error(data.error ?? "Upgrade failed");
            }
            setUsers((prev) =>
              prev.map((u) =>
                u.id === currentUserId ? { ...u, plan } : u
              )
            );
            setToast(`Plan updated to ${plan}`);
          }}
          onClose={() => setShowUpgrade(false)}
        />
      )}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
          <button className="ml-2 text-xs text-slate-200" onClick={() => setToast(null)}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
