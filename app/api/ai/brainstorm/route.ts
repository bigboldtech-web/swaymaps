import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { AiBrainstormPlan, AiBrainstormRequest } from "../../../../types/ai";

const systemPrompt = `You are an expert facilitator who converts short prompts into concise system/strategy maps.
Return a single JSON object with this shape:
{
  "title": "short board title",
  "summary": "1-2 sentence overview",
  "focusAreas": ["short bullets"],
  "nodes": [
    {
      "title": "clear label",
      "kind": "person|system|process|generic",
      "tags": ["tags"],
      "note": "3-5 concise sentences or bullets",
      "summary": "one-sentence TLDR"
    }
  ],
  "edges": [
    { "source": "Node title", "target": "Node title", "label": "verb phrase" }
  ]
}
Keep nodes between 4 and 9. Use existing context when provided to avoid duplicates. Edge source/target must exactly match node titles.`;

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
        nodes: (mapContext.nodes ?? []).slice(0, 12).map((node) => ({
          title: limit(node.title, 120),
          kind: node.kind,
          tags: (node.tags ?? []).slice(0, 5),
          note: limit(node.note, 240)
        })),
        edges: (mapContext.edges ?? []).slice(0, 20).map((edge) => ({
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
        temperature: 0.6,
        max_tokens: 700,
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
