export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  color?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cardIds: string[];
}

export interface KanbanState {
  columns: KanbanColumn[];
  cards: Record<string, KanbanCard>;
}

export const CARD_COLORS = [
  "#FFE082", "#A5D6A7", "#90CAF9", "#CE93D8", "#F48FB1", "#B0BEC5",
];

export function emptyKanbanState(): KanbanState {
  return {
    columns: [
      { id: "col-todo", title: "To do", cardIds: [] },
      { id: "col-doing", title: "In progress", cardIds: [] },
      { id: "col-done", title: "Done", cardIds: [] },
    ],
    cards: {},
  };
}
