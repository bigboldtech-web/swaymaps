"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Connection,
  Edge,
  Node,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
  MarkerType
} from "reactflow";
import DecodeMapCanvas, {
  FlowEdgeData,
  FlowNodeData
} from "../../components/DecodeMapCanvas";
import NoteInspector from "../../components/NoteInspector";
import { Sidebar, MapListItem } from "../../components/Sidebar";
import { UpgradeModal } from "../../components/UpgradeModal";
import { InviteModal } from "../../components/InviteModal";
import { MembersModal } from "../../components/MembersModal";
import { SettingsModal } from "../../components/SettingsModal";
import { AiAssistantModal } from "../../components/AiAssistantModal";
import { ShareModal } from "../../components/ShareModal";
import { ExportModal } from "../../components/ExportModal";
import { SearchModal } from "../../components/SearchModal";
import { OnboardingWizard } from "../../components/OnboardingWizard";
import { CanvasToolbar } from "../../components/CanvasToolbar";
import { CanvasContextMenu } from "../../components/CanvasContextMenu";
import { CanvasSearchBar } from "../../components/CanvasSearchBar";
import { ConfirmDialog, InputDialog } from "../../components/Dialogs";
import { exportAsPng, exportAsSvg, exportAsPdf, exportAsJson } from "../../lib/exportMap";
import { useUndoRedo } from "../../lib/useUndoRedo";
import { DecodeMap, MapEdgeMeta, MapNodeMeta, Note, NodeKind, User, Workspace } from "../../types/map";
import { AiBrainstormPlan, AiMode } from "../../types/ai";
import { initialMaps, initialUsers, initialWorkspaces } from "../../data/initialData";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      edgeType: edge.edgeType ?? "smoothstep"
    };
    const flowType = fixedMeta.edgeType ?? "smoothstep";

    return {
      id: fixedMeta.id,
      source: fixedMeta.sourceId,
      target: fixedMeta.targetId,
      sourceHandle: fixedMeta.sourceHandle ?? undefined,
      targetHandle: fixedMeta.targetHandle ?? undefined,
      label: fixedMeta.label ?? "",
          type: flowType,
          className: "edge-glow",
          style: { strokeWidth: 1.6 },
          data: { meta: fixedMeta }
        };
  });
}

function nextKind(idx: number): NodeKind {
  const kinds: NodeKind[] = ["person", "system", "process", "database", "api", "queue", "cache", "cloud", "team", "vendor", "generic"];
  return kinds[idx % kinds.length];
}

const defaultColorForKind = (kind: NodeKind) => {
  switch (kind) {
    case "person": return "#38bdf8";
    case "system": return "#22c55e";
    case "process": return "#fbbf24";
    case "database": return "#6366f1";
    case "api": return "#0ea5e9";
    case "queue": return "#f59e0b";
    case "cache": return "#ef4444";
    case "cloud": return "#8b5cf6";
    case "team": return "#14b8a6";
    case "vendor": return "#f97316";
    default: return "#6366f1";
  }
};

const withCommentArray = (note: Note): Note => ({
  ...note,
  comments: note.comments ?? []
});

const normalizeTitle = (title: string) => title.trim().toLowerCase();

const ideaKindToNodeKind = (kind?: string): NodeKind => {
  if (!kind) return "generic";
  const normalized = kind.toLowerCase();
  if (normalized.includes("person") || normalized.includes("stakeholder") || normalized.includes("user")) return "person";
  if (normalized.includes("database") || normalized.includes("db") || normalized.includes("storage")) return "database";
  if (normalized.includes("api") || normalized.includes("endpoint") || normalized.includes("gateway")) return "api";
  if (normalized.includes("queue") || normalized.includes("message") || normalized.includes("event")) return "queue";
  if (normalized.includes("cache") || normalized.includes("redis") || normalized.includes("memcache")) return "cache";
  if (normalized.includes("cloud") || normalized.includes("aws") || normalized.includes("gcp") || normalized.includes("azure")) return "cloud";
  if (normalized.includes("team") || normalized.includes("group") || normalized.includes("department")) return "team";
  if (normalized.includes("vendor") || normalized.includes("third-party") || normalized.includes("external") || normalized.includes("saas")) return "vendor";
  if (normalized.includes("system") || normalized.includes("platform") || normalized.includes("tool") || normalized.includes("service")) return "system";
  if (normalized.includes("process") || normalized.includes("workflow") || normalized.includes("pipeline")) return "process";
  return "generic";
};

const positionForIndex = (idx: number, origin: { x: number; y: number }) => {
  const spacingX = baseX + 80;
  const spacingY = baseY + 40;
  return {
    x: origin.x + (idx % 3) * spacingX,
    y: origin.y + Math.floor(idx / 3) * spacingY
  };
};

const planToGraph = (
  plan: AiBrainstormPlan,
  opts?: {
    existingTitles?: Map<string, string>;
    origin?: { x: number; y: number };
    existingEdges?: Set<string>;
  }
) => {
  const nodes: MapNodeMeta[] = [];
  const notes: Note[] = [];
  const edges: MapEdgeMeta[] = [];
  const titleToId = new Map<string, string>(opts?.existingTitles ?? []);
  const origin = opts?.origin ?? { x: 120, y: 120 };
  const ideas = (plan.nodes ?? []).filter((n) => n?.title).slice(0, 12);

  ideas.forEach((idea, idx) => {
    const normalized = normalizeTitle(idea.title);
    if (titleToId.has(normalized)) return;
    const id = crypto.randomUUID ? crypto.randomUUID() : `node-${Date.now()}-${idx}`;
    const noteId = crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}-${idx}`;
    const kind = ideaKindToNodeKind(idea.kind);
    const tags = (idea.tags ?? []).slice(0, 6);
    const content =
      idea.note?.trim() ||
      idea.summary?.trim() ||
      `AI generated idea for ${plan.title ?? "this board"}.`;
    const position = positionForIndex(idx, origin);

    nodes.push({
      id,
      kind,
      kindLabel: kind.charAt(0).toUpperCase() + kind.slice(1),
      title: idea.title.trim(),
      tags,
      noteId,
      color: defaultColorForKind(kind),
      position
    });
    notes.push({
      id: noteId,
      title: idea.title.trim(),
      tags,
      content,
      comments: [],
      createdAt: now(),
      updatedAt: now()
    });
    titleToId.set(normalized, id);
  });

  (plan.edges ?? []).forEach((edgeIdea, idx) => {
    if (!edgeIdea?.source || !edgeIdea?.target) return;
    const sourceId = titleToId.get(normalizeTitle(edgeIdea.source));
    const targetId = titleToId.get(normalizeTitle(edgeIdea.target));
    if (!sourceId || !targetId || sourceId === targetId) return;
    const key = `${sourceId}>${targetId}>${edgeIdea.label ?? ""}`;
    if (opts?.existingEdges?.has(key)) return;
    if (opts?.existingEdges) opts.existingEdges.add(key);
    edges.push({
      id: crypto.randomUUID ? crypto.randomUUID() : `edge-${Date.now()}-${idx}`,
      sourceId,
      targetId,
      sourceHandle: null,
      targetHandle: null,
      label: edgeIdea.label ?? "",
      noteId: null,
      edgeType: "smoothstep"
    });
  });

  return { nodes, edges, notes };
};

function PageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shareToken, setShareToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("share");
  });
  useEffect(() => {
    const token = searchParams?.get("share");
    setShareToken(token ?? null);
  }, [searchParams]);
  const shareMode = !!shareToken;
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
  const [focusMenuOpen, setFocusMenuOpen] = useState(false);
  const focusMenuRef = useRef<HTMLDivElement | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTraining, setShowTraining] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem("sway-training-dismissed") !== "true";
  });
  const [trainingStep, setTrainingStep] = useState(0);
  const [showExport, setShowExport] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiEnabled, setAiEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem("decode-ai-enabled");
    return stored === "false" ? false : true;
  });
  const [aiKey, setAiKey] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem("decode-ai-key") ?? "";
  });
  const [shareLoaded, setShareLoaded] = useState<boolean>(() => !shareMode);
  const [shareAccess, setShareAccess] = useState<"public" | "restricted">("restricted");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [showCanvasSearch, setShowCanvasSearch] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const { pushSnapshot, undo, redo, canUndo, canRedo } = useUndoRedo();

  useEffect(() => {
    if (!shareMode && status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router, shareMode]);

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
    if (!aiEnabled && showAiAssistant) {
      setShowAiAssistant(false);
    }
  }, [aiEnabled, showAiAssistant]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("decode-ai-enabled", aiEnabled ? "true" : "false");
  }, [aiEnabled]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!aiKey) {
      window.localStorage.removeItem("decode-ai-key");
      return;
    }
    window.localStorage.setItem("decode-ai-key", aiKey);
  }, [aiKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (workspaceId) {
      window.localStorage.setItem("decode-workspace-id", workspaceId);
    } else {
      window.localStorage.removeItem("decode-workspace-id");
    }
  }, [workspaceId]);

  useEffect(() => {
    if (!shareMode || !shareToken) return;
    const loadShare = async () => {
      setShareLoaded(false);
      try {
        const res = await fetch(`/api/public/maps/${shareToken}`);
        if (!res.ok) {
          setToast("This shared board is not available.");
          setShareLoaded(true);
          return;
        }
        const data = await res.json();
        const map: DecodeMap = {
          ...data.map,
          notes: (data.map.notes ?? []).map(withCommentArray)
        };
        setActiveMap(map);
        setActiveMapId(map.id);
        setShareAccess(map.publicShareId ? "public" : "restricted");
        setNodes(toFlowNodes(map.nodes, handleUpdateMeta));
        setEdges(toFlowEdges(map.edges));
        setMapSummaries([
          {
            id: map.id,
            name: map.name,
            nodeCount: map.nodes.length,
            ownerName: data.ownerName ?? "Shared board",
            ownerUserId: map.ownerUserId,
            publicShareId: map.publicShareId ?? null,
            workspaceId: map.workspaceId
          }
        ]);
        setWorkspaces([]);
        setUsers([]);
        setCurrentUserId(null);
      } catch (err) {
        console.error("Failed to load shared map", err);
        setToast("Could not load shared board.");
      } finally {
        setShareLoaded(true);
      }
    };
    loadShare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareMode, shareToken]);

  // Update edge stroke color when theme changes so arrows adapt without reload.
  useEffect(() => {
    const stroke = theme === "dark" ? "#cbd5e1" : "#0f172a";
    setEdges((prev) =>
      prev.map((edge) => {
        const meta: MapEdgeMeta = {
          ...(edge.data?.meta ?? {
            id: edge.id,
            sourceId: edge.source,
            targetId: edge.target,
            sourceHandle: edge.sourceHandle ?? null,
            targetHandle: edge.targetHandle ?? null,
            label: typeof edge.label === "string" ? edge.label : undefined,
            noteId: ((edge.data as any)?.meta?.noteId as string | undefined) ?? null
          }),
          edgeType: "smoothstep"
        };
        return {
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
          markerEnd:
            edge.markerEnd && typeof edge.markerEnd === "object"
              ? { ...edge.markerEnd, color: theme === "dark" ? "#fff" : "#000" }
              : edge.markerEnd,
          type: edge.data?.meta?.edgeType ?? edge.type ?? "smoothstep",
          className: "edge-glow",
          data: { meta }
        };
      })
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
        const metaEdgeType =
          (edge.data?.meta?.edgeType ?? edge.type ?? "smoothstep") as MapEdgeMeta["edgeType"];
        const meta: MapEdgeMeta = {
          ...(edge.data?.meta ?? {
            id: edge.id,
            sourceId: edge.source,
            targetId: edge.target,
            sourceHandle: edge.sourceHandle ?? null,
            targetHandle: edge.targetHandle ?? null,
            label: typeof edge.label === "string" ? edge.label : undefined,
            noteId: ((edge.data as any)?.meta?.noteId as string | undefined) ?? null
          }),
          edgeType: metaEdgeType
        };
        return {
          ...edge,
          type: metaEdgeType ?? "smoothstep",
          className: "edge-glow",
          style: nextStyle,
          data: { meta }
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
    if (shareMode) return;
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
          publicShareId: m.publicShareId ?? null,
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
          publicShareId: (m as any).publicShareId ?? null,
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
          const normalized: DecodeMap = {
            ...active,
            notes: (active.notes ?? []).map(withCommentArray)
          };
          setActiveMap(normalized);
          setShareAccess(normalized.publicShareId ? "public" : "restricted");
          setNodes(toFlowNodes(normalized.nodes ?? [], handleUpdateMeta));
          setEdges(toFlowEdges(normalized.edges ?? []));
        }
      }
    };
    load();
  }, [status]);

  useEffect(() => {
    if (shareMode) return;
    const userId = (session as any)?.user?.id as string | undefined;
    if (userId) {
      setCurrentUserId(userId);
      const ws = workspaces.find((w) =>
        w.members.some((m) => m.userId === userId)
      );
      if (ws && !workspaceId) setWorkspaceId(ws.id);
    }
  }, [session, workspaces, workspaceId, shareMode]);

  useEffect(() => {
    if (!activeMapId || shareMode) return;
    const loadMap = async () => {
      try {
        const res = await fetch(`/api/maps/${activeMapId}/full`);
        if (!res.ok) throw new Error("Full map fetch failed");
        const data = await res.json();
        const map: DecodeMap = {
          ...data.map,
          notes: (data.map.notes ?? []).map(withCommentArray)
        };
        setActiveMap(map);
        setShareAccess(map.publicShareId ? "public" : "restricted");
        setNodes(toFlowNodes(map.nodes, handleUpdateMeta));
        setEdges(toFlowEdges(map.edges));
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
      } catch (err) {
        const local = initialMaps.find((m) => m.id === activeMapId);
        if (local) {
          const normalized: DecodeMap = {
            ...local,
            notes: (local.notes ?? []).map(withCommentArray)
          };
          setActiveMap(normalized);
          setShareAccess(normalized.publicShareId ? "public" : "restricted");
          setNodes(toFlowNodes(normalized.nodes, handleUpdateMeta));
          setEdges(toFlowEdges(normalized.edges));
        }
      }
    };
    loadMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMapId, shareMode]);

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
    () =>
      workspaces.filter((w) => {
        const owner = (w as any).ownerId ?? w.ownerUserId;
        return owner === currentUserId;
      }).length,
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
      setSaveStatus("saving");
      const res = await fetch(`/api/maps/${mapId}/state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, nodes: serializedNodes, edges: serializedEdges })
      });
      if (!res.ok) {
        const msg = await res.text();
        console.error("Persist failed", res.status, msg);
        setSaveStatus("unsaved");
      } else {
        setSaveStatus("saved");
      }
    } catch (err) {
      console.error("Failed to persist map state", err);
      setSaveStatus("unsaved");
    }
  };

  const currentEdgesMeta = React.useCallback(
    () =>
      edges.map((e) => {
        const meta: MapEdgeMeta = {
          ...(e.data?.meta ?? {
            id: e.id,
            sourceId: e.source,
            targetId: e.target,
            sourceHandle: e.sourceHandle ?? null,
            targetHandle: e.targetHandle ?? null,
            label: typeof e.label === "string" ? e.label : undefined,
            noteId: ((e.data as any)?.meta?.noteId as string | undefined) ?? null
          }),
          edgeType: e.data?.meta?.edgeType ?? "smoothstep"
        };
        meta.sourceHandle = sanitizeHandle(meta.sourceHandle, "source");
        meta.targetHandle = sanitizeHandle(meta.targetHandle, "target");
        return meta;
      }),
    [edges]
  );

  useEffect(() => {
    if (!activeMap || shareMode) return;
    setSaveStatus("unsaved");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      persistState(activeMap.id, {
        nodes,
        edges: currentEdgesMeta(),
        notes: activeMap.notes
      });
    }, 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, activeMap?.notes, activeMap?.id, currentEdgesMeta]);

  useEffect(() => {
    if (!activeMap) return;
    const mappedNodes = nodes.map((node) => ({
      ...node.data.meta,
      position: node.position
    }));
    const mappedEdges = currentEdgesMeta();
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
  }, [nodes, edges, currentEdgesMeta]);

  const syncMapSummaryCounts = (mapId: string, nodeCount: number) => {
    setMapSummaries((prev) =>
      prev.map((m) => (m.id === mapId ? { ...m, nodeCount } : m))
    );
  };

  const handleConnectEdge = (connection: Connection) => {
    if (shareMode) return;
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
          type: meta.edgeType ?? "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed, color: theme === "dark" ? "#fff" : "#000" },
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
    if (shareMode) {
      setSelectedEdgeId(edgeData.meta.id);
      setSelectedNodeId(null);
      return;
    }
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
    if (shareMode) return;
    if (!activeMap) return;
    const normalizedNote = withCommentArray(updated);
    setActiveMap((prev) =>
      prev
        ? {
            ...prev,
            notes: prev.notes.map((note) => (note.id === normalizedNote.id ? normalizedNote : note)),
            nodes: prev.nodes.map((node) =>
              node.noteId === normalizedNote.id ? { ...node, title: normalizedNote.title } : node
            ),
            updatedAt: now()
          }
        : prev
    );

    setNodes((prev) =>
      prev.map((node) =>
        node.data.meta.noteId === updated.id
          ? { ...node, data: { ...node.data, meta: { ...node.data.meta, title: normalizedNote.title } } }
          : node
      )
    );
  };

  const handleUpdateTags = (tags: string[]) => {
    if (shareMode) return;
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
    if (shareMode) return;
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
    if (shareMode) return;
    if (!activeMap) return;
    const finalEdge = {
      ...edge,
      edgeType: edge.edgeType ?? "smoothstep"
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
              type: finalEdge.edgeType ?? "smoothstep",
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
    if (shareMode) return;
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
      ...((oldEdge.data?.meta as MapEdgeMeta) ?? {
        id: oldEdge.id,
        sourceId: oldEdge.source,
        targetId: oldEdge.target,
        sourceHandle: oldEdge.sourceHandle ?? null,
        targetHandle: oldEdge.targetHandle ?? null,
        label: typeof oldEdge.label === "string" ? oldEdge.label : undefined,
        noteId: ((oldEdge.data as any)?.meta?.noteId as string | undefined) ?? null
      }),
      sourceId,
      targetId,
      sourceHandle,
      targetHandle,
      edgeType: (oldEdge.data as any)?.meta?.edgeType ?? "smoothstep"
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
              type: updatedMeta.edgeType ?? "smoothstep"
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
    if (shareMode) return;
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
      comments: [],
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
    if (shareMode) {
      setToast("View-only share. Sign in to edit.");
      return;
    }
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
      const ownerId =
        ((session as any)?.user?.id as string | undefined) ?? currentUserId ?? users[0]?.id;
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
            sharedUserIds: [],
            publicShareId: map.publicShareId ?? null,
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

  const publicViewLink = (shareId?: string | null) =>
    shareId ? `${window.location.origin}?share=${shareId}` : null;

  const ensurePublicShare = async (): Promise<string | null> => {
    if (!activeMap) return null;
    if (activeMap.publicShareId) return activeMap.publicShareId;
    if (currentRole === "viewer" || currentRole === "editor") {
      setToast("Only owners/admins can enable public view.");
      return null;
    }
    const res = await fetch(`/api/maps/${activeMap.id}/share`, { method: "POST" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setToast(data.error ?? "Could not enable sharing.");
      return null;
    }
    const data = await res.json();
    const shareId = data.shareId as string;
    setActiveMap((prev) => (prev ? { ...prev, publicShareId: shareId } : prev));
    setMapSummaries((prev) => prev.map((m) => (m.id === activeMap.id ? { ...m, publicShareId: shareId } : m)));
    setShareAccess("public");
    return shareId;
  };

  const handleCopyShareLink = async () => {
    if (!activeMap) {
      setToast("No board to share");
      return;
    }
    const shareLink = publicViewLink(activeMap.publicShareId);
    const link: string = shareLink ?? `${window.location.origin}?map=${activeMap.id}`;
    try {
      navigator.clipboard?.writeText(link);
      setToast("Link copied");
    } catch {
      alert(link);
    }
  };

  const handleDisablePublicLink = async () => {
    if (!activeMap || !activeMap.publicShareId) {
      setToast("No public link to disable.");
      return;
    }
    if (currentRole === "viewer" || currentRole === "editor") {
      setToast("Only owners/admins can disable public view.");
      return;
    }
    const res = await fetch(`/api/maps/${activeMap.id}/share`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setToast(data.error ?? "Could not disable public link.");
      return;
    }
    setActiveMap((prev) => (prev ? { ...prev, publicShareId: null } : prev));
    setMapSummaries((prev) => prev.map((m) => (m.id === activeMap.id ? { ...m, publicShareId: null } : m)));
    setShareAccess("restricted");
    setToast("Public link disabled");
  };

  const buildAiContext = (map: DecodeMap) => {
    const nodeTitles = new Map<string, string>();
    map.nodes.forEach((n) => nodeTitles.set(n.id, n.title));
    return {
      title: map.name,
      description: map.description ?? "",
      nodes: map.nodes.slice(0, 14).map((node) => {
        const note = map.notes.find((n) => n.id === node.noteId);
        return {
          title: node.title,
          kind: node.kind,
          tags: node.tags.slice(0, 6),
          note: (note?.content ?? "").slice(0, 400)
        };
      }),
      edges: map.edges.slice(0, 24).map((edge) => ({
        source: nodeTitles.get(edge.sourceId) ?? edge.sourceId,
        target: nodeTitles.get(edge.targetId) ?? edge.targetId,
        label: edge.label ?? ""
      }))
    };
  };

  const createMapFromAiPlan = async (plan: AiBrainstormPlan, prompt: string, mapName?: string) => {
    if (currentRole === "viewer" || currentRole === "editor") {
      setToast("Only owners/admins can create maps in this workspace.");
      throw new Error("Only owners/admins can create maps in this workspace.");
    }
    if (mapCreationBlocked) {
      setToast("Free plan allows 1 map. Upgrade to create more.");
      setShowUpgrade(true);
      throw new Error("Free plan allows 1 map. Upgrade to create more.");
    }
    const ownerId = ((session as any)?.user?.id as string | undefined) ?? currentUserId ?? users[0]?.id;
    const finalName = (mapName?.trim() || plan.title || prompt || "AI board").slice(0, 80);
    const res = await fetch("/api/maps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: finalName,
        description: plan.summary?.slice(0, 260) ?? "",
        ownerUserId: ownerId ?? undefined,
        workspaceId
      })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Could not create map. Please try again.");
    }
    const created = await res.json();
    const content = planToGraph(plan);
    const normalizedNotes = content.notes.map(withCommentArray);
    const flowNodes = toFlowNodes(content.nodes, handleUpdateMeta);
    const flowEdges = toFlowEdges(content.edges);
    const workspaceForMap = workspaceId ?? created.workspaceId ?? null;

    const newMap: DecodeMap = {
      id: created.id,
      name: finalName,
      description: plan.summary ?? created.description ?? "",
      ownerUserId: ownerId ?? undefined,
      sharedUserIds: [],
      publicShareId: created.publicShareId ?? null,
      workspaceId: workspaceForMap,
      nodes: content.nodes,
      edges: content.edges,
      notes: normalizedNotes,
      createdAt: created.createdAt ?? now(),
      updatedAt: now()
    };

    setMapSummaries((prev) => [
      {
        id: created.id,
        name: finalName,
        nodeCount: content.nodes.length,
        ownerName: users.find((u) => u.id === ownerId)?.name,
        ownerUserId: ownerId ?? undefined,
        publicShareId: created.publicShareId ?? null,
        workspaceId: workspaceForMap ?? undefined
      },
      ...prev
    ]);
    setActiveMapId(created.id);
    setActiveMap(newMap);
    setNodes(flowNodes);
    setEdges(flowEdges);
    setSelectedNodeId(content.nodes[0]?.id ?? null);
    setSelectedEdgeId(null);
    persistState(created.id, { nodes: flowNodes, edges: content.edges, notes: normalizedNotes });
  };

  const applyAiPlanToExisting = async (plan: AiBrainstormPlan) => {
    if (!activeMap) throw new Error("Open a board to add ideas.");
    if (currentRole === "viewer") {
      throw new Error("You need edit access to add AI ideas to this board.");
    }
    const existingTitles = new Map<string, string>();
    activeMap.nodes.forEach((n) => existingTitles.set(normalizeTitle(n.title), n.id));
    const existingEdges = new Set(
      activeMap.edges.map((e) => `${e.sourceId}>${e.targetId}>${e.label ?? ""}`)
    );
    const origin = viewportCenter ?? { x: 140, y: 140 };
    const content = planToGraph(plan, {
      existingTitles,
      origin,
      existingEdges
    });
    if (content.nodes.length === 0 && content.edges.length === 0) {
      throw new Error("AI ideas matched existing nodes. Try a different angle.");
    }

    const flowNodesToAdd = toFlowNodes(content.nodes, handleUpdateMeta);
    const flowEdgesToAdd = toFlowEdges(content.edges);
    const nextNodes = [...nodes, ...flowNodesToAdd];
    const nextEdgesMeta = [...activeMap.edges, ...content.edges];
    const nextEdges = [...edges, ...flowEdgesToAdd];
    const nextNotes = [...activeMap.notes, ...content.notes.map(withCommentArray)];
    const nextMap: DecodeMap = {
      ...activeMap,
      description: activeMap.description ?? plan.summary ?? "",
      nodes: [...activeMap.nodes, ...content.nodes],
      edges: nextEdgesMeta,
      notes: nextNotes,
      updatedAt: now()
    };

    setActiveMap(nextMap);
    setNodes(nextNodes);
    setEdges(nextEdges);
    setSelectedNodeId(content.nodes[0]?.id ?? selectedNodeId);
    setSelectedEdgeId(null);
    syncMapSummaryCounts(activeMap.id, nextMap.nodes.length);
    persistState(activeMap.id, { nodes: nextNodes, edges: nextEdgesMeta, notes: nextNotes });
  };

  const handleAiGenerate = async ({ prompt, mode, mapName }: { prompt: string; mode: AiMode; mapName?: string }) => {
    setAiError(null);
    if (!aiEnabled) {
      setAiError("Enable AI in Settings to use the assistant.");
      return;
    }
    if (!prompt.trim()) {
      setAiError("Prompt is required.");
      return;
    }
    if (mode === "expand-board" && !activeMap) {
      setAiError("Open a board to add AI ideas.");
      return;
    }

    setAiLoading(true);
    try {
      const body: any = { prompt, mode };
      if (mode === "expand-board" && activeMap) {
        body.mapContext = buildAiContext(activeMap);
      }
      if (aiKey) {
        body.apiKey = aiKey;
      }
      const res = await fetch("/api/ai/brainstorm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "AI request failed. Please try again.");
      }

      const plan: AiBrainstormPlan = data.plan;
      if (!plan?.nodes?.length) {
        throw new Error("AI did not return any ideas. Try a more specific prompt.");
      }

      if (mode === "expand-board" && activeMap) {
        await applyAiPlanToExisting(plan);
        setToast("AI added ideas to your board");
      } else {
        await createMapFromAiPlan(plan, prompt, mapName);
        setToast("AI created a new board");
      }
      setShowAiAssistant(false);
    } catch (err: any) {
      setAiError(err?.message ?? "AI request failed. Check your OpenAI key.");
    } finally {
      setAiLoading(false);
    }
  };

  // Push undo snapshot whenever nodes/edges change meaningfully
  useEffect(() => {
    if (!activeMap || shareMode) return;
    pushSnapshot({ nodes: [...nodes], edges: [...edges] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length, edges.length]);

  const handleUndo = useCallback(() => {
    undo({ nodes: [...nodes], edges: [...edges] }, (snapshot) => {
      setNodes(snapshot.nodes as any);
      setEdges(snapshot.edges as any);
    });
  }, [nodes, edges, undo, setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    redo({ nodes: [...nodes], edges: [...edges] }, (snapshot) => {
      setNodes(snapshot.nodes as any);
      setEdges(snapshot.edges as any);
    });
  }, [nodes, edges, redo, setNodes, setEdges]);

  const handleDeleteSelected = useCallback(() => {
    if (shareMode) return;
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
      if (activeMap) {
        setActiveMap((prev) =>
          prev
            ? {
                ...prev,
                nodes: prev.nodes.filter((n) => n.id !== selectedNodeId),
                edges: prev.edges.filter(
                  (e) => e.sourceId !== selectedNodeId && e.targetId !== selectedNodeId
                ),
              }
            : prev
        );
      }
      setSelectedNodeId(null);
    } else if (selectedEdgeId) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));
      if (activeMap) {
        setActiveMap((prev) =>
          prev
            ? { ...prev, edges: prev.edges.filter((e) => e.id !== selectedEdgeId) }
            : prev
        );
      }
      setSelectedEdgeId(null);
    }
  }, [shareMode, selectedNodeId, selectedEdgeId, activeMap, setNodes, setEdges]);

  const handleDuplicateNode = useCallback(() => {
    if (shareMode || !selectedNodeId) return;
    const sourceNode = nodes.find((n) => n.id === selectedNodeId);
    if (!sourceNode) return;
    const newId = `node-${Date.now()}`;
    const newNode: FlowNode = {
      ...sourceNode,
      id: newId,
      position: {
        x: sourceNode.position.x + 40,
        y: sourceNode.position.y + 40,
      },
      data: {
        ...sourceNode.data,
        meta: {
          ...sourceNode.data.meta,
          id: newId,
          title: `${sourceNode.data.meta.title} (copy)`,
          noteId: "",
        },
      },
    };
    setNodes((nds) => [...nds, newNode]);
    if (activeMap) {
      setActiveMap((prev) =>
        prev
          ? { ...prev, nodes: [...prev.nodes, newNode.data.meta] }
          : prev
      );
    }
    setSelectedNodeId(newId);
  }, [shareMode, selectedNodeId, nodes, activeMap, setNodes]);

  const handleAutoLayout = useCallback(
    (type: "hierarchical" | "radial") => {
      if (nodes.length === 0) return;
      const spacing = { x: 280, y: 160 };

      if (type === "hierarchical") {
        // Find root nodes (no incoming edges)
        const targetIds = new Set(edges.map((e) => e.target));
        const roots = nodes.filter((n) => !targetIds.has(n.id));
        if (roots.length === 0) roots.push(nodes[0]);

        // BFS layout
        const positions = new Map<string, { x: number; y: number }>();
        const visited = new Set<string>();
        let queue = roots.map((r, i) => ({ id: r.id, depth: 0, index: i }));
        const depthCounts = new Map<number, number>();

        while (queue.length > 0) {
          const { id, depth, index } = queue.shift()!;
          if (visited.has(id)) continue;
          visited.add(id);
          const count = depthCounts.get(depth) ?? 0;
          depthCounts.set(depth, count + 1);
          positions.set(id, { x: count * spacing.x + 100, y: depth * spacing.y + 100 });
          const children = edges
            .filter((e) => e.source === id)
            .map((e) => e.target)
            .filter((tid) => !visited.has(tid));
          children.forEach((cid, ci) => queue.push({ id: cid, depth: depth + 1, index: ci }));
        }
        // Place unvisited nodes
        nodes.forEach((n, i) => {
          if (!positions.has(n.id)) {
            positions.set(n.id, { x: i * spacing.x + 100, y: 400 });
          }
        });

        setNodes((nds) =>
          nds.map((n) => ({ ...n, position: positions.get(n.id) ?? n.position }))
        );
      } else {
        // Radial layout
        const cx = 500;
        const cy = 400;
        const radius = Math.max(200, nodes.length * 30);
        setNodes((nds) =>
          nds.map((n, i) => {
            const angle = (2 * Math.PI * i) / nds.length - Math.PI / 2;
            return {
              ...n,
              position: {
                x: cx + radius * Math.cos(angle),
                y: cy + radius * Math.sin(angle),
              },
            };
          })
        );
      }
      setToast(`Applied ${type} layout`);
    },
    [nodes, edges, setNodes]
  );

  const handleFitView = useCallback(() => {
    // Dispatch custom event for ReactFlow to fit view
    const fitBtn = document.querySelector(".react-flow__controls-fitview") as HTMLButtonElement;
    fitBtn?.click();
  }, []);

  // Comprehensive keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isEditable =
        tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable;

      // Ctrl/Cmd shortcuts work everywhere
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }
      if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
        return;
      }
      if (mod && e.key === "f") {
        e.preventDefault();
        setShowCanvasSearch(true);
        return;
      }
      if (mod && e.key === "d" && !isEditable) {
        e.preventDefault();
        handleDuplicateNode();
        return;
      }

      // Non-modifier shortcuts only outside text fields
      if (isEditable) return;

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        handleAddNode();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        handleDeleteSelected();
        return;
      }
      if (e.key === "Escape") {
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setShowCanvasSearch(false);
        setContextMenu(null);
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleAddNode, handleUndo, handleRedo, handleDeleteSelected, handleDuplicateNode]);

  useEffect(() => {
    if (!focusMenuOpen) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (focusMenuRef.current && target && !focusMenuRef.current.contains(target)) {
        setFocusMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside, true);
    document.addEventListener("touchstart", handleOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleOutside, true);
      document.removeEventListener("touchstart", handleOutside, true);
    };
  }, [focusMenuOpen]);

  const trainingSteps = [
    {
      title: "Welcome to SwayMaps",
      icon: "👋",
      body: "SwayMaps helps you visualize systems, processes, and dependencies. This quick guide will show you the key features.",
      tips: [
        "Click anywhere on the canvas to close this menu",
        "Use the Training button anytime to review",
        "All changes auto-save to your workspace"
      ]
    },
    {
      title: "Add & move nodes",
      icon: "🎯",
      body: "Nodes are the building blocks of your map. Each node can represent a system, person, process, or anything else.",
      tips: [
        "Click 'Add Node (N)' or press N key",
        "Drag nodes to reposition them",
        "Use grab cursor to pan the canvas",
        "Zoom with mouse wheel or pinch"
      ]
    },
    {
      title: "Connect & organize",
      icon: "🔗",
      body: "Create relationships between nodes by connecting them with edges. Drag from a node's connection point to another node.",
      tips: [
        "Hover over a node to see connection points",
        "Drag from any connection point to create an edge",
        "Click edges to add labels and notes",
        "Drag edge midpoint to create new connected nodes"
      ]
    },
    {
      title: "Select & inspect",
      icon: "📝",
      body: "Click any node to open the inspector panel and view or edit its details, notes, tags, and comments.",
      tips: [
        "Click a node to select it",
        "Add tags for filtering and organization",
        "Write detailed notes with markdown support",
        "Add comments for team collaboration"
      ]
    },
    {
      title: "Pin & focus",
      icon: "📌",
      body: "Pin critical nodes to quickly focus on important parts of your map during incidents or presentations.",
      tips: [
        "Toggle Pin in the inspector panel",
        "Give pins custom labels",
        "Use Focus dropdown to jump to pinned nodes",
        "Share focused views with teammates"
      ]
    },
    {
      title: "Customize & style",
      icon: "🎨",
      body: "Personalize your map with colors, node types, and visual styles to match your workflow.",
      tips: [
        "Choose from 11 color options per node",
        "Set node types: System, Person, Process, Generic",
        "Toggle gradient edges in Settings",
        "Switch between light and dark themes"
      ]
    },
    {
      title: "Share & collaborate",
      icon: "🤝",
      body: "Work with your team in real-time. Share maps, invite members, and keep everyone aligned.",
      tips: [
        "Click Share → Copy link to share your map",
        "Invite teammates from the sidebar",
        "Set roles: Owner, Admin, Editor, Viewer",
        "All changes sync in real-time"
      ]
    },
    {
      title: "You're all set!",
      icon: "🚀",
      body: "You now know the essentials of SwayMaps. Start mapping your systems, processes, and ideas!",
      tips: [
        "Press N to quickly add nodes",
        "Check Settings for advanced options",
        "Visit the landing page for more examples",
        "Reach out if you need help!"
      ]
    }
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("sway-training-dismissed", showTraining ? "false" : "true");
  }, [showTraining]);

  const handleCreateNodeAt = (
    position: { x: number; y: number },
    from: { nodeId: string; handleId?: string }
  ) => {
    if (shareMode) return;
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
      comments: [],
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
        type: edgeMeta.edgeType ?? "smoothstep",
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed, color: theme === "dark" ? "#fff" : "#000" },
        className: "edge-glow",
        data: { meta: edgeMeta }
      }
    ]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
    syncMapSummaryCounts(activeMap.id, (activeMap.nodes.length ?? 0) + 1);
  };

  const handleCreateMap = () => {
    if (shareMode) {
      setToast("View-only share. Sign in to edit.");
      return;
    }
    if (currentRole === "viewer" || currentRole === "editor") {
      setToast("Only owners/admins can create maps in this workspace.");
      return;
    }
    const ownerId = ((session as any)?.user?.id as string | undefined) ?? currentUserId ?? users[0]?.id;
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
            publicShareId: map.publicShareId ?? null,
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
    if (shareMode) {
      setToast("View-only share. Sign in to edit.");
      return;
    }
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
    if (shareMode) {
      setToast("View-only share. Sign in to edit.");
      return;
    }
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
    if (shareMode) {
      setToast("View-only share. Sign in to edit.");
      return;
    }
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
    if (shareMode) {
      setToast("View-only share. Sign in to edit.");
      return;
    }
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
    if (shareMode) {
      setToast("View-only share. Sign in to edit.");
      return;
    }
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
    if (shareMode) {
      setToast("View-only share. Sign in to edit.");
      return;
    }
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

  if (!shareMode && status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading...
      </div>
    );
  }
  if (shareMode && !shareLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        Loading shared board...
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
          onCreateMap={shareMode ? () => setToast("View-only share. Sign in to edit.") : handleCreateMap}
          onDeleteMap={shareMode ? () => setToast("View-only share. Sign in to edit.") : handleDeleteMap}
          onClose={() => setSidebarOpen(false)}
          createDisabled={mapCreationBlocked || shareMode}
          disabledMapIds={disabledMapIds}
          planLabel={users.find((u) => u.id === currentUserId)?.plan ?? "free"}
          onInvite={!shareMode && currentWorkspace ? () => setShowInvite(true) : undefined}
          onSettings={
            shareMode
              ? undefined
              : () => {
                  setShowSettings(true);
                }
          }
          onAdmin={shareMode ? undefined : () => router.push("/admin")}
          onMembers={!shareMode ? () => setShowMembers(true) : undefined}
          onTraining={
            shareMode
              ? undefined
              : () => {
                  setShowTraining(true);
                  setTrainingStep(0);
                }
          }
          onUpgrade={!shareMode ? () => setShowUpgrade(true) : undefined}
          authLabel={session ? "Sign out" : "Sign in"}
          onAuthClick={() => (session ? handleSignOut() : signIn())}
          onEmbedMap={(id) => {
            const embed = `<iframe src="${window.location.origin}/embed/${id}" width="100%" height="600" style="border:0;"></iframe>`;
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
          onGlobalSearch={!shareMode ? () => setShowSearch(true) : undefined}
          onExport={!shareMode && activeMap ? () => setShowExport(true) : undefined}
          onImport={!shareMode ? () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".json";
            input.onchange = async (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (!file) return;
              try {
                const text = await file.text();
                const data = JSON.parse(text);
                const res = await fetch("/api/maps/import", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ ...data, workspaceId }),
                });
                const result = await res.json();
                if (!res.ok) throw new Error(result.error);
                setToast(`Imported "${result.name}"`);
                setActiveMapId(result.id);
              } catch (err: any) {
                setToast(err?.message ?? "Import failed");
              }
            };
            input.click();
          } : undefined}
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

      <div className="flex flex-1 flex-col relative z-50">
        <header
          className={`relative z-50 flex items-center justify-between border-b px-4 py-2.5 shadow-sm backdrop-blur ${
            theme === "dark" ? "border-slate-800 bg-[#050b15]" : "border-slate-200 bg-white/90"
          }`}
        >
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                className={`rounded-md p-1.5 transition ${
                  theme === "dark" ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-500 hover:bg-slate-100"
                }`}
                onClick={() => setSidebarOpen(true)}
                title="Open sidebar"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <input
              className={`w-48 border-0 bg-transparent text-lg font-semibold outline-none focus:ring-0 lg:w-64 ${
                theme === "dark" ? "text-slate-100" : "text-slate-900"
              }`}
              value={activeMap?.name ?? ""}
              disabled={shareMode}
              onChange={(e) =>
                setActiveMap((prev) => (prev ? { ...prev, name: e.target.value } : prev))
              }
              onBlur={async (e) => {
                if (!activeMap || shareMode) return;
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
          <div className="flex items-center gap-2 overflow-visible">
            <CanvasToolbar
              theme={theme}
              nodeCount={nodes.length}
              edgeCount={edges.length}
              saveStatus={saveStatus}
              canUndo={canUndo()}
              canRedo={canRedo()}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onAddNode={handleAddNode}
              onFitView={handleFitView}
              onAutoLayout={handleAutoLayout}
              onToggleSearch={() => setShowCanvasSearch((v) => !v)}
              onDuplicate={selectedNodeId ? handleDuplicateNode : undefined}
              onDelete={(selectedNodeId || selectedEdgeId) ? handleDeleteSelected : undefined}
              hasSelection={!!(selectedNodeId || selectedEdgeId)}
              shareMode={shareMode}
            />
            <div className={`w-px h-6 ${theme === "dark" ? "bg-slate-800" : "bg-slate-200"}`} />
            {pinOptions.length > 0 && (
              <div className="relative z-50" ref={focusMenuRef}>
                <button
                  className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold shadow-sm ${
                    theme === "dark"
                      ? "border-slate-700 bg-[#0b1422] text-slate-300 hover:border-slate-600"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                  onClick={() => setFocusMenuOpen((prev) => !prev)}
                >
                  Focus
                  <span className={`text-[10px] text-slate-400 transition ${focusMenuOpen ? "rotate-180" : ""}`}>&#9662;</span>
                </button>
                {focusMenuOpen && (
                  <div
                    className={`absolute right-0 z-50 mt-2 w-48 rounded-md border shadow-lg ${
                      theme === "dark" ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-800"
                    }`}
                  >
                    {pinOptions.map((p) => (
                      <button
                        key={p.id}
                        className={`block w-full px-3 py-2 text-left text-sm transition ${
                          theme === "dark" ? "hover:bg-slate-800" : "hover:bg-slate-100"
                        }`}
                        onClick={() => { handleFocusNode(p.id); setFocusMenuOpen(false); }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
                theme === "dark"
                  ? `text-white ${aiEnabled ? "bg-sky-700 hover:bg-sky-600" : "bg-slate-700/70"}`
                  : aiEnabled
                    ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-400 hover:to-indigo-400"
                    : "bg-slate-200 text-slate-500"
              } ${aiEnabled ? "" : "cursor-not-allowed opacity-60"}`}
              onClick={() => {
                setAiError(null);
                if (!aiEnabled) { setToast("AI is disabled. Enable it in Settings."); return; }
                setShowAiAssistant(true);
              }}
              disabled={!aiEnabled}
            >
              AI Assist
            </button>
            <button
              className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold shadow-sm transition ${
                !activeMap
                  ? theme === "dark"
                    ? "cursor-not-allowed border-slate-800 text-slate-500 opacity-60"
                    : "cursor-not-allowed border-slate-200 text-slate-400 opacity-60"
                  : theme === "dark"
                    ? "border-slate-700 text-slate-300 hover:border-slate-600"
                    : "border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
              onClick={() => activeMap && setShowShareModal(true)}
              disabled={!activeMap}
            >
              Share
            </button>
          </div>
        </header>

        <main className="flex flex-1 overflow-hidden">
          <section className={`relative flex-1 ${theme === "dark" ? "bg-[#050b15]" : "bg-slate-50"}`}>
            <div className="h-full w-full p-4">
              <div
                className={`relative h-full overflow-hidden rounded-xl border shadow ${
                  theme === "dark" ? "border-slate-800 bg-[#0b1422]" : "border-slate-200 bg-white"
                }`}
                onContextMenu={(e) => {
                  if (shareMode) return;
                  e.preventDefault();
                  setContextMenu({ x: e.clientX, y: e.clientY });
                }}
              >
                {showCanvasSearch && (
                  <CanvasSearchBar
                    nodes={nodes.map((n) => ({
                      id: n.id,
                      title: n.data.meta.title,
                      kind: n.data.meta.kindLabel || n.data.meta.kind,
                      tags: Array.isArray(n.data.meta.tags) ? n.data.meta.tags : String(n.data.meta.tags ?? "").split(",").map((t: string) => t.trim()).filter(Boolean),
                    }))}
                    onFocusNode={(id) => {
                      setFocusNodeId(id);
                      setSelectedNodeId(id);
                    }}
                    onClose={() => setShowCanvasSearch(false)}
                    theme={theme}
                  />
                )}
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
                readOnly={shareMode}
              />
            </div>
          </div>
          {contextMenu && (
            <CanvasContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              theme={theme}
              onClose={() => setContextMenu(null)}
              items={[
                {
                  label: "Add Node",
                  shortcut: "N",
                  onClick: handleAddNode,
                },
                {
                  label: "Duplicate",
                  shortcut: "Ctrl+D",
                  onClick: handleDuplicateNode,
                  disabled: !selectedNodeId,
                },
                { label: "", onClick: () => {}, divider: true },
                {
                  label: "Search Nodes",
                  shortcut: "Ctrl+F",
                  onClick: () => setShowCanvasSearch(true),
                },
                {
                  label: "Fit View",
                  onClick: handleFitView,
                },
                {
                  label: "Auto Layout",
                  onClick: () => handleAutoLayout("hierarchical"),
                },
                { label: "", onClick: () => {}, divider: true },
                {
                  label: "Undo",
                  shortcut: "Ctrl+Z",
                  onClick: handleUndo,
                  disabled: !canUndo(),
                },
                {
                  label: "Redo",
                  shortcut: "Ctrl+Y",
                  onClick: handleRedo,
                  disabled: !canRedo(),
                },
                { label: "", onClick: () => {}, divider: true },
                {
                  label: "Delete",
                  shortcut: "Del",
                  onClick: handleDeleteSelected,
                  disabled: !selectedNodeId && !selectedEdgeId,
                  danger: true,
                },
              ]}
            />
          )}
        </section>
          {(selectedMeta || selectedEdgeMeta) && (
            <aside
              className={`w-[380px] border-l ${
                theme === "dark" ? "border-[#0f172a] bg-[#040915]" : "border-slate-200 bg-white"
              } overflow-y-auto max-h-[calc(100vh-80px)]`}
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
      {showAiAssistant && (
        <AiAssistantModal
          open={showAiAssistant}
          canExpand={!!activeMap}
          loading={aiLoading}
          error={aiError}
          defaultMode={activeMap ? "expand-board" : "new-board"}
          defaultMapName={activeMap ? activeMap.name : ""}
          onClose={() => {
            setShowAiAssistant(false);
            setAiError(null);
          }}
          onRun={handleAiGenerate}
        />
      )}
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
      {showShareModal && activeMap && (
        <ShareModal
          open={showShareModal}
          mapName={activeMap.name}
          ownerName={
            activeMap.ownerUserId
              ? users.find((u) => u.id === activeMap.ownerUserId)?.name ?? "Owner"
              : "Owner"
          }
          access={shareAccess}
          shareMode={shareMode}
          onClose={() => setShowShareModal(false)}
          onCopyLink={() => {
            handleCopyShareLink();
            setShowShareModal(false);
          }}
          onMakePublic={() => {
            ensurePublicShare();
            setShareAccess("public");
          }}
          onMakeRestricted={() => {
            handleDisablePublicLink();
            setShareAccess("restricted");
          }}
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
          aiEnabled={aiEnabled}
          aiKey={aiKey}
          onToggleAiEnabled={(enabled) => setAiEnabled(enabled)}
          onChangeAiKey={(key) => setAiKey(key)}
          onClose={() => setShowSettings(false)}
        />
      )}
      {showUpgrade && (
        <UpgradeModal
          currentUser={users.find((u) => u.id === currentUserId)}
          onSelectPlan={async (plan) => {
            // Now handled by Stripe Checkout redirect inside UpgradeModal
          }}
          onClose={() => setShowUpgrade(false)}
        />
      )}
      {showSearch && (
        <SearchModal
          onSelectMap={(mapId) => {
            setActiveMapId(mapId);
            setShowSearch(false);
          }}
          onClose={() => setShowSearch(false)}
        />
      )}
      {showExport && activeMap && (
        <ExportModal
          mapName={activeMap.name}
          isPro={(users.find((u) => u.id === currentUserId)?.plan ?? "free") !== "free"}
          onExport={async (format) => {
            const el = document.querySelector(".react-flow") as HTMLElement;
            if (!el) throw new Error("Canvas not found");
            const filename = activeMap.name.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
            if (format === "png") await exportAsPng(el, filename);
            else if (format === "svg") await exportAsSvg(el, filename);
            else if (format === "pdf") await exportAsPdf(el, filename);
            else if (format === "json") exportAsJson({ name: activeMap.name, nodes: activeMap.nodes, edges: activeMap.edges, notes: activeMap.notes }, filename);
            setToast(`Exported as ${format.toUpperCase()}`);
          }}
          onClose={() => setShowExport(false)}
        />
      )}
      {showOnboarding && (
        <OnboardingWizard
          userName={session?.user?.name ?? "there"}
          onComplete={async (data) => {
            setShowOnboarding(false);
            // Mark onboarded
            try {
              await fetch("/api/plan/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ onboarded: true, role: data.role })
              });
            } catch {}
            if (data.templateCategory !== "custom") {
              // Load template
              try {
                const res = await fetch("/api/templates");
                const templates = await res.json();
                const tpl = templates.find((t: any) => t.category === data.templateCategory);
                if (tpl) {
                  const mapData = typeof tpl.mapData === "string" ? JSON.parse(tpl.mapData) : tpl.mapData;
                  setToast(`Template "${tpl.name}" loaded! Customize it for your team.`);
                }
              } catch {}
            }
          }}
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
      {showTraining && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-[#0b1422] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 p-5">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{trainingSteps[trainingStep].icon}</div>
                <div>
                  <div className="text-lg font-bold text-slate-100">
                    {trainingSteps[trainingStep].title}
                  </div>
                  <div className="text-xs text-slate-400">
                    Step {trainingStep + 1} of {trainingSteps.length}
                  </div>
                </div>
              </div>
              <button
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
                onClick={() => setShowTraining(false)}
                aria-label="Close training"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm leading-relaxed text-slate-300">
                {trainingSteps[trainingStep].body}
              </p>

              {trainingSteps[trainingStep].tips && (
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-sky-300">
                    Quick Tips
                  </div>
                  <ul className="space-y-2">
                    {trainingSteps[trainingStep].tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="mt-0.5 text-sky-400">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-800 p-5">
              <div className="mb-4 flex justify-center gap-1.5">
                {trainingSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTrainingStep(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === trainingStep
                        ? "w-8 bg-sky-400"
                        : "w-2 bg-slate-600 hover:bg-slate-500"
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => setTrainingStep((prev) => Math.max(0, prev - 1))}
                  disabled={trainingStep === 0}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                {trainingStep < trainingSteps.length - 1 ? (
                  <button
                    className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
                    onClick={() => setTrainingStep((prev) => prev + 1)}
                  >
                    Next
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
                    onClick={() => {
                      setShowTraining(false);
                      setTrainingStep(0);
                    }}
                  >
                    Get Started
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}
              </div>

              <button
                className="mt-3 w-full text-center text-xs text-slate-500 hover:text-slate-400"
                onClick={() => {
                  setShowTraining(false);
                  setTrainingStep(0);
                }}
              >
                Skip tutorial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-600">Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}
