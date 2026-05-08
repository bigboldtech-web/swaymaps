import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/lib/prisma";
import { applyProposal } from "@/lib/ai/sidekick";
import { requireMapPerm, FolderPermissionDeniedError } from "@/lib/folderPermissions";
import { logActivity } from "@/lib/activityLog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/ai/sidekick/apply
 * Body: { mapId, proposal: { summary, operations: [...] } }
 *
 * Applies a previously-proposed change to the map. Requires EDIT permission.
 * The proposal payload should be the verbatim tool_result.input from a
 * propose_change tool_use block — the UI passes it back when the user accepts.
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { mapId, proposal } = body || {};
  if (!mapId || !proposal?.operations?.length) {
    return NextResponse.json({ error: "mapId and proposal.operations required" }, { status: 400 });
  }

  try {
    await requireMapPerm(userId, mapId, "EDIT");
  } catch (e) {
    if (e instanceof FolderPermissionDeniedError)
      return NextResponse.json({ error: "Forbidden — EDIT required" }, { status: 403 });
    throw e;
  }

  let summary;
  try {
    summary = await applyProposal(mapId, proposal);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Apply failed" },
      { status: 400 }
    );
  }

  const map = await prisma.decodeMap.findUnique({
    where: { id: mapId },
    select: { workspaceId: true },
  });
  if (map?.workspaceId) {
    await logActivity({
      workspaceId: map.workspaceId,
      userId,
      action: "map.updated",
      entityType: "sidekick_apply",
      entityId: mapId,
      metadata: { ...summary, proposalSummary: proposal.summary },
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, summary });
}
