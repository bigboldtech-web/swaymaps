"use client";

import * as React from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  closestCorners,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ArrowLeft, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { type KanbanState, type KanbanCard, type KanbanColumn, emptyKanbanState, CARD_COLORS } from "./types";

interface KanbanEditorProps {
  mapId: string;
  initialName: string;
  initialState: KanbanState | null;
  onBack?: () => void;
}

const cuid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export function KanbanEditor({ mapId, initialName, initialState, onBack }: KanbanEditorProps) {
  const [name, setName] = React.useState(initialName);
  const [state, setState] = React.useState<KanbanState>(
    initialState && initialState.columns ? initialState : emptyKanbanState()
  );
  const [saving, setSaving] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => save(), 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, dirty]);

  const save = React.useCallback(async () => {
    setSaving(true);
    try {
      await fetch(`/api/maps/${mapId}/canvas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });
      setDirty(false);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [mapId, state]);

  const renameMap = async (newName: string) => {
    setName(newName);
    await fetch(`/api/maps/${mapId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
  };

  const addCard = (columnId: string) => {
    const id = cuid();
    const newCard: KanbanCard = { id, title: "New card", color: CARD_COLORS[0] };
    setState((s) => ({
      cards: { ...s.cards, [id]: newCard },
      columns: s.columns.map((c) =>
        c.id === columnId ? { ...c, cardIds: [...c.cardIds, id] } : c
      ),
    }));
    setDirty(true);
  };

  const updateCard = (id: string, patch: Partial<KanbanCard>) => {
    setState((s) => ({ ...s, cards: { ...s.cards, [id]: { ...s.cards[id], ...patch } } }));
    setDirty(true);
  };

  const deleteCard = (id: string) => {
    setState((s) => {
      const { [id]: _, ...rest } = s.cards;
      return {
        cards: rest,
        columns: s.columns.map((c) => ({
          ...c,
          cardIds: c.cardIds.filter((x) => x !== id),
        })),
      };
    });
    setDirty(true);
  };

  const addColumn = () => {
    const id = cuid();
    setState((s) => ({
      ...s,
      columns: [...s.columns, { id, title: "New column", cardIds: [] }],
    }));
    setDirty(true);
  };

  const updateColumn = (id: string, patch: Partial<KanbanColumn>) => {
    setState((s) => ({
      ...s,
      columns: s.columns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
    setDirty(true);
  };

  const deleteColumn = (id: string) => {
    if (!window.confirm("Delete this column? Cards inside will be discarded.")) return;
    setState((s) => {
      const col = s.columns.find((c) => c.id === id);
      const rest = { ...s.cards };
      col?.cardIds.forEach((cid) => delete rest[cid]);
      return {
        cards: rest,
        columns: s.columns.filter((c) => c.id !== id),
      };
    });
    setDirty(true);
  };

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragEnd = (e: DragEndEvent) => {
    const cardId = String(e.active.id);
    const overId = e.over?.id ? String(e.over.id) : null;
    if (!overId) return;

    setState((s) => {
      const fromCol = s.columns.find((c) => c.cardIds.includes(cardId));
      if (!fromCol) return s;

      // Drop on a column → append; drop on a card → insert before
      let toCol = s.columns.find((c) => c.id === overId);
      let insertIndex: number | null = null;
      if (!toCol) {
        toCol = s.columns.find((c) => c.cardIds.includes(overId));
        if (toCol) insertIndex = toCol.cardIds.indexOf(overId);
      }
      if (!toCol) return s;

      if (toCol.id === fromCol.id) {
        // Reorder within column
        const ids = fromCol.cardIds.filter((x) => x !== cardId);
        const at = insertIndex ?? ids.length;
        ids.splice(at, 0, cardId);
        return {
          ...s,
          columns: s.columns.map((c) => (c.id === fromCol.id ? { ...c, cardIds: ids } : c)),
        };
      }
      // Move across columns
      const fromIds = fromCol.cardIds.filter((x) => x !== cardId);
      const toIds = [...toCol.cardIds];
      toIds.splice(insertIndex ?? toIds.length, 0, cardId);
      return {
        ...s,
        columns: s.columns.map((c) => {
          if (c.id === fromCol.id) return { ...c, cardIds: fromIds };
          if (c.id === toCol!.id) return { ...c, cardIds: toIds };
          return c;
        }),
      };
    });
    setDirty(true);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-bg-subtle text-fg">
      <header className="flex h-12 items-center justify-between border-b border-border bg-bg px-3">
        <div className="flex items-center gap-2 min-w-0">
          {onBack && (
            <Button variant="ghost" size="icon-sm" aria-label="Back" onClick={onBack}>
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          )}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v && v !== initialName) renameMap(v);
            }}
            className="bg-transparent border-0 text-sm font-medium text-fg focus:outline-none focus:ring-0 w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          {saving ? (
            <span className="text-xs text-fg-muted inline-flex items-center gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving…
            </span>
          ) : dirty ? (
            <span className="text-xs text-fg-muted">Unsaved</span>
          ) : (
            <span className="text-xs text-fg-subtle">Saved</span>
          )}
          <Button variant="outline" size="sm" icon={<Save />} onClick={save}>
            Save
          </Button>
        </div>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
          <div className="flex h-full gap-3 items-start">
            {state.columns.map((col) => (
              <Column
                key={col.id}
                column={col}
                cards={col.cardIds.map((id) => state.cards[id]).filter(Boolean)}
                onAddCard={() => addCard(col.id)}
                onUpdateColumn={(patch) => updateColumn(col.id, patch)}
                onDeleteColumn={() => deleteColumn(col.id)}
                onUpdateCard={updateCard}
                onDeleteCard={deleteCard}
              />
            ))}
            <Button
              variant="outline"
              size="md"
              icon={<Plus />}
              onClick={addColumn}
              className="shrink-0 mt-1"
            >
              Add column
            </Button>
          </div>
        </div>
      </DndContext>
    </div>
  );
}

function Column({
  column,
  cards,
  onAddCard,
  onUpdateColumn,
  onDeleteColumn,
  onUpdateCard,
  onDeleteCard,
}: {
  column: KanbanColumn;
  cards: KanbanCard[];
  onAddCard: () => void;
  onUpdateColumn: (patch: Partial<KanbanColumn>) => void;
  onDeleteColumn: () => void;
  onUpdateCard: (id: string, patch: Partial<KanbanCard>) => void;
  onDeleteCard: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "shrink-0 w-[280px] flex flex-col rounded-md border border-border bg-bg",
        isOver && "ring-1 ring-accent"
      )}
    >
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <input
          value={column.title}
          onChange={(e) => onUpdateColumn({ title: e.target.value })}
          className="flex-1 min-w-0 bg-transparent border-0 text-sm font-semibold text-fg focus:outline-none focus:ring-0"
        />
        <span className="text-xs text-fg-subtle tabular-nums">{cards.length}</span>
        <Button variant="ghost" size="icon-sm" aria-label="Delete column" onClick={onDeleteColumn}>
          <X className="h-3 w-3 text-fg-subtle" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onUpdate={(patch) => onUpdateCard(card.id, patch)}
            onDelete={() => onDeleteCard(card.id)}
          />
        ))}
      </div>
      <div className="p-2 border-t border-border">
        <Button variant="ghost" size="sm" icon={<Plus />} onClick={onAddCard} className="w-full justify-start">
          Add card
        </Button>
      </div>
    </div>
  );
}

function Card({
  card,
  onUpdate,
  onDelete,
}: {
  card: KanbanCard;
  onUpdate: (patch: Partial<KanbanCard>) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: card.id });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative rounded-sm border border-border bg-panel p-2.5 cursor-grab active:cursor-grabbing",
        isDragging && "opacity-40"
      )}
      style={{
        borderLeft: `3px solid ${card.color ?? "var(--color-fg-subtle)"}`,
      }}
    >
      <input
        value={card.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
        onPointerDown={(e) => e.stopPropagation()}
        className="w-full bg-transparent border-0 text-sm font-medium text-fg focus:outline-none focus:ring-0"
        placeholder="Card title"
      />
      <textarea
        value={card.description ?? ""}
        onChange={(e) => onUpdate({ description: e.target.value })}
        onPointerDown={(e) => e.stopPropagation()}
        rows={2}
        placeholder=""
        className="mt-1 w-full bg-transparent border-0 text-xs text-fg-muted focus:outline-none focus:ring-0 resize-none"
      />
      <div className="mt-2 flex items-center gap-1">
        {CARD_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onUpdate({ color: c })}
            className={cn(
              "h-3 w-3 rounded-full border border-border transition-transform",
              card.color === c && "scale-125 ring-1 ring-fg"
            )}
            style={{ background: c }}
            aria-label={`Color ${c}`}
          />
        ))}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onDelete}
          className="ml-auto opacity-0 group-hover:opacity-100 text-fg-subtle hover:text-danger transition-opacity"
          aria-label="Delete"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
