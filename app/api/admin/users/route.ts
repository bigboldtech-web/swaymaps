import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { initialUsers } from "../../../../data/initialData";
import { prismaUserToDomain } from "../../../../lib/mapTransform";
import { isAdmin } from "../../../../lib/adminCheck";

const memoryUsers = [...initialUsers];

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminUser = await isAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const { userId, plan, isAdmin: setAdmin } = body ?? {};

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // Build update data
  const updateData: any = {};
  if (plan && ["free", "pro", "team"].includes(plan)) {
    updateData.plan = plan;
  }
  if (typeof setAdmin === "boolean") {
    // Prevent removing your own admin access
    const currentUserId = (session.user as any)?.id;
    if (userId === currentUserId && setAdmin === false) {
      return NextResponse.json({ error: "Cannot remove your own admin access" }, { status: 400 });
    }
    updateData.isAdmin = setAdmin;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId as string },
      data: updateData
    });
    return NextResponse.json({
      user: {
        ...prismaUserToDomain(updated),
        isAdmin: (updated as any).isAdmin ?? false,
      }
    });
  } catch (err) {
    console.error("Prisma admin user update failed, using fallback", err);
    const idx = memoryUsers.findIndex((u) => u.id === userId);
    if (idx === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    memoryUsers[idx] = { ...memoryUsers[idx], ...updateData } as any;
    return NextResponse.json({ user: memoryUsers[idx] });
  }
}
