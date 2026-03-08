import { useCallback, useRef } from "react";

export interface UndoRedoSnapshot {
  nodes: any[];
  edges: any[];
}

export function useUndoRedo(maxHistory = 50) {
  const past = useRef<UndoRedoSnapshot[]>([]);
  const future = useRef<UndoRedoSnapshot[]>([]);
  const lastPush = useRef<number>(0);

  const pushSnapshot = useCallback(
    (snapshot: UndoRedoSnapshot) => {
      // Throttle pushes to avoid flooding history on every tiny change
      const now = Date.now();
      if (now - lastPush.current < 300) return;
      lastPush.current = now;

      past.current = [...past.current.slice(-(maxHistory - 1)), snapshot];
      future.current = [];
    },
    [maxHistory]
  );

  const undo = useCallback(
    (
      currentSnapshot: UndoRedoSnapshot,
      apply: (snapshot: UndoRedoSnapshot) => void
    ) => {
      if (past.current.length === 0) return;
      const prev = past.current[past.current.length - 1];
      past.current = past.current.slice(0, -1);
      future.current = [...future.current, currentSnapshot];
      apply(prev);
    },
    []
  );

  const redo = useCallback(
    (
      currentSnapshot: UndoRedoSnapshot,
      apply: (snapshot: UndoRedoSnapshot) => void
    ) => {
      if (future.current.length === 0) return;
      const next = future.current[future.current.length - 1];
      future.current = future.current.slice(0, -1);
      past.current = [...past.current, currentSnapshot];
      apply(next);
    },
    []
  );

  const canUndo = useCallback(() => past.current.length > 0, []);
  const canRedo = useCallback(() => future.current.length > 0, []);

  return { pushSnapshot, undo, redo, canUndo, canRedo };
}
