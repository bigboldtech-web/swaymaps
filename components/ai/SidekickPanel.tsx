"use client";

import * as React from "react";
import {
  Sparkles,
  Send,
  X,
  Wrench,
  Check,
  XCircle,
  Loader2,
  History,
  Plus,
  Trash2,
  Paperclip,
  Image as ImageIcon,
  FileText,
  StopCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/Tooltip";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

export type SidekickScope =
  | { kind: "map"; mapId: string }
  | { kind: "node"; mapId: string; nodeId: string; nodeTitle?: string }
  | { kind: "workspace"; workspaceId: string; workspaceName?: string };

export interface SidekickPanelProps {
  /** Back-compat: defaults to { kind: "map", mapId } when scope not provided. */
  mapId?: string;
  /** Scope-aware launcher. Takes precedence over mapId when provided. */
  scope?: SidekickScope;
  open: boolean;
  onClose: () => void;
  onMapMutated?: () => void;
  initialQuery?: string;
}

type AssistantBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input?: any; output?: any; isError?: boolean };

interface UIMessage {
  id: string;
  role: "USER" | "ASSISTANT";
  content: any[];
  createdAt?: string;
}

interface ConversationSummary {
  id: string;
  title: string | null;
  updatedAt: string;
  _count: { messages: number };
}

interface AttachmentMeta {
  id: string;
  kind: "IMAGE" | "PDF";
  filename: string | null;
  mediaType: string;
  sizeBytes: number;
}

const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function SidekickPanel({
  mapId: legacyMapId,
  scope: scopeProp,
  open,
  onClose,
  onMapMutated,
  initialQuery,
}: SidekickPanelProps) {
  const scope: SidekickScope = React.useMemo(() => {
    if (scopeProp) return scopeProp;
    if (legacyMapId) return { kind: "map", mapId: legacyMapId };
    return { kind: "map", mapId: "" };
  }, [scopeProp, legacyMapId]);

  const scopeKey = React.useMemo(() => {
    if (scope.kind === "map") return `map:${scope.mapId}`;
    if (scope.kind === "node") return `node:${scope.mapId}:${scope.nodeId}`;
    return `workspace:${scope.workspaceId}`;
  }, [scope]);

  const headerLabel = React.useMemo(() => {
    if (scope.kind === "node") return scope.nodeTitle ? `Node · ${scope.nodeTitle}` : "Node";
    if (scope.kind === "workspace") return scope.workspaceName ? `Workspace · ${scope.workspaceName}` : "Workspace";
    return "Sidekick";
  }, [scope]);

  const supportsAttachments = scope.kind === "map" || scope.kind === "node";
  const mapIdForUploads = scope.kind === "workspace" ? null : scope.mapId;
  const [messages, setMessages] = React.useState<UIMessage[]>([]);
  const [conversationId, setConversationId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [conversations, setConversations] = React.useState<ConversationSummary[]>([]);
  const [appliedToolUseIds, setAppliedToolUseIds] = React.useState<Set<string>>(new Set());
  const [pendingAttachments, setPendingAttachments] = React.useState<AttachmentMeta[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    if (open && initialQuery) {
      setInput(initialQuery);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialQuery]);

  // Switching scope (e.g. opening Sidekick on a different node) discards
  // the in-flight chat — a node-focused conversation isn't useful in
  // workspace mode and vice versa.
  React.useEffect(() => {
    if (!open) return;
    abortRef.current?.abort();
    setMessages([]);
    setConversationId(null);
    setPendingAttachments([]);
  }, [scopeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  React.useEffect(() => {
    if (!open || !showHistory) return;
    const params = new URLSearchParams();
    if (scope.kind === "workspace") params.set("workspaceId", scope.workspaceId);
    else if (scope.kind === "node") {
      params.set("mapId", scope.mapId);
      params.set("nodeId", scope.nodeId);
    } else {
      params.set("mapId", scope.mapId);
    }
    fetch(`/api/ai/sidekick/conversations?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : { conversations: [] }))
      .then((data) => setConversations(data.conversations ?? []))
      .catch(() => {});
  }, [open, showHistory, scopeKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cancel in-flight stream when panel closes
  React.useEffect(() => {
    if (!open) abortRef.current?.abort();
  }, [open]);

  const loadConversation = async (id: string) => {
    const res = await fetch(`/api/ai/sidekick/conversations/${id}`);
    if (!res.ok) {
      toast.error("Failed to load conversation");
      return;
    }
    const data = await res.json();
    setConversationId(data.id);
    setMessages(
      (data.messages ?? []).map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      }))
    );
    setShowHistory(false);
  };

  const startNew = () => {
    abortRef.current?.abort();
    setConversationId(null);
    setMessages([]);
    setShowHistory(false);
    setPendingAttachments([]);
    inputRef.current?.focus();
  };

  const deleteConversation = async (id: string) => {
    if (!confirm("Delete this conversation?")) return;
    const res = await fetch(`/api/ai/sidekick/conversations?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) startNew();
    }
  };

  const uploadFile = async (file: File) => {
    if (file.size === 0) {
      toast.error("Empty file");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error(`File too large (${Math.round(file.size / 1024)} KB). Max 5 MB.`);
      return;
    }
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImage && !isPdf) {
      toast.error(`Unsupported file: ${file.type || "unknown"}`);
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      if (!mapIdForUploads) {
        toast.error("Workspace-scoped chats don't support attachments yet.");
        setUploading(false);
        return;
      }
      fd.append("mapId", mapIdForUploads);
      fd.append("file", file);
      const res = await fetch("/api/ai/sidekick/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Upload failed");
        return;
      }
      const { attachment } = await res.json();
      setPendingAttachments((prev) => [...prev, attachment]);
    } finally {
      setUploading(false);
    }
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach(uploadFile);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(uploadFile);
  };

  const removeAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;

    setInput("");
    setBusy(true);
    const attachments = pendingAttachments.slice();
    setPendingAttachments([]);

    const userTempId = `user-local-${Date.now()}`;
    const userBlocks: any[] = [];
    for (const a of attachments) {
      userBlocks.push({
        type: a.kind === "IMAGE" ? "image_attachment" : "pdf_attachment",
        filename: a.filename,
        mediaType: a.mediaType,
      });
    }
    userBlocks.push({ type: "text", text });
    setMessages((prev) => [...prev, { id: userTempId, role: "USER", content: userBlocks }]);

    const asstTempId = `asst-local-${Date.now()}`;
    const asstBlocks: AssistantBlock[] = [];
    setMessages((prev) => [...prev, { id: asstTempId, role: "ASSISTANT", content: asstBlocks as any[] }]);

    const controller = new AbortController();
    abortRef.current = controller;

    let buf = "";
    const flush = () => {
      const events: any[] = [];
      let idx;
      while ((idx = buf.indexOf("\n\n")) >= 0) {
        const chunk = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            try {
              events.push(JSON.parse(line.slice(6)));
            } catch {
              // ignore malformed
            }
          }
        }
      }
      return events;
    };

    const handleEvent = (ev: any) => {
      switch (ev.type) {
        case "conversation":
          if (ev.conversationId) setConversationId(ev.conversationId);
          break;
        case "text_delta": {
          const last = asstBlocks[asstBlocks.length - 1];
          if (last && last.type === "text") {
            last.text += ev.text;
          } else {
            asstBlocks.push({ type: "text", text: ev.text });
          }
          setMessages((prev) =>
            prev.map((m) => (m.id === asstTempId ? { ...m, content: [...asstBlocks] } : m))
          );
          break;
        }
        case "tool_use_start": {
          asstBlocks.push({ type: "tool_use", id: ev.id, name: ev.name });
          setMessages((prev) =>
            prev.map((m) => (m.id === asstTempId ? { ...m, content: [...asstBlocks] } : m))
          );
          break;
        }
        case "tool_use_input": {
          for (const b of asstBlocks) {
            if (b.type === "tool_use" && b.id === ev.id) {
              b.input = ev.input;
              break;
            }
          }
          setMessages((prev) =>
            prev.map((m) => (m.id === asstTempId ? { ...m, content: [...asstBlocks] } : m))
          );
          break;
        }
        case "tool_use_result": {
          for (const b of asstBlocks) {
            if (b.type === "tool_use" && b.id === ev.id) {
              b.output = ev.output;
              b.isError = ev.isError;
              break;
            }
          }
          setMessages((prev) =>
            prev.map((m) => (m.id === asstTempId ? { ...m, content: [...asstBlocks] } : m))
          );
          break;
        }
        case "persisted":
          if (ev.assistantMessageId) {
            setMessages((prev) =>
              prev.map((m) => (m.id === asstTempId ? { ...m, id: ev.assistantMessageId } : m))
            );
          }
          break;
        case "error":
          if (ev.message !== "aborted") {
            toast.error(ev.message ?? "Sidekick error");
          }
          break;
      }
    };

    try {
      const scopePayload =
        scope.kind === "workspace"
          ? { kind: "workspace", workspaceId: scope.workspaceId }
          : scope.kind === "node"
          ? { kind: "node", mapId: scope.mapId, nodeId: scope.nodeId }
          : { kind: "map", mapId: scope.mapId };
      const res = await fetch("/api/ai/sidekick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: scopePayload,
          conversationId,
          message: text,
          attachmentIds: attachments.map((a) => a.id),
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "");
        toast.error(errText.slice(0, 200) || `HTTP ${res.status}`);
        setMessages((prev) => prev.filter((m) => m.id !== asstTempId));
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        for (const ev of flush()) handleEvent(ev);
      }
      buf += decoder.decode();
      for (const ev of flush()) handleEvent(ev);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        toast.error(e?.message ?? "Stream failed");
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  };

  const stop = () => {
    abortRef.current?.abort();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const acceptProposal = async (toolUseId: string, proposalInput: any) => {
    const res = await fetch("/api/ai/sidekick/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Apply targets the map the proposal originated on. Workspace-scope
        // proposals shouldn't normally happen (the agent works through map ids),
        // but if they do, the proposal carries the map id in its operations.
        mapId: scope.kind === "workspace" ? proposalInput.mapId ?? "" : scope.mapId,
        proposal: proposalInput,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error ?? "Failed to apply change");
      return;
    }
    const data = await res.json();
    setAppliedToolUseIds((prev) => new Set([...Array.from(prev), toolUseId]));
    const summary = data.summary ?? {};
    const parts: string[] = [];
    if (summary.added_nodes) parts.push(`+${summary.added_nodes} nodes`);
    if (summary.updated_nodes) parts.push(`${summary.updated_nodes} updated`);
    if (summary.removed_nodes) parts.push(`-${summary.removed_nodes} nodes`);
    if (summary.added_edges) parts.push(`+${summary.added_edges} edges`);
    if (summary.removed_edges) parts.push(`-${summary.removed_edges} edges`);
    toast.success(`Applied: ${parts.join(", ") || "no-op"}`);
    onMapMutated?.();
  };

  if (!open) return null;

  return (
    <aside
      className="fixed top-0 right-0 z-40 flex h-screen w-[400px] flex-col border-l border-border bg-bg shadow-overlay"
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("Files")) {
          e.preventDefault();
          setIsDragOver(true);
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setIsDragOver(false);
      }}
      onDrop={onDrop}
    >
      <header className="flex h-12 items-center justify-between border-b border-border px-3">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-fg truncate" title={headerLabel}>{headerLabel}</span>
          <Badge variant="indigo" size="sm">Beta</Badge>
        </div>
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="History" onClick={() => setShowHistory((v) => !v)}>
                <History className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>History</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="New" onClick={startNew}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New chat</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={onClose}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {showHistory && (
        <div className="border-b border-border bg-bg-subtle max-h-[35%] overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="p-4 text-xs text-fg-subtle text-center">No prior chats on this map.</p>
          ) : (
            <ul className="divide-y divide-border">
              {conversations.map((c) => (
                <li
                  key={c.id}
                  className="group flex items-center px-3 py-2 hover:bg-bg-muted cursor-pointer"
                  onClick={() => loadConversation(c.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-fg truncate">{c.title ?? "Untitled"}</div>
                    <div className="text-xs text-fg-subtle">
                      {c._count.messages} message{c._count.messages === 1 ? "" : "s"} ·{" "}
                      {new Date(c.updatedAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 p-1 text-fg-subtle hover:text-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(c.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="px-3 py-4 space-y-4 relative">
          {isDragOver && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md border-2 border-dashed border-accent bg-accent-subtle/80 m-2 pointer-events-none">
              <div className="text-center">
                <Paperclip className="h-5 w-5 text-accent mx-auto" />
                <p className="mt-2 text-sm font-medium text-accent">Drop image or PDF</p>
              </div>
            </div>
          )}
          {messages.length === 0 && !busy && (
            <Welcome scope={scope} onSuggest={(q) => { setInput(q); setTimeout(() => inputRef.current?.focus(), 0); }} />
          )}
          {messages.map((m) => (
            <MessageBlock
              key={m.id}
              message={m}
              appliedToolUseIds={appliedToolUseIds}
              onAccept={acceptProposal}
            />
          ))}
          {busy && (
            <div className="flex items-center gap-2 text-xs text-fg-muted">
              <Loader2 className="h-3 w-3 animate-spin" />
              Thinking…
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-2.5">
        {pendingAttachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {pendingAttachments.map((a) => (
              <span
                key={a.id}
                className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-panel px-2 h-7 text-xs text-fg max-w-[180px]"
              >
                {a.kind === "IMAGE" ? <ImageIcon className="h-3 w-3 shrink-0" /> : <FileText className="h-3 w-3 shrink-0" />}
                <span className="truncate flex-1">{a.filename ?? a.kind.toLowerCase()}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(a.id)}
                  className="text-fg-subtle hover:text-danger shrink-0"
                  aria-label="Remove attachment"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="rounded-md border border-border bg-panel focus-within:border-border-focus focus-within:ring-1 focus-within:ring-border-focus">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={busy}
            placeholder="Ask about this map…"
            rows={2}
            className="block w-full resize-none bg-transparent border-0 px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-0 max-h-40"
          />
          <div className="flex items-center justify-between px-1.5 pb-1.5">
            <div className="flex items-center gap-0.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,application/pdf"
                multiple
                hidden
                onChange={onPickFile}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Attach"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={busy || uploading || !supportsAttachments}
                  >
                    {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Paperclip className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Attach image or PDF</TooltipContent>
              </Tooltip>
              <span className="text-[10px] text-fg-subtle ml-1">↵ to send · ⇧↵ for newline</span>
            </div>
            {busy ? (
              <Button variant="outline" size="sm" onClick={stop} icon={<StopCircle />}>
                Stop
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={send} disabled={!input.trim()} icon={<Send />}>
                Send
              </Button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

function Welcome({ scope, onSuggest }: { scope: SidekickScope; onSuggest: (q: string) => void }) {
  const intro =
    scope.kind === "node"
      ? `Focused on this node. Ask about its blast radius, owners, status, or generate a runbook. Drop in an image or PDF and Sidekick will read it.`
      : scope.kind === "workspace"
      ? `Workspace-level. Ask about any map across your workspace. Sidekick searches, finds related nodes, and surfaces patterns across maps you can access.`
      : `Ask the Sidekick about this map. It searches nodes, traces dependencies, finds risks, generates runbooks, searches across your workspace, and proposes changes. Drop in an image or PDF and it'll read the diagram.`;
  const suggestions =
    scope.kind === "node"
      ? [
          "What's the blast radius if this node fails?",
          "Generate a runbook for this node.",
          "Who owns the upstream dependencies of this node?",
          "Are there other maps in the workspace that reference this?",
        ]
      : scope.kind === "workspace"
      ? [
          "Find auth-related nodes across all my maps.",
          "Which maps mention Stripe?",
          "What's the largest map in this workspace?",
          "Find services without an owner across the workspace.",
        ]
      : [
          "What are the most-connected nodes in this map?",
          "Which services have no owner?",
          "Find auth-related nodes across all my maps.",
          "Add a Redis cache between the API Gateway and User DB.",
        ];
  return (
    <div className="py-2">
      <p className="text-sm text-fg">{intro}</p>
      <div className="mt-3 flex flex-col gap-1.5">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSuggest(s)}
            className="rounded-sm border border-border bg-panel px-2.5 py-1.5 text-left text-xs text-fg-muted hover:bg-bg-muted hover:text-fg transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBlock({
  message,
  appliedToolUseIds,
  onAccept,
}: {
  message: UIMessage;
  appliedToolUseIds: Set<string>;
  onAccept: (toolUseId: string, proposal: any) => Promise<void>;
}) {
  const isUser = message.role === "USER";
  return (
    <div className={cn("flex flex-col gap-1.5", isUser ? "items-end" : "items-start")}>
      {message.content.map((block: any, idx: number) => {
        if (block.type === "text") {
          return (
            <div
              key={idx}
              className={cn(
                "max-w-[88%] rounded-md px-3 py-2 text-sm whitespace-pre-wrap",
                isUser ? "bg-fg text-fg-inverted" : "bg-bg-subtle text-fg border border-border"
              )}
            >
              {block.text}
            </div>
          );
        }
        if ((block.type === "image" || block.type === "image_attachment") && isUser) {
          return (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-panel px-2 h-7 text-xs text-fg-muted"
            >
              <ImageIcon className="h-3 w-3" />
              <span className="truncate max-w-[180px]">{block.filename ?? "image"}</span>
            </div>
          );
        }
        if ((block.type === "document" || block.type === "pdf_attachment") && isUser) {
          return (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-panel px-2 h-7 text-xs text-fg-muted"
            >
              <FileText className="h-3 w-3" />
              <span className="truncate max-w-[180px]">{block.filename ?? "PDF"}</span>
            </div>
          );
        }
        if (block.type === "tool_use" && !isUser) {
          const isProposal = block.name === "propose_change";
          const isApplied = appliedToolUseIds.has(block.id);
          if (isProposal && block.input) {
            return (
              <ProposalCard
                key={idx}
                toolUseId={block.id}
                proposal={block.input}
                applied={isApplied}
                onAccept={() => onAccept(block.id, block.input)}
              />
            );
          }
          return (
            <ToolCallChip
              key={idx}
              name={block.name}
              input={block.input}
              output={block.output}
              isError={block.isError}
            />
          );
        }
        return null;
      })}
    </div>
  );
}

function ToolCallChip({
  name,
  input,
  output,
  isError,
}: {
  name: string;
  input: any;
  output?: any;
  isError?: boolean;
}) {
  const summary = (() => {
    if (!input) return "running…";
    if (name === "find_dependencies") return `from ${input.node_id ?? "?"} (${input.direction ?? "both"})`;
    if (name === "find_path") return `${input.from_node_id ?? "?"} → ${input.to_node_id ?? "?"}`;
    if (name === "find_orphans") return input.criterion ?? "";
    if (name === "find_critical_nodes") return `top ${input.limit ?? 10}`;
    if (name === "search_nodes") return `"${input.query ?? ""}"`;
    if (name === "search_workspace_maps") return `workspace: "${input.query ?? ""}"`;
    if (name === "search_nodes_across_workspace") return `workspace nodes: "${input.query ?? ""}"`;
    if (name === "generate_runbook") return `${(input.node_ids?.length ?? 0)} node(s)`;
    return "";
  })();
  return (
    <div className={cn("inline-flex items-center gap-1.5 text-[11px]", isError ? "text-danger" : "text-fg-subtle")}>
      <Wrench className="h-3 w-3" />
      <span className="font-mono">{name}</span>
      {summary && <span className="opacity-70">· {summary}</span>}
      {output === undefined && !isError && <Loader2 className="h-3 w-3 animate-spin" />}
    </div>
  );
}

function ProposalCard({
  toolUseId,
  proposal,
  applied,
  onAccept,
}: {
  toolUseId: string;
  proposal: { summary?: string; rationale?: string; operations: any[] };
  applied: boolean;
  onAccept: () => Promise<void>;
}) {
  const [busy, setBusy] = React.useState(false);
  const [rejected, setRejected] = React.useState(false);

  const handleAccept = async () => {
    setBusy(true);
    try {
      await onAccept();
    } finally {
      setBusy(false);
    }
  };

  const counts = (() => {
    const c: Record<string, number> = {};
    for (const op of proposal.operations ?? []) c[op.op] = (c[op.op] ?? 0) + 1;
    return c;
  })();

  return (
    <div className="max-w-[92%] rounded-md border border-accent/30 bg-accent-subtle p-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        <span className="text-xs font-semibold uppercase tracking-wide text-accent">
          Proposed change
        </span>
      </div>
      {proposal.summary && (
        <p className="mt-1.5 text-sm font-medium text-fg">{proposal.summary}</p>
      )}
      {proposal.rationale && (
        <p className="mt-1 text-xs text-fg-muted leading-relaxed">{proposal.rationale}</p>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {Object.entries(counts).map(([op, n]) => (
          <Badge key={op} variant="default" size="sm">
            {op.replace("_", " ")}: {n}
          </Badge>
        ))}
      </div>
      <details className="mt-2 group">
        <summary className="text-xs text-fg-muted cursor-pointer hover:text-fg">
          View {proposal.operations.length} operation{proposal.operations.length === 1 ? "" : "s"}
        </summary>
        <ul className="mt-2 space-y-1 text-xs font-mono text-fg-muted bg-panel border border-border rounded-sm p-2 max-h-48 overflow-y-auto">
          {proposal.operations.map((op, i) => (
            <li key={i} className="break-all">
              <span className="text-accent">{op.op}</span>{" "}
              {Object.entries(op)
                .filter(([k]) => k !== "op")
                .map(([k, v]) => `${k}=${typeof v === "string" ? v : JSON.stringify(v)}`)
                .join(" ")}
            </li>
          ))}
        </ul>
      </details>
      <div className="mt-3 flex items-center gap-2">
        {applied ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
            <Check className="h-3.5 w-3.5" />
            Applied
          </span>
        ) : rejected ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-subtle">
            <XCircle className="h-3.5 w-3.5" />
            Discarded
          </span>
        ) : (
          <>
            <Button variant="primary" size="sm" loading={busy} icon={<Check />} onClick={handleAccept}>
              Apply
            </Button>
            <Button variant="ghost" size="sm" icon={<XCircle />} onClick={() => setRejected(true)}>
              Discard
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
