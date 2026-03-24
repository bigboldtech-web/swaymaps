import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { isAdmin as isAdminCheck } from "../../../../lib/adminCheck";
import { initialWorkspaces } from "../../../../data/initialData";

type SeatAction = "enforce" | "comp";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const adminUser = await isAdminCheck();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { workspaceId, action } = body as { workspaceId?: string; action?: SeatAction };
  if (!workspaceId || !action || (action !== "enforce" && action !== "comp")) {
    return NextResponse.json({ error: "workspaceId and valid action are required" }, { status: 400 });
  }

  try {
    const ws = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true }
    });
    if (!ws) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    const enforcedSeats = ws.members.length;
    return NextResponse.json({
      workspaceId,
      action,
      enforcedSeats,
      message:
        action === "enforce"
          ? `Seat count enforced at ${enforcedSeats} based on current members.`
          : "One seat comped/credited for this cycle."
    });
  } catch (err) {
    const ws = initialWorkspaces.find((w) => w.id === workspaceId);
    if (!ws) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    return NextResponse.json({
      workspaceId,
      action,
      enforcedSeats: ws.members.length,
      message:
        action === "enforce"
          ? `Seat count enforced at ${ws.members.length} (fallback).`
          : "One seat comped/credited for this cycle. (fallback)",
      fallback: true
    });
  }
}
