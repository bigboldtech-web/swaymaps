import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { prismaUserToDomain } from "../../../lib/mapTransform";
import { initialUsers } from "../../../data/initialData";

const memoryUsers = [...initialUsers];

export async function GET() {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(users.map(prismaUserToDomain));
  } catch (err) {
    console.error("Prisma users GET failed, using fallback", err);
    return NextResponse.json(memoryUsers);
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { name, color } = body ?? {};
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  try {
    const user = await prisma.user.create({
      data: { name, color: color ?? null }
    });
    return NextResponse.json(prismaUserToDomain(user));
  } catch (err) {
    console.error("Prisma users POST failed, using fallback", err);
    const user = {
      id: `user-${Date.now()}`,
      name,
      color: color ?? null
    };
    memoryUsers.push(user as any);
    return NextResponse.json(user);
  }
}
