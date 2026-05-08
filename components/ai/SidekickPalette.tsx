"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { Sparkles, ArrowRight } from "lucide-react";

const SUGGESTIONS = [
  "What are the most-connected nodes?",
  "Which nodes have no owner?",
  "What's downstream of …?",
  "Generate a runbook for …",
  "Find the path between …",
];

interface SidekickPaletteProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (query: string) => void;
}

/**
 * Linear/Raycast-style command palette. User types or picks a suggestion;
 * the parent opens the SidekickPanel pre-loaded with the question.
 */
export function SidekickPalette({ open, onClose, onSubmit }: SidekickPaletteProps) {
  const [value, setValue] = React.useState("");
  const [highlight, setHighlight] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setValue("");
    setHighlight(0);
    setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  const submit = (q: string) => {
    const text = q.trim();
    if (!text) return;
    onSubmit(text);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Empty input + Enter → use highlighted suggestion. Non-empty → send as-is.
      if (value.trim()) submit(value);
      else submit(SUGGESTIONS[highlight]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % SUGGESTIONS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + SUGGESTIONS.length) % SUGGESTIONS.length);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-xl p-0 overflow-hidden" showClose={false}>
        <DialogTitle className="sr-only">Ask the Sidekick</DialogTitle>
        <DialogDescription className="sr-only">
          Ask a question about the current map. The Sidekick reasons over the graph and answers.
        </DialogDescription>
        <div className="flex items-center gap-2 px-3 h-12 border-b border-border">
          <Sparkles className="h-4 w-4 text-accent shrink-0" />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about this map…"
            className="flex-1 bg-transparent border-0 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-0"
          />
          <span className="text-[10px] text-fg-subtle">↵ to send</span>
        </div>
        <ul className="py-1">
          {SUGGESTIONS.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                onMouseEnter={() => setHighlight(i)}
                onClick={() => submit(s)}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm text-fg ${
                  highlight === i && !value.trim() ? "bg-bg-muted" : "hover:bg-bg-muted"
                }`}
              >
                <span>{s}</span>
                <ArrowRight className="h-3.5 w-3.5 text-fg-subtle" />
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
