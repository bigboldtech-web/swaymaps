"use client";
import { useState, useEffect, useCallback, useRef } from "react";

interface PresenceUser {
  id: string;
  name: string;
  avatarUrl?: string;
  color?: string;
  cursorX?: number;
  cursorY?: number;
}

export function usePresence(mapId: string | null, enabled: boolean = true) {
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sendHeartbeat = useCallback(async (cursorX?: number, cursorY?: number) => {
    if (!mapId || !enabled) return;
    try {
      const res = await fetch(`/api/maps/${mapId}/presence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cursorX, cursorY }),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch {}
  }, [mapId, enabled]);

  useEffect(() => {
    if (!mapId || !enabled) { setUsers([]); return; }
    sendHeartbeat();
    intervalRef.current = setInterval(() => sendHeartbeat(), 10000); // every 10s
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [mapId, enabled, sendHeartbeat]);

  return { users, sendHeartbeat };
}
