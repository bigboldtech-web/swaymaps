import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/ai/sidekick/status
 * Returns whether the Sidekick is configured to run. The actual key value is
 * never returned. Used by the panel to render a clear "not configured" state
 * instead of letting the user type a question and hit a 503.
 */
export function GET() {
  const configured = !!process.env.ANTHROPIC_API_KEY;
  return NextResponse.json({ configured });
}
