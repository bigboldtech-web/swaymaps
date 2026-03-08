import { getServerSession } from "next-auth";
import { authOptions } from "../app/lib/auth";

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return (session as any)?.user?.isAdmin === true;
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error("Forbidden: Admin access required");
  }
}
