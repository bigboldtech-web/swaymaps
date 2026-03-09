import { prisma } from "../prisma";

interface WebhookPayload {
  event: string;
  mapName?: string;
  userName?: string;
  details?: string;
  link?: string;
}

export async function sendWebhookNotifications(workspaceId: string, payload: WebhookPayload) {
  const integrations = await prisma.integration.findMany({
    where: { workspaceId, enabled: true },
  });

  for (const integration of integrations) {
    // Check if integration subscribes to this event type
    if (integration.events !== "all") {
      const events = integration.events.split(",").map(e => e.trim());
      if (!events.includes(payload.event)) continue;
    }

    try {
      if (integration.type === "slack") {
        await sendSlackWebhook(integration.webhookUrl, payload);
      } else if (integration.type === "teams") {
        await sendTeamsWebhook(integration.webhookUrl, payload);
      }
    } catch (err) {
      console.error(`Webhook failed for integration ${integration.id}:`, err);
    }
  }
}

async function sendSlackWebhook(url: string, payload: WebhookPayload) {
  const blocks: any[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${payload.event}*\n${payload.details || ""}`,
      },
    },
  ];

  if (payload.mapName) {
    blocks[0].text.text = `*${payload.event}* in _${payload.mapName}_\n${payload.details || ""}`;
  }

  if (payload.userName) {
    blocks.push({
      type: "context",
      elements: [{ type: "mrkdwn", text: `By ${payload.userName}` }],
    });
  }

  if (payload.link) {
    blocks.push({
      type: "actions",
      elements: [{
        type: "button",
        text: { type: "plain_text", text: "View in SwayMaps" },
        url: payload.link,
      }],
    });
  }

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: `${payload.event}: ${payload.details || ""}`,
      blocks,
    }),
  });
}

async function sendTeamsWebhook(url: string, payload: WebhookPayload) {
  const card = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    themeColor: "0EA5E9",
    summary: payload.event,
    sections: [{
      activityTitle: payload.event,
      activitySubtitle: payload.mapName ? `Map: ${payload.mapName}` : undefined,
      text: payload.details || "",
      facts: payload.userName ? [{ name: "By", value: payload.userName }] : [],
    }],
    potentialAction: payload.link ? [{
      "@type": "OpenUri",
      name: "View in SwayMaps",
      targets: [{ os: "default", uri: payload.link }],
    }] : [],
  };

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(card),
  });
}
