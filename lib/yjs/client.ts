"use client";

/**
 * Browser-side Yjs WebSocket provider.
 *
 * A minimal y-websocket-compatible provider — handles sync (encoding 0)
 * and awareness (encoding 1) over a single WebSocket. We don't import
 * y-websocket itself because (a) it pulls in node polyfills, (b) we want
 * direct control of the URL and reconnect strategy.
 */

import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;

const RECONNECT_INITIAL_MS = 500;
const RECONNECT_MAX_MS = 30_000;

export interface YProviderOptions {
  /** WebSocket URL — e.g. ws://localhost:3000/api/yjs */
  url: string;
  /** Map id (sent as ?mapId=…) */
  mapId: string;
  /** Initial local awareness state (e.g. {name, color, cursor}). Optional. */
  awarenessState?: Record<string, unknown>;
}

type ProviderStatus = "disconnected" | "connecting" | "connected";

export class YjsProvider {
  readonly doc: Y.Doc;
  readonly awareness: Awareness;
  status: ProviderStatus = "disconnected";

  private ws: WebSocket | null = null;
  private url: string;
  private mapId: string;
  private destroyed = false;
  private reconnectMs = RECONNECT_INITIAL_MS;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners = new Set<(s: ProviderStatus) => void>();

  constructor(opts: YProviderOptions) {
    this.doc = new Y.Doc();
    this.awareness = new Awareness(this.doc);
    if (opts.awarenessState) this.awareness.setLocalState(opts.awarenessState);
    this.url = opts.url;
    this.mapId = opts.mapId;

    // Send doc updates to the server
    this.doc.on("update", (update: Uint8Array, origin: any) => {
      if (origin === this) return; // came from server, don't echo
      const enc = encoding.createEncoder();
      encoding.writeVarUint(enc, MESSAGE_SYNC);
      syncProtocol.writeUpdate(enc, update);
      this.send(encoding.toUint8Array(enc));
    });

    // Send awareness updates
    this.awareness.on(
      "update",
      (
        { added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
        origin: any
      ) => {
        if (origin === this) return;
        const changed = [...added, ...updated, ...removed];
        const enc = encoding.createEncoder();
        encoding.writeVarUint(enc, MESSAGE_AWARENESS);
        encoding.writeVarUint8Array(
          enc,
          awarenessProtocol.encodeAwarenessUpdate(this.awareness, changed)
        );
        this.send(encoding.toUint8Array(enc));
      }
    );

    this.connect();

    // Tell others we're leaving when the tab closes
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        try {
          awarenessProtocol.removeAwarenessStates(
            this.awareness,
            [this.doc.clientID],
            "window unload"
          );
        } catch {
          // ignore
        }
      });
    }
  }

  onStatus(fn: (s: ProviderStatus) => void): () => void {
    this.listeners.add(fn);
    fn(this.status);
    return () => this.listeners.delete(fn);
  }

  private setStatus(s: ProviderStatus) {
    if (this.status === s) return;
    this.status = s;
    for (const fn of this.listeners) fn(s);
  }

  private connect() {
    if (this.destroyed) return;
    this.setStatus("connecting");

    const u = `${this.url}?mapId=${encodeURIComponent(this.mapId)}`;
    let ws: WebSocket;
    try {
      ws = new WebSocket(u);
    } catch (e) {
      console.error("[yjs] websocket constructor failed:", e);
      this.scheduleReconnect();
      return;
    }
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      this.reconnectMs = RECONNECT_INITIAL_MS;
      this.setStatus("connected");
      // Server will send sync step 1; nothing to do here.
    };

    ws.onmessage = (ev: MessageEvent) => {
      const data = new Uint8Array(ev.data as ArrayBuffer);
      try {
        const dec = decoding.createDecoder(data);
        const messageType = decoding.readVarUint(dec);
        switch (messageType) {
          case MESSAGE_SYNC: {
            const enc = encoding.createEncoder();
            encoding.writeVarUint(enc, MESSAGE_SYNC);
            const syncMessageType = syncProtocol.readSyncMessage(
              dec,
              enc,
              this.doc,
              this // origin
            );
            if (
              encoding.length(enc) > 1 &&
              syncMessageType === syncProtocol.messageYjsSyncStep1
            ) {
              this.send(encoding.toUint8Array(enc));
            }
            break;
          }
          case MESSAGE_AWARENESS: {
            awarenessProtocol.applyAwarenessUpdate(
              this.awareness,
              decoding.readVarUint8Array(dec),
              this
            );
            break;
          }
        }
      } catch (e) {
        console.error("[yjs] client message error:", e);
      }
    };

    ws.onclose = () => {
      this.setStatus("disconnected");
      this.ws = null;
      this.scheduleReconnect();
    };

    ws.onerror = () => {
      // onclose follows; let it handle the reconnect
    };

    this.ws = ws;
  }

  private scheduleReconnect() {
    if (this.destroyed) return;
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectMs = Math.min(this.reconnectMs * 2, RECONNECT_MAX_MS);
      this.connect();
    }, this.reconnectMs);
  }

  private send(message: Uint8Array) {
    const ws = this.ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    try {
      ws.send(message);
    } catch (e) {
      console.error("[yjs] send failed:", e);
    }
  }

  destroy() {
    this.destroyed = true;
    this.listeners.clear();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    try {
      this.ws?.close();
    } catch {
      // ignore
    }
    this.ws = null;
    this.awareness.destroy();
    this.doc.destroy();
  }
}

/**
 * Compute the WebSocket URL relative to the current page. Override with
 * NEXT_PUBLIC_YJS_URL if running the sync server elsewhere.
 */
export function defaultYjsUrl(): string {
  if (process.env.NEXT_PUBLIC_YJS_URL) return process.env.NEXT_PUBLIC_YJS_URL;
  if (typeof window === "undefined") return "ws://localhost:3000/api/yjs";
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/api/yjs`;
}
