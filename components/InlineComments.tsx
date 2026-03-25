"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useTheme } from "./providers/ThemeProvider";
import type { MapNodeMeta, Note } from "../types/map";

interface InlineCommentsProps {
  open: boolean;
  onClose: () => void;
  nodes: MapNodeMeta[];
  notes: Note[];
  onAddComment: (noteId: string, text: string) => void;
  onNodeClick?: (nodeId: string) => void;
}

interface CommentThread {
  nodeId: string;
  nodeTitle: string;
  nodeKind: string;
  noteId: string;
  comments: {
    id: string;
    author?: string;
    text: string;
    createdAt: string;
  }[];
}

function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return iso;
  }
}

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const KIND_COLORS: Record<string, string> = {
  person: "bg-blue-500",
  system: "bg-emerald-500",
  process: "bg-amber-500",
  generic: "bg-slate-500",
  database: "bg-purple-500",
  api: "bg-cyan-500",
  queue: "bg-orange-500",
  cache: "bg-rose-500",
  cloud: "bg-sky-500",
  team: "bg-indigo-500",
  vendor: "bg-teal-500",
};

export function InlineComments({
  open,
  onClose,
  nodes,
  notes,
  onAddComment,
  onNodeClick,
}: InlineCommentsProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "has-comments">("all");
  const panelRef = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  // Build threads: group comments by node
  const threads = useMemo<CommentThread[]>(() => {
    const noteMap = new Map<string, Note>();
    for (const note of notes) {
      noteMap.set(note.id, note);
    }

    const result: CommentThread[] = [];
    for (const node of nodes) {
      const note = noteMap.get(node.noteId);
      if (!note) continue;

      const comments = note.comments ?? [];
      if (filter === "has-comments" && comments.length === 0) continue;

      result.push({
        nodeId: node.id,
        nodeTitle: node.title || "Untitled",
        nodeKind: node.kind,
        noteId: note.id,
        comments: [...comments].sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
      });
    }

    // Sort threads: those with comments first, then by most recent comment
    return result.sort((a, b) => {
      if (a.comments.length > 0 && b.comments.length === 0) return -1;
      if (a.comments.length === 0 && b.comments.length > 0) return 1;
      if (a.comments.length > 0 && b.comments.length > 0) {
        const aLatest = a.comments[a.comments.length - 1].createdAt;
        const bLatest = b.comments[b.comments.length - 1].createdAt;
        return new Date(bLatest).getTime() - new Date(aLatest).getTime();
      }
      return a.nodeTitle.localeCompare(b.nodeTitle);
    });
  }, [nodes, notes, filter]);

  const totalComments = useMemo(
    () => threads.reduce((sum, t) => sum + t.comments.length, 0),
    [threads]
  );

  // Focus the reply input when a thread is expanded
  useEffect(() => {
    if (expandedThread && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [expandedThread]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmitReply = (noteId: string) => {
    const text = (replyText[noteId] ?? "").trim();
    if (!text) return;
    onAddComment(noteId, text);
    setReplyText((prev) => ({ ...prev, [noteId]: "" }));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    noteId: string
  ) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmitReply(noteId);
    }
  };

  return (
    <div
      ref={panelRef}
      className={`fixed top-14 right-4 bottom-4 w-[380px] max-w-[calc(100vw-2rem)] z-[70] flex flex-col rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-200 animate-slide-in-right ${
        isLight
          ? "bg-white/95 border-slate-200/80"
          : "bg-slate-900/95 border-slate-700/60"
      }`}
      style={{ maxHeight: "calc(100vh - 4.5rem)" }}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b shrink-0 ${
          isLight ? "border-slate-200/80" : "border-slate-700/60"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <svg
            className={`w-5 h-5 ${isLight ? "text-slate-600" : "text-slate-300"}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
          <h2
            className={`text-sm font-semibold ${
              isLight ? "text-slate-800" : "text-slate-100"
            }`}
          >
            Comments
          </h2>
          {totalComments > 0 && (
            <span
              className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                isLight
                  ? "bg-blue-100 text-blue-700"
                  : "bg-blue-500/20 text-blue-300"
              }`}
            >
              {totalComments}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {/* Filter toggle */}
          <button
            onClick={() =>
              setFilter((f) => (f === "all" ? "has-comments" : "all"))
            }
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              filter === "has-comments"
                ? isLight
                  ? "bg-blue-100 text-blue-700"
                  : "bg-blue-500/20 text-blue-300"
                : isLight
                  ? "text-slate-500 hover:bg-slate-100"
                  : "text-slate-400 hover:bg-slate-800"
            }`}
            title={
              filter === "all"
                ? "Show only nodes with comments"
                : "Show all nodes"
            }
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
              />
            </svg>
          </button>
          {/* Close */}
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight
                ? "text-slate-500 hover:bg-slate-100"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5 scrollbar-thin">
        {threads.length === 0 && (
          <div
            className={`flex flex-col items-center justify-center py-16 px-4 text-center ${
              isLight ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <svg
              className="w-10 h-10 mb-3 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
            <p className="text-sm font-medium">No comments yet</p>
            <p className="text-xs mt-1 opacity-75">
              Click on a node thread below to start a conversation.
            </p>
          </div>
        )}

        {threads.map((thread) => {
          const isExpanded = expandedThread === thread.nodeId;
          const kindColor = KIND_COLORS[thread.nodeKind] ?? "bg-slate-500";
          const latestComment =
            thread.comments.length > 0
              ? thread.comments[thread.comments.length - 1]
              : null;

          return (
            <div
              key={thread.nodeId}
              className={`rounded-xl transition-colors ${
                isExpanded
                  ? isLight
                    ? "bg-slate-100/80"
                    : "bg-slate-800/60"
                  : isLight
                    ? "hover:bg-slate-50"
                    : "hover:bg-slate-800/40"
              }`}
            >
              {/* Thread header */}
              <button
                onClick={() =>
                  setExpandedThread(isExpanded ? null : thread.nodeId)
                }
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
              >
                {/* Node kind indicator */}
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${kindColor}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium truncate ${
                        isLight ? "text-slate-800" : "text-slate-100"
                      }`}
                    >
                      {thread.nodeTitle}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-medium px-1.5 py-0.5 rounded ${
                        isLight
                          ? "bg-slate-200/80 text-slate-500"
                          : "bg-slate-700/80 text-slate-400"
                      }`}
                    >
                      {thread.nodeKind}
                    </span>
                  </div>
                  {!isExpanded && latestComment && (
                    <p
                      className={`text-xs mt-0.5 truncate ${
                        isLight ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      <span className="font-medium">
                        {latestComment.author ?? "Anonymous"}:
                      </span>{" "}
                      {latestComment.text}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {thread.comments.length > 0 && (
                    <span
                      className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
                        isLight
                          ? "bg-slate-200/80 text-slate-600"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {thread.comments.length}
                    </span>
                  )}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    } ${isLight ? "text-slate-400" : "text-slate-500"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
              </button>

              {/* Expanded thread content */}
              {isExpanded && (
                <div className="px-3 pb-3">
                  {/* Navigate to node button */}
                  {onNodeClick && (
                    <button
                      onClick={() => onNodeClick(thread.nodeId)}
                      className={`flex items-center gap-1.5 text-xs mb-2.5 px-2 py-1 rounded-md transition-colors ${
                        isLight
                          ? "text-blue-600 hover:bg-blue-50"
                          : "text-blue-400 hover:bg-blue-500/10"
                      }`}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                      Focus on node
                    </button>
                  )}

                  {/* Comments list */}
                  {thread.comments.length > 0 ? (
                    <div className="space-y-2.5 mb-3">
                      {thread.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2.5">
                          {/* Avatar */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${kindColor}`}
                          >
                            {getInitials(comment.author)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                              <span
                                className={`text-xs font-semibold ${
                                  isLight
                                    ? "text-slate-700"
                                    : "text-slate-200"
                                }`}
                              >
                                {comment.author ?? "Anonymous"}
                              </span>
                              <span
                                className={`text-[10px] ${
                                  isLight
                                    ? "text-slate-400"
                                    : "text-slate-500"
                                }`}
                              >
                                {formatTimestamp(comment.createdAt)}
                              </span>
                            </div>
                            <p
                              className={`text-xs leading-relaxed mt-0.5 ${
                                isLight
                                  ? "text-slate-600"
                                  : "text-slate-300"
                              }`}
                            >
                              {comment.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p
                      className={`text-xs mb-3 ${
                        isLight ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      No comments on this node yet. Start the conversation below.
                    </p>
                  )}

                  {/* Reply input */}
                  <div
                    className={`flex gap-2 items-end rounded-lg border p-2 ${
                      isLight
                        ? "bg-white border-slate-200"
                        : "bg-slate-900/80 border-slate-700"
                    }`}
                  >
                    <textarea
                      ref={
                        expandedThread === thread.nodeId
                          ? replyInputRef
                          : undefined
                      }
                      value={replyText[thread.noteId] ?? ""}
                      onChange={(e) =>
                        setReplyText((prev) => ({
                          ...prev,
                          [thread.noteId]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => handleKeyDown(e, thread.noteId)}
                      placeholder="Add a comment..."
                      rows={1}
                      className={`flex-1 text-xs resize-none bg-transparent outline-none placeholder:text-slate-400 ${
                        isLight ? "text-slate-700" : "text-slate-200"
                      }`}
                      style={{ minHeight: "1.5rem", maxHeight: "4.5rem" }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height =
                          Math.min(target.scrollHeight, 72) + "px";
                      }}
                    />
                    <button
                      onClick={() => handleSubmitReply(thread.noteId)}
                      disabled={!(replyText[thread.noteId] ?? "").trim()}
                      className={`p-1.5 rounded-md transition-colors shrink-0 ${
                        (replyText[thread.noteId] ?? "").trim()
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : isLight
                            ? "bg-slate-100 text-slate-300"
                            : "bg-slate-800 text-slate-600"
                      }`}
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                        />
                      </svg>
                    </button>
                  </div>
                  <p
                    className={`text-[10px] mt-1 ${
                      isLight ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Press Cmd+Enter to send
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer with summary */}
      <div
        className={`px-4 py-2.5 border-t text-[11px] shrink-0 ${
          isLight
            ? "border-slate-200/80 text-slate-400"
            : "border-slate-700/60 text-slate-500"
        }`}
      >
        {threads.length} node{threads.length !== 1 ? "s" : ""} &middot;{" "}
        {totalComments} comment{totalComments !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
