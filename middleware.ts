import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes that never need auth
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/landing") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/embed") ||
    pathname.startsWith("/invite") ||
    pathname.startsWith("/legal") ||
    pathname.startsWith("/features") ||
    pathname.startsWith("/use-cases") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/templates-gallery") ||
    pathname.startsWith("/docs") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/changelog") ||
    pathname.startsWith("/trust") ||
    pathname.startsWith("/security") ||
    pathname.startsWith("/roadmap") ||
    pathname.startsWith("/integrations") ||
    pathname.startsWith("/customers") ||
    pathname.startsWith("/compare") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/manifest.json";

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes (e.g., /app, /admin) require authentication
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });

  if (!token) {
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = "/auth/signin";
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Admin-only routes
  if (pathname.startsWith("/admin") && !token.isAdmin) {
    const homeUrl = req.nextUrl.clone();
    homeUrl.pathname = "/app";
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$|.*\\.ico$|.*\\.webp$).*)"]
};
