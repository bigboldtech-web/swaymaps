"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Connection,
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
import { CanvasContextMenu } from "../../components/CanvasContextMenu";
import { CanvasSearchBar } from "../../components/CanvasSearchBar";
import { ConfirmDialog, InputDialog } from "../../components/Dialogs";

// Lazy-loaded modals for code splitting
const UpgradeModal = React.lazy(() => import("../../components/UpgradeModal").then(m => ({ default: m.UpgradeModal })));
const InviteModal = React.lazy(() => import("../../components/InviteModal").then(m => ({ default: m.InviteModal })));
const MembersModal = React.lazy(() => import("../../components/MembersModal").then(m => ({ default: m.MembersModal })));
const SettingsModal = React.lazy(() => import("../../components/SettingsModal").then(m => ({ default: m.SettingsModal })));
const AiAssistantModal = React.lazy(() => import("../../components/AiAssistantModal").then(m => ({ default: m.AiAssistantModal })));
const ShareModal = React.lazy(() => import("../../components/ShareModal").then(m => ({ default: m.ShareModal })));
const ExportModal = React.lazy(() => import("../../components/ExportModal").then(m => ({ default: m.ExportModal })));
const SearchModal = React.lazy(() => import("../../components/SearchModal").then(m => ({ default: m.SearchModal })));
const OnboardingWizard = React.lazy(() => import("../../components/OnboardingWizard").then(m => ({ default: m.OnboardingWizard })));
import { exportAsPng, exportAsSvg, exportAsPdf, exportAsJson } from "../../lib/exportMap";
import { parseCsvToMapData } from "../../lib/csvImport";
import { useUndoRedo } from "../../lib/useUndoRedo";
import {
  FlowNode, FlowEdge,
  sanitizeHandle, toFlowNodes, toFlowEdges, nextKind, defaultColorForKind,
  withCommentArray, normalizeTitle, planToGraph, now
} from "../../lib/mapHelpers";
import { DecodeMap, MapEdgeMeta, MapNodeMeta, NodeKind, Note, User, Workspace } from "../../types/map";
import { AiBrainstormPlan, AiMode } from "../../types/ai";
import { initialMaps, initialUsers, initialWorkspaces } from "../../data/initialData";
import { useTheme } from "../../components/providers/ThemeProvider";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { TrainingModal } from "../../components/dashboard/TrainingModal";
import { ErrorBoundary } from "../../components/ErrorBoundary";
const CommandPalette = React.lazy(() => import("../../components/CommandPalette").then(m => ({ default: m.CommandPalette })));
const KeyboardShortcutsHelp = React.lazy(() => import("../../components/KeyboardShortcutsHelp").then(m => ({ default: m.KeyboardShortcutsHelp })));
const VersionHistoryPanel = React.lazy(() => import("../../components/VersionHistoryPanel").then(m => ({ default: m.VersionHistoryPanel })));
const ActivityFeed = React.lazy(() => import("../../components/ActivityFeed").then(m => ({ default: m.ActivityFeed })));
const ImportModal = React.lazy(() => import("../../components/ImportModal").then(m => ({ default: m.ImportModal })));
const ApiKeysModal = React.lazy(() => import("../../components/ApiKeysModal").then(m => ({ default: m.ApiKeysModal })));
const IntegrationsModal = React.lazy(() => import("../../components/IntegrationsModal").then(m => ({ default: m.IntegrationsModal })));
const HealthDashboard = React.lazy(() => import("../../components/HealthDashboard").then(m => ({ default: m.HealthDashboard })));
const YamlDslEditor = React.lazy(() => import("../../components/YamlDslEditor").then(m => ({ default: m.YamlDslEditor })));
const InlineComments = React.lazy(() => import("../../components/InlineComments").then(m => ({ default: m.InlineComments })));
const DiffViewer = React.lazy(() => import("../../components/DiffViewer").then(m => ({ default: m.DiffViewer })));
import { usePresence } from "../../hooks/usePresence";
import { useLiveSync } from "../../hooks/useLiveSync";
import { ImportResult } from "../../lib/importers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const { theme, setTheme, toggleTheme } = useTheme();
  const isLight = theme === "light";
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTraining, setShowTraining] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem("sway-training-dismissed") !== "true";
  });
  const [showExport, setShowExport] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showHealthDashboard, setShowHealthDashboard] = useState(false);
  const [showYamlEditor, setShowYamlEditor] = useState(false);
  const [showInlineComments, setShowInlineComments] = useState(false);
  const [showDiffViewer, setShowDiffViewer] = useState(false);
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
  const [showNodeTypePicker, setShowNodeTypePicker] = useState(false);
  const [pendingNodeCallback, setPendingNodeCallback] = useState<((kind: NodeKind) => void) | null>(null);
  const { pushSnapshot, undo, redo, canUndo, canRedo } = useUndoRedo();
  const { users: presenceUsers } = usePresence(activeMapId, !shareMode && status === "authenticated");

  // Live collaborative sync — poll for remote changes every 3s
  const handleRemoteUpdate = useCallback((data: { nodes: any[]; edges: any[]; notes: any[]; updatedAt: string }) => {
    // Only apply if we're not currently editing (no selection active)
    if (selectedNodeId || selectedEdgeId) return;
    setActiveMap((prev) => {
      if (!prev) return prev;
      const notes = (data.notes ?? []).map((n: any) => ({
        ...n,
        tags: typeof n.tags === "string" ? n.tags.split(",").filter(Boolean) : n.tags || [],
        comments: n.comments || [],
      }));
      return { ...prev, nodes: data.nodes, edges: data.edges, notes, updatedAt: data.updatedAt };
    });
  }, [selectedNodeId, selectedEdgeId]);

  const { setLocalUpdatedAt, setIsSaving } = useLiveSync({
    mapId: activeMapId,
    enabled: !shareMode && status === "authenticated" && presenceUsers.length > 1,
    onRemoteUpdate: handleRemoteUpdate,
  });

  useEffect(() => {
    if (!shareMode && status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router, shareMode]);

  // Theme class and persistence handled by ThemeProvider

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
        if (!res.ok) throw new Error("Failed to fetch maps");
        const data = await res.json();
        const maps: MapListItem[] = (data.maps ?? []).map((m: any) => ({
          id: m.id,
          name: m.name,
          nodeCount: m.nodeCount ?? 0,
          edgeCount: m.edgeCount ?? 0,
          ownerName: m.ownerName,
          ownerUserId: m.ownerUserId,
          publicShareId: m.publicShareId ?? null,
          workspaceId: m.workspaceId,
          updatedAt: m.updatedAt ?? undefined,
        }));
        setMapSummaries(maps);

        const apiUsers = data.users ?? [];
        setUsers(apiUsers);
        const myId = (session as any)?.user?.id;
        setCurrentUserId(myId ?? apiUsers[0]?.id ?? null);

        const workspacesFromApi: Workspace[] = data.workspaces ?? [];
        setWorkspaces(workspacesFromApi);
        const storedWorkspaceId =
          typeof window !== "undefined" ? window.localStorage.getItem("decode-workspace-id") : null;
        const defaultWorkspace =
          workspacesFromApi.find((ws: Workspace) =>
            ws.members?.some((m: any) => m.userId === myId)
          ) ?? workspacesFromApi[0] ?? null;
        const chosenWorkspace =
          (storedWorkspaceId && workspacesFromApi.find((ws) => ws.id === storedWorkspaceId)) ||
          defaultWorkspace;
        setWorkspaceId(chosenWorkspace?.id ?? null);

        if (maps.length > 0) {
          const firstMap = chosenWorkspace
            ? maps.find((m) => m.workspaceId === chosenWorkspace.id)
            : maps[0];
          setActiveMapId(firstMap?.id ?? maps[0]?.id ?? null);
        } else {
          setActiveMapId(null);
          setActiveMap(null);
          setNodes([]);
          setEdges([]);
        }
      } catch (err) {
        console.error("Failed to load maps:", err);
        setMapSummaries([]);
        setActiveMapId(null);
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
        console.error("Failed to load map:", err);
        setActiveMap(null);
        setNodes([]);
        setEdges([]);
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
  const mapCreationBlocked = isFreePlan && ownedMapsCount >= 3;

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
      setIsSaving(true);
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
        setLocalUpdatedAt(new Date().toISOString());
      }
      setIsSaving(false);
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

  // Keep a ref to the latest save payload so beforeunload can flush it
  const pendingSave = useRef<{ mapId: string; payload: { nodes: FlowNode[]; edges: MapEdgeMeta[]; notes: Note[] } } | null>(null);

  useEffect(() => {
    if (!activeMap || shareMode) return;
    const payload = {
      nodes,
      edges: currentEdgesMeta(),
      notes: activeMap.notes
    };
    pendingSave.current = { mapId: activeMap.id, payload };
    setSaveStatus("unsaved");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      persistState(activeMap.id, payload);
      pendingSave.current = null;
    }, 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, activeMap?.notes, activeMap?.id, currentEdgesMeta]);

  // Flush pending save on page unload to prevent data loss
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pendingSave.current) {
        const { mapId, payload } = pendingSave.current;
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
        const body = JSON.stringify({ ...payload, nodes: serializedNodes, edges: serializedEdges });
        navigator.sendBeacon(`/api/maps/${mapId}/state`, new Blob([body], { type: "application/json" }));
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

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
        return { id: n.id, label: n.title || tag.replace("__pin:", "") };
      })
      .filter(Boolean) as { id: string; label: string }[];
  }, [activeMap]);

  const addNodeToMap = (targetMap: DecodeMap, chosenKind?: NodeKind) => {
    const baseNode =
      targetMap.id === activeMap?.id
        ? (selectedNodeId && nodes.find((n) => n.id === selectedNodeId)) || nodes[0] || null
        : null;
    const basePos = viewportCenter ?? baseNode?.position ?? { x: 100, y: 100 };
    const position = { x: basePos.x, y: basePos.y };
    const id = crypto.randomUUID ? crypto.randomUUID() : `node-${Date.now()}`;
    const noteId = crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}`;
    const kind = chosenKind ?? nextKind(nodes.length);
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

  const addNodeWithKind = (chosenKind: NodeKind) => {
    if (!activeMap) {
      if (currentRole === "viewer" || currentRole === "editor") {
        setToast("Only owners/admins can create maps in this workspace.");
        return;
      }
      if (mapCreationBlocked) {
        setToast("Free plan allows 3 maps. Upgrade to create more.");
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
          addNodeToMap(newMap, chosenKind);
        }
      });
      return;
    }
    addNodeToMap(activeMap, chosenKind);
  };

  const handleAddNode = () => {
    if (shareMode) {
      setToast("View-only share. Sign in to edit.");
      return;
    }
    setShowNodeTypePicker(true);
    setPendingNodeCallback(() => (kind: NodeKind) => {
      addNodeWithKind(kind);
    });
  };

  const publicViewLink = (shareId?: string | null) =>
    shareId ? `${window.location.origin}/embed/${shareId}` : null;

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
      nodes: map.nodes.slice(0, 20).map((node) => {
        const note = map.notes.find((n) => n.id === node.noteId);
        return {
          title: node.title,
          kind: node.kind,
          tags: node.tags.slice(0, 6),
          note: (note?.content ?? "").slice(0, 500)
        };
      }),
      edges: map.edges.slice(0, 30).map((edge) => ({
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
      setToast("Free plan allows 3 maps. Upgrade to create more.");
      setShowUpgrade(true);
      throw new Error("Free plan allows 3 maps. Upgrade to create more.");
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
    const newNoteId = `note-${Date.now()}`;
    // Clone the source note or create a fresh one
    const sourceNote = activeMap?.notes.find((n) => n.id === sourceNode.data.meta.noteId);
    const newNote: Note = {
      id: newNoteId,
      title: sourceNote?.title ? `${sourceNote.title} (copy)` : "New Note",
      tags: sourceNote?.tags ? [...sourceNote.tags] : [],
      content: sourceNote?.content ?? "Add details here...",
      comments: [],
      createdAt: now(),
      updatedAt: now(),
    };
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
          noteId: newNoteId,
        },
      },
    };
    setNodes((nds) => [...nds, newNode]);
    if (activeMap) {
      setActiveMap((prev) =>
        prev
          ? { ...prev, nodes: [...prev.nodes, newNode.data.meta], notes: [...prev.notes, newNote] }
          : prev
      );
    }
    setSelectedNodeId(newId);
  }, [shareMode, selectedNodeId, nodes, activeMap, setNodes]);

  const handleAutoLayout = useCallback(
    (type: "hierarchical" | "radial" | "top-bottom" | "left-right") => {
      if (nodes.length === 0) return;

      // Build adjacency from edges
      const targetIds = new Set(edges.map((e) => e.target));
      const roots = nodes.filter((n) => !targetIds.has(n.id));
      if (roots.length === 0) roots.push(nodes[0]);

      // BFS to assign depth levels
      const depthMap = new Map<string, number>();
      const visited = new Set<string>();
      const queue: { id: string; depth: number }[] = roots.map((r) => ({ id: r.id, depth: 0 }));
      const depthBuckets = new Map<number, string[]>();

      while (queue.length > 0) {
        const { id, depth } = queue.shift()!;
        if (visited.has(id)) continue;
        visited.add(id);
        depthMap.set(id, depth);
        if (!depthBuckets.has(depth)) depthBuckets.set(depth, []);
        depthBuckets.get(depth)!.push(id);
        const children = edges
          .filter((e) => e.source === id)
          .map((e) => e.target)
          .filter((tid) => !visited.has(tid));
        children.forEach((cid) => queue.push({ id: cid, depth: depth + 1 }));
      }
      // Place any disconnected nodes
      nodes.forEach((n) => {
        if (!depthMap.has(n.id)) {
          const maxDepth = Math.max(0, ...depthBuckets.keys()) + 1;
          depthMap.set(n.id, maxDepth);
          if (!depthBuckets.has(maxDepth)) depthBuckets.set(maxDepth, []);
          depthBuckets.get(maxDepth)!.push(n.id);
        }
      });

      const positions = new Map<string, { x: number; y: number }>();
      const nodeW = 320; // node width + padding
      const nodeH = 260; // node height + padding
      const maxDepth = Math.max(0, ...depthBuckets.keys());

      if (type === "hierarchical" || type === "top-bottom") {
        // Top-to-bottom: depth = Y axis, centered horizontally per level
        const maxWidth = Math.max(...[...depthBuckets.values()].map((b) => b.length));
        const totalWidth = maxWidth * nodeW;

        for (const [depth, ids] of depthBuckets.entries()) {
          const levelWidth = ids.length * nodeW;
          const startX = (totalWidth - levelWidth) / 2;
          ids.forEach((id, i) => {
            positions.set(id, { x: startX + i * nodeW, y: depth * nodeH });
          });
        }
      } else if (type === "left-right") {
        // Left-to-right: depth = X axis, centered vertically per level
        const maxHeight = Math.max(...[...depthBuckets.values()].map((b) => b.length));
        const totalHeight = maxHeight * nodeH;

        for (const [depth, ids] of depthBuckets.entries()) {
          const levelHeight = ids.length * nodeH;
          const startY = (totalHeight - levelHeight) / 2;
          ids.forEach((id, i) => {
            positions.set(id, { x: depth * (nodeW + 80), y: startY + i * nodeH });
          });
        }
      } else {
        // Radial: root at center, each depth ring radiates outward
        const centerX = 800;
        const centerY = 600;
        // Place roots at center
        const rootIds = depthBuckets.get(0) || [];
        rootIds.forEach((id, i) => {
          const angle = rootIds.length === 1 ? 0 : (2 * Math.PI * i) / rootIds.length;
          positions.set(id, { x: centerX + 60 * Math.cos(angle), y: centerY + 60 * Math.sin(angle) });
        });
        // Each subsequent depth gets a larger ring
        for (let d = 1; d <= maxDepth; d++) {
          const ids = depthBuckets.get(d) || [];
          const radius = d * 400;
          ids.forEach((id, i) => {
            const angle = (2 * Math.PI * i) / ids.length - Math.PI / 2;
            positions.set(id, { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) });
          });
        }
      }

      setNodes((nds) =>
        nds.map((n) => ({ ...n, position: positions.get(n.id) ?? n.position }))
      );
      const labels: Record<string, string> = {
        hierarchical: "top-to-bottom",
        "top-bottom": "top-to-bottom",
        "left-right": "left-to-right",
        radial: "radial",
      };
      setToast(`Applied ${labels[type]} layout`);
    },
    [nodes, edges, setNodes]
  );

  const handleFitView = useCallback(() => {
    const fitBtn = document.querySelector(".react-flow__controls-fitview") as HTMLButtonElement;
    fitBtn?.click();
  }, []);

  const commandPaletteItems = useMemo(() => {
    const items: Array<{
      id: string;
      label: string;
      category: "action" | "navigation" | "node";
      shortcut?: string;
      icon?: React.ReactNode;
      onSelect: () => void;
    }> = [
      {
        id: "add-node", label: "Add Node", category: "action", shortcut: "N",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M12 4v16m-8-8h16" /></svg>,
        onSelect: handleAddNode,
      },
      {
        id: "undo", label: "Undo", category: "action", shortcut: "\u2318Z",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" /></svg>,
        onSelect: handleUndo,
      },
      {
        id: "redo", label: "Redo", category: "action", shortcut: "\u2318\u21e7Z",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M21 10H11a5 5 0 00-5 5v2M21 10l-4-4M21 10l-4 4" /></svg>,
        onSelect: handleRedo,
      },
      {
        id: "fit-view", label: "Fit View", category: "action",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" /></svg>,
        onSelect: handleFitView,
      },
      {
        id: "search-nodes", label: "Search Nodes", category: "action", shortcut: "\u2318F",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
        onSelect: () => setShowCanvasSearch(true),
      },
      {
        id: "settings", label: "Settings", category: "navigation",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" /><circle cx="12" cy="12" r="3" /></svg>,
        onSelect: () => setShowSettings(true),
      },
      {
        id: "export", label: "Export Map", category: "navigation",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        onSelect: () => setShowExport(true),
      },
      {
        id: "version-history", label: "Version History", category: "navigation",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        onSelect: () => setShowVersionHistory(true),
      },
      {
        id: "activity", label: "Activity Feed", category: "navigation",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        onSelect: () => setShowActivity(true),
      },
      {
        id: "shortcuts", label: "Keyboard Shortcuts", category: "navigation", shortcut: "?",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>,
        onSelect: () => setShowShortcutsHelp(true),
      },
      {
        id: "share", label: "Share Map", category: "navigation",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
        onSelect: () => activeMap && setShowShareModal(true),
      },
      {
        id: "health-dashboard", label: "Health Dashboard", category: "action",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
        onSelect: () => setShowHealthDashboard(true),
      },
      {
        id: "yaml-editor", label: "Diagram as Code (YAML)", category: "action",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>,
        onSelect: () => setShowYamlEditor(true),
      },
      {
        id: "diff-viewer", label: "Change Diff View", category: "action",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
        onSelect: () => setShowDiffViewer(true),
      },
      {
        id: "import-map", label: "Import from External Tool", category: "action",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>,
        onSelect: () => setShowImportModal(true),
      },
      {
        id: "toggle-theme", label: `Switch to ${theme === "light" ? "Dark" : "Light"} Mode`, category: "action",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>,
        onSelect: toggleTheme,
      },
      {
        id: "integrations", label: "Integrations (Slack/Teams)", category: "navigation",
        icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" /></svg>,
        onSelect: () => setShowIntegrations(true),
      },
    ];

    if (activeMap) {
      for (const node of activeMap.nodes) {
        items.push({
          id: `node-${node.id}`,
          label: node.title,
          category: "node",
          icon: <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="3" /></svg>,
          onSelect: () => handleFocusNode(node.id),
        });
      }
    }

    return items;
  }, [activeMap, handleAddNode, handleUndo, handleRedo, handleFitView, handleFocusNode]);

  const handleRestoreVersion = useCallback(async (versionId: string) => {
    if (!activeMap) return;
    try {
      const res = await fetch(`/api/maps/${activeMap.id}/versions`);
      const versions = await res.json();
      const version = versions.find((v: any) => v.id === versionId);
      if (!version) { setToast("Version not found"); return; }

      const snapshotRes = await fetch(`/api/maps/${activeMap.id}/versions/${versionId}`);
      if (!snapshotRes.ok) { setToast("Failed to load version"); return; }
      const snapshot = await snapshotRes.json();

      setToast(`Restored to v${version.version}`);
      setShowVersionHistory(false);
    } catch {
      setToast("Failed to restore version");
    }
  }, [activeMap]);

  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onAddNode: handleAddNode,
    onDeleteSelected: handleDeleteSelected,
    onDuplicateNode: handleDuplicateNode,
    onToggleSearch: () => setShowCanvasSearch(true),
    onClearSelection: () => {
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setShowCanvasSearch(false);
    },
    onCloseContextMenu: () => setContextMenu(null),
    onCommandPalette: () => setShowCommandPalette((v) => !v),
    onShortcutsHelp: () => setShowShortcutsHelp((v) => !v),
  });


  const handleCreateNodeAt = (
    position: { x: number; y: number },
    from: { nodeId: string; handleId?: string }
  ) => {
    if (shareMode) return;
    if (!activeMap) return;
    // Show the node type picker and create node+edge once user picks a type
    setShowNodeTypePicker(true);
    setPendingNodeCallback(() => (kind: NodeKind) => {
      const id = crypto.randomUUID ? crypto.randomUUID() : `node-${Date.now()}`;
      const noteId = crypto.randomUUID ? crypto.randomUUID() : `note-${Date.now()}`;
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
      const sourceHandle = sanitizeHandle(from.handleId, "source");
      const oppositeMap: { [key: string]: string } = {
        "right-source": "left-target",
        "left-source": "right-target",
        "bottom-source": "top-target",
        "top-source": "bottom-target",
      };
      const targetHandle = oppositeMap[sourceHandle as string] || "top-target";
      const edgeMeta: MapEdgeMeta = {
        id: edgeId,
        sourceId: from.nodeId,
        targetId: id,
        sourceHandle,
        targetHandle,
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
    });
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
      setToast("Free plan allows 3 maps. Upgrade to create more.");
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
      <div className={`flex min-h-screen items-center justify-center ${isLight ? "bg-[#f1f3f8] text-slate-500" : "bg-[#050b15] text-slate-400"} animate-fade-in`}>
        <div className="flex flex-col items-center gap-3">
          <div className={`h-8 w-8 animate-spin rounded-full border-2 ${isLight ? "border-slate-300 border-t-brand-500" : "border-slate-700 border-t-brand-500"}`} />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    );
  }
  if (shareMode && !shareLoaded) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${isLight ? "bg-[#f1f3f8] text-slate-500" : "bg-[#050b15] text-slate-400"} animate-fade-in`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-brand-500" />
          <span className="text-sm font-medium">Loading shared board...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen relative ${isLight ? "bg-[#f1f3f8] text-slate-800" : "bg-[#050b15] text-slate-100"}`}>
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
              : () => setShowTraining(true)
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
          onImport={!shareMode ? () => setShowImportModal(true) : undefined}
          search={mapSearch}
          onSearchChange={(val) => setMapSearch(val)}
          theme={theme}
          workspaces={userWorkspaces}
          currentWorkspaceId={workspaceId}
          onSelectWorkspace={(id) => setWorkspaceId(id)}
          userName={currentUser?.name ?? undefined}
          userEmail={currentUser?.email ?? undefined}
        />
      ) : (
        <div
          className="w-3 cursor-pointer"
          onMouseEnter={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        />
      )}

      <div className="flex flex-1 flex-col relative z-50">
        <DashboardHeader
          mapName={activeMap?.name ?? ""}
          onMapNameChange={(name) => setActiveMap((prev) => (prev ? { ...prev, name } : prev))}
          onMapNameBlur={async (newName) => {
            if (!activeMap || shareMode) return;
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
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebarOpen(true)}
          shareMode={shareMode}
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
          pinOptions={pinOptions}
          onFocusNode={handleFocusNode}
          aiEnabled={aiEnabled}
          onAiAssist={() => {
            setAiError(null);
            if (!aiEnabled) { setToast("AI is disabled. Enable it in Settings."); return; }
            setShowAiAssistant(true);
          }}
          onShare={() => activeMap && setShowShareModal(true)}
          activeMapExists={!!activeMap}
          presenceUsers={presenceUsers}
          currentUserId={currentUserId ?? undefined}
        />

        <main className="flex flex-1 overflow-hidden">
          <section className={`relative flex-1 ${isLight ? "bg-[#edf0f7]" : "bg-[#050b15]"}`}>
            <div className="h-full w-full p-4">
              <div
                className={`relative h-full overflow-hidden rounded-xl border shadow ${isLight ? "border-slate-200/60 bg-[#edf0f7]" : "border-slate-800/60 bg-[#0b1422]"}`}
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
              className={`w-[380px] border-l backdrop-blur-xl overflow-y-auto max-h-[calc(100vh-80px)] ${isLight ? "border-slate-200/60 bg-[#f5f7fb]/90" : "border-slate-800/60 bg-[#050b15]/90"}`}
            >
              <NoteInspector
                selectedNote={selectedNote}
                selectedMeta={selectedMeta}
                selectedEdge={selectedEdgeMeta}
                selectedEdgeNote={selectedEdgeNote}
                allNodes={activeMap?.nodes}
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
          shareId={activeMap.publicShareId}
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
      {/* Node Type Picker */}
      {showNodeTypePicker && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => { setShowNodeTypePicker(false); setPendingNodeCallback(null); }}>
          <div className={`w-[480px] rounded-2xl border p-6 shadow-2xl backdrop-blur-xl animate-scale-in ${isLight ? "border-slate-200/60 bg-white/95 shadow-black/10" : "border-slate-700/40 bg-[#0a1020]/95 shadow-black/40"}`} onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <h3 className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-white"}`}>Add Node</h3>
              <p className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>Choose a node type for your dependency map</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {([
                { kind: "person" as NodeKind, label: "Person", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", color: "#38bdf8" },
                { kind: "system" as NodeKind, label: "System", icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01", color: "#22c55e" },
                { kind: "process" as NodeKind, label: "Process", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", color: "#fbbf24" },
                { kind: "database" as NodeKind, label: "Database", icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4", color: "#29a5e5" },
                { kind: "api" as NodeKind, label: "API", icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "#2192dd" },
                { kind: "queue" as NodeKind, label: "Queue", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", color: "#f59e0b" },
                { kind: "cache" as NodeKind, label: "Cache", icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "#ef4444" },
                { kind: "cloud" as NodeKind, label: "Cloud", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", color: "#8b5cf6" },
                { kind: "team" as NodeKind, label: "Team", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "#14b8a6" },
                { kind: "vendor" as NodeKind, label: "Vendor", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "#f97316" },
                { kind: "generic" as NodeKind, label: "Generic", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "#29a5e5" },
              ]).map(({ kind, label, icon, color }) => (
                <button
                  key={kind}
                  className={`group flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-all hover:border-opacity-60 hover:bg-opacity-40 hover:shadow-lg ${isLight ? "border-slate-200/50 bg-slate-100/30" : "border-slate-700/30 bg-slate-800/20"}`}
                  style={{ ["--accent" as string]: color }}
                  onClick={() => {
                    setShowNodeTypePicker(false);
                    const cb = pendingNodeCallback;
                    setPendingNodeCallback(null);
                    cb?.(kind);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${color}50`;
                    e.currentTarget.style.backgroundColor = `${color}10`;
                    e.currentTarget.style.boxShadow = `0 0 20px ${color}15`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.backgroundColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg transition" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
                    <svg className="h-4.5 w-4.5" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
                  </div>
                  <span className={`text-xs font-medium transition ${isLight ? "text-slate-600 group-hover:text-slate-900" : "text-slate-300 group-hover:text-white"}`}>{label}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button className={`rounded-lg px-3 py-1.5 text-sm transition ${isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"}`} onClick={() => { setShowNodeTypePicker(false); setPendingNodeCallback(null); }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
          onToggleTheme={toggleTheme}
          useGradientEdges={useGradientEdges}
          onToggleGradientEdges={() => setUseGradientEdges((v) => !v)}
          aiEnabled={aiEnabled}
          aiKey={aiKey}
          onToggleAiEnabled={(enabled) => setAiEnabled(enabled)}
          onChangeAiKey={(key) => setAiKey(key)}
          onClose={() => setShowSettings(false)}
          onOpenApiKeys={() => setShowApiKeys(true)}
          onOpenIntegrations={() => setShowIntegrations(true)}
          onExportAuditLog={async () => {
            if (!workspaceId) return;
            try {
              const res = await fetch(`/api/audit/export?workspaceId=${workspaceId}&format=csv`);
              if (!res.ok) throw new Error("Export failed");
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
              setToast("Audit log exported");
            } catch {
              setToast("Audit log export failed");
            }
          }}
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
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl glass-panel-solid px-4 py-2.5 text-sm font-semibold text-slate-100 shadow-lg animate-scale-in">
          {toast}
          <button className="ml-1 rounded-md p-0.5 text-slate-400 transition hover:text-slate-200" onClick={() => setToast(null)}>
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
      <CommandPalette
        open={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        items={commandPaletteItems}
      />
      <KeyboardShortcutsHelp
        open={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />
      <VersionHistoryPanel
        open={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        mapId={activeMapId}
        onRestore={handleRestoreVersion}
      />
      <ActivityFeed
        open={showActivity}
        onClose={() => setShowActivity(false)}
        workspaceId={workspaceId}
      />
      <TrainingModal open={showTraining} onClose={() => setShowTraining(false)} />
      {showImportModal && (
        <ImportModal
          open={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={async (result: ImportResult) => {
            setShowImportModal(false);
            try {
              const mapData = {
                name: `Imported Map (${new Date().toLocaleDateString()})`,
                workspaceId,
                nodes: result.nodes.map(n => ({
                  kind: n.kind,
                  kindLabel: n.kindLabel,
                  title: n.title,
                  tags: n.tags.join(","),
                  color: n.color,
                  posX: n.posX,
                  posY: n.posY,
                })),
                edges: result.edges.map(e => ({
                  tempSourceId: e.sourceId,
                  tempTargetId: e.targetId,
                  label: e.label || "",
                })),
              };
              const res = await fetch("/api/maps/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mapData),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error);
              setToast(`Imported ${result.nodes.length} nodes, ${result.edges.length} edges`);
              setActiveMapId(data.id);
            } catch (err: any) {
              setToast(err?.message ?? "Import failed");
            }
          }}
        />
      )}
      {showApiKeys && (
        <ApiKeysModal
          open={showApiKeys}
          onClose={() => setShowApiKeys(false)}
          workspaceId={workspaceId}
        />
      )}
      {showIntegrations && (
        <IntegrationsModal
          open={showIntegrations}
          onClose={() => setShowIntegrations(false)}
          workspaceId={workspaceId}
        />
      )}
      {showHealthDashboard && activeMap && (
        <HealthDashboard
          nodes={activeMap.nodes}
          edges={activeMap.edges}
          isOpen={showHealthDashboard}
          onClose={() => setShowHealthDashboard(false)}
          onNodeClick={(nodeId) => {
            setShowHealthDashboard(false);
            handleFocusNode(nodeId);
          }}
        />
      )}
      {showYamlEditor && (
        <YamlDslEditor
          open={showYamlEditor}
          onClose={() => setShowYamlEditor(false)}
          nodes={activeMap?.nodes ?? []}
          edges={activeMap?.edges ?? []}
          onApply={(newNodes, newEdges) => {
            if (!activeMap) return;
            const updatedMap = { ...activeMap, nodes: newNodes, edges: newEdges, updatedAt: now() };
            setActiveMap(updatedMap);
            setNodes(toFlowNodes(newNodes, handleUpdateMeta));
            setEdges(toFlowEdges(newEdges));
            setShowYamlEditor(false);
            setToast("Map updated from YAML");
          }}
        />
      )}
      {showDiffViewer && activeMap && (
        <DiffViewer
          open={showDiffViewer}
          onClose={() => setShowDiffViewer(false)}
          mapId={activeMap.id}
          currentNodes={activeMap.nodes}
          currentEdges={activeMap.edges}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-400"><div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-brand-500 dark:border-slate-700 dark:border-t-brand-500" /></div>}>
        <PageContent />
      </Suspense>
    </ErrorBoundary>
  );
}
