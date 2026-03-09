import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { type, webhookUrl } = body ?? {};

  if (!type || !webhookUrl) return NextResponse.json({ error: "type and webhookUrl required" }, { status: 400 });

  try {
    if (type === "slack") {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "SwayMaps webhook test successful! Your integration is working.",
          blocks: [{
            type: "section",
            text: { type: "mrkdwn", text: "*SwayMaps Integration Test*\nYour webhook is configured correctly and ready to receive notifications." },
          }],
        }),
      });
    } else if (type === "teams") {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "@type": "MessageCard",
          "@context": "http://schema.org/extensions",
          themeColor: "0EA5E9",
          summary: "SwayMaps Test",
          sections: [{ activityTitle: "SwayMaps Integration Test", text: "Your webhook is configured correctly and ready to receive notifications." }],
        }),
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Webhook test failed" }, { status: 500 });
  }
}
