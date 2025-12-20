import { MapEdge, MapNode, Note as PrismaNote, DecodeMap as PrismaMap, User } from "@prisma/client";
import { DecodeMap, MapEdgeMeta, MapNodeMeta, Note } from "../types/map";

function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

function stringifyTags(tags: string[]): string {
  return tags.join(", ");
}

export function prismaNoteToDomain(note: PrismaNote): Note {
  return {
    id: note.id,
    title: note.title,
    tags: parseTags(note.tags),
    content: note.content,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString()
  };
}

export function domainNoteToPrisma(note: Note, mapId: string): PrismaNote {
  return {
    id: note.id,
    mapId,
    title: note.title,
    tags: stringifyTags(note.tags),
    content: note.content,
    createdAt: new Date(note.createdAt),
    updatedAt: new Date(note.updatedAt)
  };
}

export function prismaNodeToDomain(node: MapNode): MapNodeMeta {
  return {
    id: node.id,
    kind: node.kind as MapNodeMeta["kind"],
    kindLabel: node.kindLabel,
    title: node.title,
    tags: parseTags(node.tags),
    noteId: node.noteId ?? "",
    color: node.color,
    position: { x: node.posX, y: node.posY }
  };
}

export function domainNodeToPrisma(meta: MapNodeMeta, mapId: string): Omit<MapNode, "createdAt" | "updatedAt"> {
  return {
    id: meta.id,
    mapId,
    kind: meta.kind,
    kindLabel: meta.kindLabel,
    title: meta.title,
    tags: stringifyTags(meta.tags),
    color: meta.color ?? "",
    noteId: meta.noteId || null,
    posX: meta.position?.x ?? 0,
    posY: meta.position?.y ?? 0
  };
}

export function prismaEdgeToDomain(edge: MapEdge): MapEdgeMeta {
  return {
    id: edge.id,
    sourceId: edge.sourceNodeId,
    targetId: edge.targetNodeId,
    sourceHandle: edge.sourceHandle ?? null,
    targetHandle: edge.targetHandle ?? null,
    label: edge.label ?? undefined,
    noteId: edge.noteId ?? undefined
  };
}

export function domainEdgeToPrisma(meta: MapEdgeMeta, mapId: string): Omit<MapEdge, "createdAt" | "updatedAt"> {
  return {
    id: meta.id,
    mapId,
    sourceNodeId: meta.sourceId,
    sourceHandle: meta.sourceHandle ?? null,
    targetNodeId: meta.targetId,
    targetHandle: meta.targetHandle ?? null,
    label: meta.label ?? null,
    noteId: meta.noteId ?? null
  };
}

export function prismaMapToDomain(map: PrismaMap & { nodes?: MapNode[]; edges?: MapEdge[]; notes?: PrismaNote[] }): DecodeMap {
  return {
    id: map.id,
    name: map.name,
    description: map.description ?? undefined,
    publicShareId: (map as any).publicShareId ?? null,
    ownerUserId: map.ownerId ?? undefined,
    sharedUserIds: [],
    createdAt: map.createdAt.toISOString(),
    updatedAt: map.updatedAt.toISOString(),
    nodes: map.nodes ? map.nodes.map(prismaNodeToDomain) : [],
    edges: map.edges ? map.edges.map(prismaEdgeToDomain) : [],
    notes: map.notes ? map.notes.map(prismaNoteToDomain) : []
  };
}

export function prismaUserToDomain(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    color: user.color ?? undefined,
    plan: (user as any).plan ?? "free"
  };
}
