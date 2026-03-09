"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface LiveSyncOptions {
  mapId: string | null;
  enabled: boolean;
  intervalMs?: number; // default 3000 (3 seconds)
  onRemoteUpdate: (data: { nodes: any[]; edges: any[]; notes: any[]; updatedAt: string }) => void;
}

/**
 * Polls for remote map changes and calls onRemoteUpdate when a newer version is detected.
 * Tracks the last known updatedAt to avoid reprocessing stale data.
 * Pauses polling while the user is actively editing (debounced by local save status).
 */
export function useLiveSync({ mapId, enabled, intervalMs = 3000, onRemoteUpdate }: LiveSyncOptions) {
  const lastUpdatedRef = useRef<string | null>(null);
  const isSavingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const setLocalUpdatedAt = useCallback((ts: string) => {
    lastUpdatedRef.current = ts;
  }, []);

  const setIsSaving = useCallback((saving: boolean) => {
    isSavingRef.current = saving;
  }, []);

  useEffect(() => {
    if (!mapId || !enabled) {
      lastUpdatedRef.current = null;
      return;
    }

    const poll = async () => {
      // Don't poll while saving to avoid conflicts
      if (isSavingRef.current) return;

      try {
        const res = await fetch(`/api/maps/${mapId}/sync`);
        if (!res.ok) return;
        const data = await res.json();

        // Only update if remote is newer than our last known state
        if (data.updatedAt && data.updatedAt !== lastUpdatedRef.current) {
          // If we have no reference point, just set it (initial load)
          if (!lastUpdatedRef.current) {
            lastUpdatedRef.current = data.updatedAt;
            return;
          }

          const remoteTime = new Date(data.updatedAt).getTime();
          const localTime = new Date(lastUpdatedRef.current).getTime();

          if (remoteTime > localTime) {
            lastUpdatedRef.current = data.updatedAt;
            onRemoteUpdate(data);
          }
        }
      } catch {
        // Silently ignore network errors during polling
      }
    };

    intervalRef.current = setInterval(poll, intervalMs);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mapId, enabled, intervalMs, onRemoteUpdate]);

  return { setLocalUpdatedAt, setIsSaving };
}
