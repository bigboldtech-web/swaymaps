import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route top-level domain (e.g., swaymaps.com) to the marketing landing page.
// Keep app subdomain (e.g., app.swaymaps.com) on the product experience.
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const url = req.nextUrl.clone();

  const isTopDomain = host === "swaymaps.com" || host === "www.swaymaps.com";
  const isAppDomain = host === "app.swaymaps.com";

  // If we are on the marketing domain and not already on /landing, send to /landing.
  if (isTopDomain && url.pathname === "/") {
    url.pathname = "/landing";
    return NextResponse.rewrite(url);
  }

  // Keep everything else as-is (app domain, API routes, landing deep links, etc.).
  return NextResponse.next();
}

// Run middleware for all paths; minimal logic above decides rewrites.
export const config = {
  matcher: "/:path*"
};
