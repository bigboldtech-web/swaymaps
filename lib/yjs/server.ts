/**
 * Yjs sync server — hosts a Y.Doc per map id, handles client sync messages,
 * persists snapshots to Postgres, and routes presence/awareness updates.
 *
 * Architecture:
 *   • One Y.Doc per map, kept in memory while at least one client is connected.
 *   • Messages follow the y-protocols sync (encoding 0) + awareness (encoding 1)
 *     wire format. Same as y-websocket reference implementation.
 *   • Persisted to MapYjsDoc on a 5-second debounce after the last edit.
 *   • Doc is dropped from memory ~30 seconds after the last client disconnects.
 *
 * This is a scaffold — production hardening (auth on the WebSocket handshake,
 * per-room metrics, horizontal scaling via Redis pub/sub) is intentionally
 * deferred. The interface is correct; the back end can grow.
 */

import * as Y from "yjs";
import { WebSocket, WebSocketServer } from "ws";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import type { IncomingMessage } from "http";
import { prisma } from "@/lib/prisma";

// y-protocols message types (canonical wire format)
const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;

/** Debounce interval for persisting the doc to Postgres (ms). */
const PERSIST_DEBOUNCE_MS = 5_000;
/** Grace period after the last client disconnects before we evict the doc (ms). */
const EVICT_DELAY_MS = 30_000;

interface Room {
  mapId: string;
  doc: Y.Doc;
  awareness: awarenessProtocol.Awareness;
  conns: Set<WebSocket>;
  /** Timer for the debounced persist. */
  persistTimer: NodeJS.Timeout | null;
  /** Timer for the eviction-after-empty grace period. */
  evictTimer: NodeJS.Timeout | null;
  /** Resolves when the initial state is loaded from DB. */
  ready: Promise<void>;
}

const rooms = new Map<string, Room>();

async function getOrCreateRoom(mapId: string): Promise<Room> {
  const existing = rooms.get(mapId);
  if (existing) {
    if (existing.evictTimer) {
      clearTimeout(existing.evictTimer);
      existing.evictTimer = null;
    }
    return existing;
  }

  const doc = new Y.Doc();
  const awareness = new awarenessProtocol.Awareness(doc);
  awareness.setLocalState(null); // server has no presence

  const room: Room = {
    mapId,
    doc,
    awareness,
    conns: new Set(),
    persistTimer: null,
    evictTimer: null,
    ready: Promise.resolve(),
  };

  // Load persisted state (if any). All connections wait on `ready` before
  // receiving sync messages — otherwise the first client would race with
  // the initial state load and drop bytes.
  room.ready = (async () => {
    try {
      const persisted = await prisma.mapYjsDoc.findUnique({
        where: { mapId },
        select: { state: true },
      });
      if (persisted?.state) {
        Y.applyUpdate(doc, persisted.state);
      }
    } catch (e) {
      console.error(`[yjs] load failed for ${mapId}:`, (e as any)?.message);
    }
  })();

  // Persist on every doc update, debounced.
  doc.on("update", () => {
    if (room.persistTimer) clearTimeout(room.persistTimer);
    room.persistTimer = setTimeout(() => persistRoom(room), PERSIST_DEBOUNCE_MS);
  });

  // Awareness changes are broadcast but never persisted (presence is ephemeral).
  awareness.on("update", ({ added, updated, removed }: any, origin: any) => {
    const changed = [...added, ...updated, ...removed];
    if (changed.length === 0) return;
    const enc = encoding.createEncoder();
    encoding.writeVarUint(enc, MESSAGE_AWARENESS);
    encoding.writeVarUint8Array(
      enc,
      awarenessProtocol.encodeAwarenessUpdate(awareness, changed)
    );
    const msg = encoding.toUint8Array(enc);
    for (const c of room.conns) {
      if (c !== origin && c.readyState === WebSocket.OPEN) {
        try {
          c.send(msg);
        } catch {
          // ignore
        }
      }
    }
  });

  rooms.set(mapId, room);
  return room;
}

async function persistRoom(room: Room) {
  room.persistTimer = null;
  try {
    const state = Buffer.from(Y.encodeStateAsUpdate(room.doc));
    await prisma.mapYjsDoc.upsert({
      where: { mapId: room.mapId },
      create: { mapId: room.mapId, state, version: 1 },
      update: { state, version: { increment: 1 } },
    });
  } catch (e) {
    console.error(`[yjs] persist failed for ${room.mapId}:`, (e as any)?.message);
  }
}

function maybeEvictRoom(room: Room) {
  if (room.conns.size > 0) return;
  if (room.evictTimer) return;
  room.evictTimer = setTimeout(() => {
    if (room.conns.size > 0) return;
    if (room.persistTimer) {
      clearTimeout(room.persistTimer);
      room.persistTimer = null;
      // Flush before evicting
      persistRoom(room).finally(() => {
        room.doc.destroy();
        rooms.delete(room.mapId);
      });
    } else {
      room.doc.destroy();
      rooms.delete(room.mapId);
    }
  }, EVICT_DELAY_MS);
}

function handleMessage(room: Room, conn: WebSocket, message: Uint8Array) {
  try {
    const dec = decoding.createDecoder(message);
    const messageType = decoding.readVarUint(dec);
    switch (messageType) {
      case MESSAGE_SYNC: {
        const enc = encoding.createEncoder();
        encoding.writeVarUint(enc, MESSAGE_SYNC);
        syncProtocol.readSyncMessage(dec, enc, room.doc, conn);
        // readSyncMessage may have written a reply into `enc`. Send it back.
        if (encoding.length(enc) > 1) {
          conn.send(encoding.toUint8Array(enc));
        }
        break;
      }
      case MESSAGE_AWARENESS: {
        awarenessProtocol.applyAwarenessUpdate(
          room.awareness,
          decoding.readVarUint8Array(dec),
          conn // origin so we don't echo back to sender
        );
        break;
      }
      default:
        // Unknown — ignore gracefully
        break;
    }
  } catch (e) {
    console.error(`[yjs] message handler error in ${room.mapId}:`, (e as any)?.message);
  }
}

/**
 * Public entry: wire a WebSocketServer to handle Yjs connections.
 *
 * URL pattern: ws://host/api/yjs?mapId=<id>
 */
export function attachYjsServer(wss: WebSocketServer): void {
  wss.on("connection", async (conn: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const mapId = url.searchParams.get("mapId");
    if (!mapId) {
      conn.close(1008, "mapId query param required");
      return;
    }

    // TODO (post-scaffold): authenticate the WebSocket handshake.
    // The current implementation trusts any connection — fine for local
    // dev and the proof-of-concept. Production requires NextAuth JWT
    // verification in `verifyClient` or via a token query param.

    const room = await getOrCreateRoom(mapId);
    await room.ready;
    room.conns.add(conn);

    // 1. Send sync step 1: ask the client what state it has.
    {
      const enc = encoding.createEncoder();
      encoding.writeVarUint(enc, MESSAGE_SYNC);
      syncProtocol.writeSyncStep1(enc, room.doc);
      conn.send(encoding.toUint8Array(enc));
    }

    // 2. Send current awareness state to the new client.
    const awarenessStates = room.awareness.getStates();
    if (awarenessStates.size > 0) {
      const enc = encoding.createEncoder();
      encoding.writeVarUint(enc, MESSAGE_AWARENESS);
      encoding.writeVarUint8Array(
        enc,
        awarenessProtocol.encodeAwarenessUpdate(
          room.awareness,
          Array.from(awarenessStates.keys())
        )
      );
      conn.send(encoding.toUint8Array(enc));
    }

    conn.on("message", (data: Buffer) => {
      handleMessage(room, conn, new Uint8Array(data));
    });

    const onClose = () => {
      room.conns.delete(conn);
      awarenessProtocol.removeAwarenessStates(
        room.awareness,
        Array.from(room.awareness.getStates().keys()).filter(
          (cid) => cid === room.doc.clientID || cid === (conn as any)._yClientId
        ),
        null
      );
      maybeEvictRoom(room);
    };
    conn.on("close", onClose);
    conn.on("error", onClose);
  });
}

/**
 * Inspection helper for debugging / tests. Returns a snapshot of room state
 * without exposing the underlying Y.Doc references.
 */
export function inspectRooms() {
  return Array.from(rooms.values()).map((r) => ({
    mapId: r.mapId,
    connections: r.conns.size,
    awarenessSize: r.awareness.getStates().size,
  }));
}
