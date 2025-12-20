import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { initialUsers } from "../../../../data/initialData";
import { prismaUserToDomain } from "../../../../lib/mapTransform";

const memoryUsers = [...initialUsers];

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const sessionPlan = (session as any)?.user?.plan ?? "free";
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (sessionPlan === "free") {
    return NextResponse.json({ error: "Admin access requires a paid plan." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { userId, plan } = body ?? {};

  if (!userId || !plan || !["free", "pro", "team"].includes(plan)) {
    return NextResponse.json({ error: "userId and a valid plan are required" }, { status: 400 });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId as string },
      data: { plan }
    });
    return NextResponse.json({ user: prismaUserToDomain(updated) });
  } catch (err) {
    console.error("Prisma admin user update failed, using fallback", err);
    const idx = memoryUsers.findIndex((u) => u.id === userId);
    if (idx === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    memoryUsers[idx] = { ...memoryUsers[idx], plan } as any;
    return NextResponse.json({ user: memoryUsers[idx] });
  }
}
