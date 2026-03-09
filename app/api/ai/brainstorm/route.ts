import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { AiBrainstormPlan, AiBrainstormRequest } from "../../../../types/ai";

const systemPrompt = `You are a world-class systems architect and strategy consultant who creates crystal-clear visual dependency maps. You think like a McKinsey partner, design like an engineer, and communicate like a storyteller.

Your job: turn any prompt into a richly structured map that reveals hidden dependencies, bottlenecks, and opportunities.

RESPONSE FORMAT — Return a single JSON object:
{
  "title": "Compelling 3-6 word board title",
  "summary": "2-3 sentence executive summary explaining the map's key insight",
  "focusAreas": ["Critical path items or key themes — 3-5 bullets"],
  "nodes": [
    {
      "title": "Clear, specific label (not vague)",
      "kind": "person|team|system|process|database|api|queue|cache|cloud|vendor|generic",
      "tags": ["2-4 relevant tags"],
      "note": "Rich context: what this is, why it matters, key risks or metrics. Use bullet points (•) for clarity. 4-8 sentences.",
      "summary": "One-sentence TLDR of this node's role",
      "importance": "core|supporting"
    }
  ],
  "edges": [
    {
      "source": "Exact node title",
      "target": "Exact node title",
      "label": "Specific verb phrase (e.g. 'sends events to', 'depends on', 'triggers')",
      "rationale": "Why this relationship matters"
    }
  ]
}

RULES:
1. NODES: Create 5-9 nodes. Each must be specific and actionable — never vague ("Thing 1"). Use the right kind:
   • person — Individual roles (CEO, Lead Engineer, Customer)
   • team — Groups (Engineering, Marketing, Support Team)
   • system — Software/platforms (Stripe, Slack, CRM, Auth Service)
   • process — Workflows/procedures (Code Review, Sprint Planning, Onboarding Flow)
   • database — Data stores (User DB, Analytics Warehouse, Redis Cache)
   • api — Endpoints/integrations (REST API, Webhook, GraphQL Gateway)
   • queue — Message systems (Event Bus, Job Queue, Notification Pipeline)
   • cloud — Infrastructure (AWS Lambda, CDN, Kubernetes Cluster)
   • vendor — External services (Twilio, SendGrid, Cloudflare)
   • generic — Concepts/abstractions that don't fit above

2. EDGES: Create meaningful connections (aim for nodes×1.2 edges). Every edge label should be a specific verb phrase — not just "connects to". Show data flow, dependencies, triggers, and ownership.

3. NOTES: Each node's note should be genuinely useful — include context someone new to the project would need. Mention risks, metrics, or action items where relevant. Use bullet points (•) for readability.

4. STRUCTURE: Think about the map holistically. Include upstream dependencies and downstream impacts. Show the full picture, not just the obvious parts.

5. EXPAND MODE: When mapContext is provided, analyze existing nodes deeply. Add nodes that fill gaps, reveal hidden dependencies, or extend the map's coverage. Never duplicate existing nodes. Reference existing nodes in new edges.

6. Edge source/target MUST exactly match a node title (existing or new).`;


const limit = (val: unknown, max = 360) => {
  if (typeof val !== "string") return "";
  return val.length > max ? `${val.slice(0, max)}…` : val;
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = ((await req.json().catch(() => ({}))) || {}) as AiBrainstormRequest;
  const { prompt, mode = "new-board", mapContext } = body;
  const apiKey = (body.apiKey || process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "No OpenAI key provided. Add OPENAI_API_KEY to the environment or enter a key in Settings to enable AI."
      },
      { status: 500 }
    );
  }

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const sanitizedContext = mapContext
    ? {
        title: limit(mapContext.title, 120),
        description: limit(mapContext.description, 240),
        nodes: (mapContext.nodes ?? []).slice(0, 20).map((node) => ({
          title: limit(node.title, 120),
          kind: node.kind,
          tags: (node.tags ?? []).slice(0, 6),
          note: limit(node.note, 360)
        })),
        edges: (mapContext.edges ?? []).slice(0, 30).map((edge) => ({
          source: limit(edge.source, 120),
          target: limit(edge.target, 120),
          label: limit(edge.label, 120)
        }))
      }
    : undefined;

  const messages = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: JSON.stringify(
        {
          mode,
          prompt: limit(prompt, 1200),
          mapContext: sanitizedContext
        },
        null,
        2
      )
    }
  ];

  try {
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.72,
        max_tokens: 2400,
        response_format: { type: "json_object" },
        messages
      })
    });

    if (!aiRes.ok) {
      const errorText = await aiRes.text().catch(() => "");
      console.error("OpenAI error", aiRes.status, errorText);
      return NextResponse.json(
        { error: "AI request failed. Check your OpenAI credentials and try again." },
        { status: 500 }
      );
    }

    const completion = await aiRes.json();
    const raw = completion?.choices?.[0]?.message?.content;
    if (!raw || typeof raw !== "string") {
      return NextResponse.json({ error: "AI response was empty." }, { status: 500 });
    }

    let plan: AiBrainstormPlan | null = null;
    try {
      plan = JSON.parse(raw) as AiBrainstormPlan;
    } catch (err) {
      console.error("Failed to parse AI JSON", err);
      return NextResponse.json(
        { error: "Could not parse AI response. Please try again." },
        { status: 500 }
      );
    }

    if (!plan || !Array.isArray(plan.nodes)) {
      return NextResponse.json({ error: "AI response missing node suggestions." }, { status: 500 });
    }

    return NextResponse.json({ plan });
  } catch (err) {
    console.error("AI brainstorm route failed", err);
    return NextResponse.json(
      { error: "Unexpected error while generating ideas." },
      { status: 500 }
    );
  }
}
