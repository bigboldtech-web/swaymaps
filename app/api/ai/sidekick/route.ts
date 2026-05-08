import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  streamSidekick,
  type SidekickEvent,
  type SidekickAttachment,
  type SidekickScope,
} from "@/lib/ai/sidekickStream";
import { requireMapPerm, FolderPermissionDeniedError } from "@/lib/folderPermissions";
import { logActivity } from "@/lib/activityLog";
import { userInWorkspace } from "@/lib/folderHelpers";
import type { MessageParam, ContentBlockParam } from "@anthropic-ai/sdk/resources/messages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/ai/sidekick — SSE stream.
 *
 * Body: {
 *   message,
 *   conversationId?,
 *   attachmentIds?: string[],
 *   scope: { kind: "map" | "node" | "workspace", mapId?, nodeId?, workspaceId? }
 * }
 *
 * Back-compat: if `mapId` is present at the top level (no `scope`), it's
 * treated as { kind: "map", mapId }. The Phase 5/6 client still works.
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Sidekick is not configured. Set ANTHROPIC_API_KEY." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { mapId: legacyMapId, conversationId, message, attachmentIds, scope: scopeInput } = body || {};
  if (typeof message !== "string" || !message.trim()) {
    return new Response(JSON.stringify({ error: "message required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ─── Resolve scope ────────────────────────────────────────
  let scope: SidekickScope;
  if (scopeInput?.kind === "node" && scopeInput.mapId && scopeInput.nodeId) {
    scope = { kind: "node", mapId: scopeInput.mapId, nodeId: scopeInput.nodeId };
  } else if (scopeInput?.kind === "workspace" && scopeInput.workspaceId) {
    scope = { kind: "workspace", workspaceId: scopeInput.workspaceId };
  } else if (scopeInput?.kind === "map" && scopeInput.mapId) {
    scope = { kind: "map", mapId: scopeInput.mapId };
  } else if (legacyMapId) {
    scope = { kind: "map", mapId: legacyMapId };
  } else {
    return new Response(JSON.stringify({ error: "scope (map/node/workspace) required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ─── Authorize ────────────────────────────────────────────
  let workspaceId: string | null = null;
  if (scope.kind === "map" || scope.kind === "node") {
    try {
      await requireMapPerm(userId, scope.mapId, "VIEW");
    } catch (e) {
      if (e instanceof FolderPermissionDeniedError) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
      throw e;
    }
    const map = await prisma.decodeMap.findUnique({
      where: { id: scope.mapId },
      select: { workspaceId: true },
    });
    workspaceId = map?.workspaceId ?? null;
  } else {
    const ok = await userInWorkspace(userId, scope.workspaceId);
    if (!ok) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
    workspaceId = scope.workspaceId;
  }

  // ─── Resolve / create conversation (scope-aware) ─────────
  const convScopeKind = scope.kind.toUpperCase(); // "MAP" | "NODE" | "WORKSPACE"
  let conv = conversationId
    ? await prisma.sidekickConversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      })
    : null;
  // Reject reused conversations that don't match the current scope
  const isMatchingConv = (() => {
    if (!conv || conv.userId !== userId) return false;
    if (conv.scopeKind !== convScopeKind) return false;
    if (scope.kind === "map") return conv.mapId === scope.mapId;
    if (scope.kind === "node") return conv.mapId === scope.mapId && conv.focusNodeId === scope.nodeId;
    return conv.workspaceId === scope.workspaceId;
  })();
  if (!isMatchingConv) {
    conv = await prisma.sidekickConversation.create({
      data: {
        scopeKind: convScopeKind,
        mapId: scope.kind === "workspace" ? null : scope.mapId,
        focusNodeId: scope.kind === "node" ? scope.nodeId : null,
        workspaceId: scope.kind === "workspace" ? scope.workspaceId : workspaceId,
        userId,
        title: message.trim().slice(0, 80),
      },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
  }
  if (!conv) {
    return new Response(JSON.stringify({ error: "Failed to create conversation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  const conversation = conv;

  // ─── History ──────────────────────────────────────────────
  const history: MessageParam[] = [];
  for (const m of conversation.messages) {
    try {
      const content = JSON.parse(m.content);
      history.push({
        role: m.role === "USER" ? "user" : "assistant",
        content,
      });
    } catch {
      // skip
    }
  }

  // ─── Attachments (scoped to map for now; not supported on workspace scope) ─
  const attachments: SidekickAttachment[] = [];
  if (Array.isArray(attachmentIds) && attachmentIds.length > 0 && (scope.kind === "map" || scope.kind === "node")) {
    const rows = await prisma.sidekickAttachment.findMany({
      where: { id: { in: attachmentIds }, userId, mapId: scope.mapId },
    });
    for (const a of rows) {
      attachments.push({
        kind: a.kind === "PDF" ? "pdf" : "image",
        data: a.data,
        mediaType: a.mediaType,
        filename: a.filename ?? undefined,
      });
    }
  }

  // ─── Persist user turn up-front ───────────────────────────
  const userContent: ContentBlockParam[] = [];
  for (const att of attachments) {
    if (att.kind === "image") {
      userContent.push({
        type: "image",
        source: { type: "base64", media_type: att.mediaType as any, data: att.data },
      } as ContentBlockParam);
    } else if (att.kind === "pdf") {
      userContent.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: att.data },
      } as ContentBlockParam);
    }
  }
  userContent.push({ type: "text", text: message });

  const userMsgRow = await prisma.sidekickMessage.create({
    data: {
      conversationId: conversation.id,
      role: "USER",
      content: JSON.stringify(userContent),
    },
  });

  // ─── SSE stream ───────────────────────────────────────────
  const encoder = new TextEncoder();
  const abortController = new AbortController();
  req.signal.addEventListener?.("abort", () => abortController.abort());

  const stream = new ReadableStream({
    async start(controller) {
      const send = (ev: any) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(ev)}\n\n`));
        } catch {
          // controller closed
        }
      };

      send({
        type: "conversation",
        conversationId: conversation.id,
        userMessageId: userMsgRow.id,
      });

      let finalContent: ContentBlockParam[] = [];
      let usage = {
        input_tokens: 0,
        output_tokens: 0,
        cache_creation_input_tokens: 0,
        cache_read_input_tokens: 0,
      };
      let stopReason: string | null = null;
      let errored = false;

      try {
        for await (const ev of streamSidekick({
          scope,
          userId,
          workspaceId,
          history,
          userMessage: message,
          attachments,
          signal: abortController.signal,
        })) {
          send(ev);
          if ((ev as SidekickEvent).type === "done") {
            const d = ev as Extract<SidekickEvent, { type: "done" }>;
            finalContent = d.assistantContent;
            usage = d.usage;
            stopReason = d.stopReason;
          } else if ((ev as SidekickEvent).type === "error") {
            errored = true;
          }
        }
      } catch (e: any) {
        errored = true;
        send({ type: "error", message: e?.message ?? "Sidekick failed" });
      }

      if (!errored && finalContent.length > 0) {
        try {
          const asst = await prisma.sidekickMessage.create({
            data: {
              conversationId: conversation.id,
              role: "ASSISTANT",
              content: JSON.stringify(finalContent),
              usage: JSON.stringify(usage),
            },
          });
          await prisma.sidekickConversation.update({
            where: { id: conversation.id },
            data: { updatedAt: new Date() },
          });
          send({
            type: "persisted",
            assistantMessageId: asst.id,
            stopReason,
          });

          if (workspaceId) {
            await logActivity({
              workspaceId,
              userId,
              action: "map.updated",
              entityType: "sidekick_message",
              entityId: asst.id,
              metadata: {
                scope: scope.kind,
                mapId: scope.kind === "workspace" ? null : scope.mapId,
                nodeId: scope.kind === "node" ? scope.nodeId : undefined,
                conversationId: conversation.id,
                usage,
                streamed: true,
              },
            }).catch(() => {});
          }
        } catch (e: any) {
          send({ type: "error", message: "Persistence failed: " + (e?.message ?? "unknown") });
        }
      }

      controller.close();
    },
    cancel() {
      abortController.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
