import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { plan } = body ?? {};
  if (!plan || !["free", "pro", "team"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId as string },
    data: { plan }
  });

  return NextResponse.json({ ok: true, plan: updated.plan });
}
