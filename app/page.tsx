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
import { DecodeMap, MapEdgeMeta, MapNodeMeta, Note, NodeKind, User, Workspace } from "../types/map";
import { initialMaps, initialUsers, initialWorkspaces } from "../data/initialData";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type FlowNode = Node<FlowNodeData>;
type FlowEdge = Edge<FlowEdgeData>;

const baseX = 240;
const baseY = 180;

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
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.sourceId,
    target: edge.targetId,
    label: edge.label ?? "",
    type: "smoothstep",
    data: { meta: edge }
  }));
}

function nextKind(idx: number): NodeKind {
  const kinds: NodeKind[] = ["person", "system", "process", "generic"];
  return kinds[idx % kinds.length];
}

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mapSummaries, setMapSummaries] = useState<MapListItem[]>([]);
  const [activeMap, setActiveMap] = useState<DecodeMap | null>(null);
  const [activeMapId, setActiveMapId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdgeData>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

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
        setWorkspaces(data.workspaces ?? initialWorkspaces);
        const defaultWorkspace =
          data.workspaces?.find((ws: Workspace) =>
            ws.members?.some((m: any) => m.userId === firstUserId)
          ) ?? data.workspaces?.[0] ?? initialWorkspaces[0] ?? null;
        setWorkspaceId(defaultWorkspace?.id ?? null);
        const firstMap = maps.find((m) =>
          defaultWorkspace ? m.workspaceId === defaultWorkspace.id : true
        );
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
        setWorkspaceId(initialWorkspaces[0]?.id ?? null);
        setWorkspaces(initialWorkspaces);
        setActiveMapId(maps[0]?.id ?? null);
        setActiveMap(initialMaps[0] ?? null);
        setNodes(toFlowNodes(initialMaps[0]?.nodes ?? [], handleUpdateMeta));
        setEdges(toFlowEdges(initialMaps[0]?.edges ?? []));
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
      if (ws) setWorkspaceId(ws.id);
    }
  }, [session?.user?.id, workspaces]);

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
      workspaceId
        ? mapSummaries.filter((m) => m.workspaceId === workspaceId)
        : mapSummaries,
    [mapSummaries, workspaceId]
  );

  const persistState = async (mapId: string, payload: { nodes: FlowNode[]; edges: MapEdgeMeta[]; notes: Note[] }) => {
    const serializedNodes = payload.nodes.map((node) => ({
      id: node.id,
      position: node.position,
      data: { meta: node.data.meta }
    }));
    await fetch(`/api/maps/${mapId}/state`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, nodes: serializedNodes })
    });
  };

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
    const mappedEdges = edges.map((edge) => edge.data.meta);
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
    const id = crypto.randomUUID ? crypto.randomUUID() : `edge-${Date.now()}`;
    const meta: MapEdgeMeta = {
      id,
      sourceId: connection.source,
      targetId: connection.target,
      label: "",
      noteId: null
    };
    setEdges((eds) =>
      addEdge(
        {
          ...connection,
          id,
          type: "default",
          label: "",
          data: { meta }
        },
        eds
      )
    );
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
    setActiveMap((prev) =>
      prev
        ? {
            ...prev,
            edges: prev.edges.map((e) => (e.id === edge.id ? edge : e)),
            updatedAt: now()
          }
        : prev
    );
    setEdges((prev) =>
      prev.map((e) =>
        e.id === edge.id ? { ...e, label: edge.label ?? "", data: { meta: edge } } : e
      )
    );
  };

  const handleUpdateNodeColor = (color: string) => {
    if (!selectedMeta) return;
    handleUpdateMeta({ ...selectedMeta, color });
  };

  const handleAddNode = () => {
    if (!activeMap) return;
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
      color: "#f3f4f6",
      position: {
        x: (nodes.length % 3) * baseX + 40,
        y: Math.floor(nodes.length / 3) * baseY + 80
      }
    };
    const note: Note = {
      id: noteId,
      title: "New Note",
      tags: [],
      content: "Add details here...",
      createdAt: now(),
      updatedAt: now()
    };

    setActiveMap((prev) =>
      prev
        ? {
            ...prev,
            nodes: [...prev.nodes, meta],
            notes: [...prev.notes, note],
            updatedAt: now()
          }
        : prev
    );
    setNodes((prev) => [
      ...prev,
      { id, type: "decodeNode", position: meta.position!, data: { meta, onUpdateMeta: handleUpdateMeta } }
    ]);
    syncMapSummaryCounts(activeMap.id, (activeMap.nodes.length ?? 0) + 1);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  };

  const handleResetLayout = () => {
    if (!activeMap) return;
    const nextNodes = toFlowNodes(activeMap.nodes, handleUpdateMeta);
    setNodes(nextNodes);
  };

  const handleCreateMap = async () => {
    const name = prompt("Map name?");
    if (!name) return;
    const ownerId = session?.user?.id ?? currentUserId ?? users[0]?.id;
    const currentUser = users.find((u) => u.id === ownerId);
    const isFree = currentUser?.plan === "free";
    const ownedCount = mapsForWorkspace.filter((m) => m.ownerUserId === ownerId).length;
    if (currentRole === "viewer" || currentRole === "editor") {
      setToast("Only owners/admins can create maps in this workspace.");
      return;
    }
    if (isFree && ownedCount >= 1) {
      setToast("Free plan allows 1 map. Upgrade to create more.");
      setShowUpgrade(true);
      return;
    }

    const res = await fetch("/api/maps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, ownerUserId: ownerId ?? undefined, workspaceId })
    });
    if (!res.ok) {
      alert("Could not create map. Please try again.");
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
  };

  const handleDeleteMap = async (id: string) => {
    if (!confirm("Delete this map?")) return;
    if (currentRole === "viewer" || currentRole === "editor") {
      setToast("Only owners/admins can delete maps.");
      return;
    }
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
  };

  const handleCreateUser = async (name?: string, color?: string) => {
    const finalName = name ?? prompt("New user name?") ?? "";
    if (!finalName.trim()) return;
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: finalName.trim(), color })
    });
    if (!res.ok) return;
    const user = await res.json();
    setUsers((prev) => [...prev, user]);
    setCurrentUserId(user.id);
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
    <div className="flex min-h-screen relative">
      {sidebarOpen ? (
        <Sidebar
          maps={mapsForWorkspace}
          activeMapId={activeMapId}
          onSelectMap={(id) => setActiveMapId(id)}
          onCreateMap={handleCreateMap}
          onDeleteMap={handleDeleteMap}
          onClose={() => setSidebarOpen(false)}
          planLabel={users.find((u) => u.id === currentUserId)?.plan ?? "free"}
          onInvite={currentWorkspace ? () => setShowInvite(true) : undefined}
          onAdmin={() => setShowAdmin(true)}
          onMembers={currentRole === "owner" || currentRole === "admin" ? () => setShowMembers(true) : undefined}
          onUpgrade={() => setShowUpgrade(true)}
          authLabel={session ? "Sign out" : "Sign in"}
          onAuthClick={() => (session ? signOut() : signIn())}
        />
      ) : (
        <div
          className="w-3 cursor-pointer"
          onMouseEnter={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        />
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 shadow-sm backdrop-blur">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wide text-slate-500">Decode Map</div>
            <div className="text-xl font-semibold text-slate-900">
              {activeMap?.name ?? "Loading..."}
            </div>
            <p className="text-sm text-slate-600">Drag, connect, and edit notes on nodes or edges.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              onClick={handleAddNode}
            >
              Add Node
            </button>
            <button
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              onClick={handleResetLayout}
            >
              Reset Layout
            </button>
          </div>
        </header>

        <main className="flex flex-1 overflow-hidden">
          <section className="flex-1 bg-slate-50">
            <div className="h-full w-full p-4">
              <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow">
                <DecodeMapCanvas
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onSelectNode={handleSelectNode}
                  onSelectEdge={handleSelectEdge}
                  onClearSelection={handleClearSelection}
                  onConnectEdge={handleConnectEdge}
                />
              </div>
            </div>
          </section>
          {(selectedMeta || selectedEdgeMeta) && (
            <aside className="w-[380px] border-l border-slate-200 bg-white">
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
                onNoSelectionMessage="Click a node or connection on the map to view or edit its note."
              />
            </aside>
          )}
        </main>
      </div>
      {showAdmin && (
        <AdminPanel
          users={users}
          onAddUser={(name, color) => handleCreateUser(name, color)}
          onClose={() => setShowAdmin(false)}
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
      {showMembers && currentWorkspace && (
        <MembersModal
          workspace={currentWorkspace}
          users={users}
          onChangeRole={handleChangeMemberRole}
          onRemove={handleRemoveMember}
          onClose={() => setShowMembers(false)}
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
