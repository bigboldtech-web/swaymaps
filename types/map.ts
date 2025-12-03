export type NodeKind = "person" | "system" | "process" | "generic";

export interface MapNodeMeta {
  id: string;
  kind: NodeKind; // drives visuals/colors
  kindLabel: string; // editable pill label
  title: string;
  tags: string[];
  noteId: string;
  color?: string;
  position?: { x: number; y: number };
}

export interface Note {
  id: string;
  title: string;
  tags: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface MapEdgeMeta {
  id: string;
  sourceId: string; // node id
  targetId: string; // node id
  label?: string;
  noteId?: string | null;
}

export interface DecodeMap {
  id: string;
  name: string;
  description?: string;
  ownerUserId?: string;
  sharedUserIds: string[];
  workspaceId?: string;
  createdAt: string;
  updatedAt: string;
  nodes: MapNodeMeta[];
  edges: MapEdgeMeta[];
  notes: Note[];
}

export interface User {
  id: string;
  name: string;
  color?: string;
  plan?: "free" | "pro" | "team";
}

export type WorkspaceRole = "owner" | "admin" | "editor" | "viewer";

export interface WorkspaceMember {
  userId: string;
  role: WorkspaceRole;
}

export interface Workspace {
  id: string;
  name: string;
  ownerUserId: string;
  members: WorkspaceMember[];
}
