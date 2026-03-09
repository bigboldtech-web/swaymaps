import { useEffect } from "react";

interface KeyboardShortcutHandlers {
  onUndo: () => void;
  onRedo: () => void;
  onAddNode: () => void;
  onDeleteSelected: () => void;
  onDuplicateNode: () => void;
  onToggleSearch: () => void;
  onClearSelection: () => void;
  onCloseContextMenu: () => void;
  onCommandPalette?: () => void;
  onShortcutsHelp?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isEditable =
        tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable;

      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key === "k") {
        e.preventDefault();
        handlers.onCommandPalette?.();
        return;
      }
      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handlers.onUndo();
        return;
      }
      if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        handlers.onRedo();
        return;
      }
      if (mod && e.key === "f") {
        e.preventDefault();
        handlers.onToggleSearch();
        return;
      }
      if (mod && e.key === "d" && !isEditable) {
        e.preventDefault();
        handlers.onDuplicateNode();
        return;
      }

      if (isEditable) return;

      if (e.key === "?" && !mod) {
        e.preventDefault();
        handlers.onShortcutsHelp?.();
        return;
      }
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        handlers.onAddNode();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        handlers.onDeleteSelected();
        return;
      }
      if (e.key === "Escape") {
        handlers.onClearSelection();
        handlers.onCloseContextMenu();
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlers]);
}
