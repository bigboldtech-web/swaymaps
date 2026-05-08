"use client";

import * as React from "react";
import { YjsProvider, defaultYjsUrl } from "@/lib/yjs/client";
import type { Awareness } from "y-protocols/awareness";
import type * as Y from "yjs";

export interface UseYjsDocResult {
  doc: Y.Doc | null;
  awareness: Awareness | null;
  status: "disconnected" | "connecting" | "connected";
}

/**
 * React hook for a per-map Yjs document with WebSocket sync.
 *
 * Usage:
 *   const { doc, awareness, status } = useYjsDoc({
 *     mapId,
 *     enabled: !!mapId && !shareMode,
 *     awarenessState: { name, color },
 *   });
 *
 * Returns null doc/awareness while disabled or before connection. Components
 * should guard their effects on `doc !== null`.
 */
export function useYjsDoc(opts: {
  mapId: string | null | undefined;
  enabled?: boolean;
  awarenessState?: Record<string, unknown>;
}): UseYjsDocResult {
  const { mapId, enabled = true, awarenessState } = opts;
  const [provider, setProvider] = React.useState<YjsProvider | null>(null);
  const [status, setStatus] = React.useState<"disconnected" | "connecting" | "connected">(
    "disconnected"
  );

  React.useEffect(() => {
    if (!enabled || !mapId) {
      setProvider(null);
      return;
    }
    const p = new YjsProvider({
      url: defaultYjsUrl(),
      mapId,
      awarenessState,
    });
    setProvider(p);
    const off = p.onStatus(setStatus);
    return () => {
      off();
      p.destroy();
      setProvider(null);
      setStatus("disconnected");
    };
    // We deliberately do NOT depend on awarenessState — changing presence
    // shouldn't reconnect the WebSocket. Use updateAwareness() helpers
    // for live presence updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapId, enabled]);

  return {
    doc: provider?.doc ?? null,
    awareness: provider?.awareness ?? null,
    status,
  };
}
