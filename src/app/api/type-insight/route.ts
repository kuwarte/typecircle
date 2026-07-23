// FILE: src/app/api/type-insight/route.ts
import { NextRequest, NextResponse } from "next/server";
import { aiChat } from "@/lib/ai-client";
import { TYPES } from "@/lib/types-data";

export const runtime = "nodejs";

type Body = {
  primary_type: number;
  wing: number;
  answers?: Record<string, number>;
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { primary_type, wing, answers } = body;

  if (!primary_type || !wing) {
    return NextResponse.json(
      { error: "Missing primary_type or wing" },
      { status: 400 },
    );
  }

  const typeData = TYPES.find((t) => t.n === primary_type);

  const answerSummary = Object.entries(answers ?? {})
    .map(([id, value]) => `${id}:${value}`)
    .join(", ");

  const system = `You are a precise, grounded Enneagram analyst. You write short, specific personality insights based on someone's actual quiz answers — never vague astrology-style language, never generic filler that could apply to anyone.

Return ONLY valid JSON with this exact shape, nothing else, no markdown fences:
{
  "summary": string,
  "traits": {
    "head": number,
    "heart": number,
    "body": number,
    "wing": number
  }
}

Rules for "summary": 2-3 sentences, second person ("you"), specific and concrete, grounded in the answer pattern described, no hedging phrases like "you might" repeated more than once.

Rules for "traits": each is an integer 0-100.
- "head" = strength of thinking/analysis/planning center
- "heart" = strength of feeling/image/connection center
- "body" = strength of instinct/action/gut center
- "wing" = how strongly the wing type flavors the core type
Base these on how the answers actually cluster, not just a lookup table for the type number. Vary them meaningfully between people with the same type.`;

  const user = `Primary type: ${primary_type}${typeData ? ` (${typeData.name})` : ""}.
Wing: ${wing}.
Raw answers (question id: rating 1-5): ${answerSummary || "not provided"}.`;

  try {
    const res = await aiChat({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      responseFormat: "json_object",
      temperature: 0.6,
    });

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";

    let parsed: {
      summary?: string;
      traits?: { head?: number; heart?: number; body?: number; wing?: number };
    };
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Model returned invalid JSON" },
        { status: 502 },
      );
    }

    const clamp = (n: unknown, fallback: number) =>
      typeof n === "number" && Number.isFinite(n)
        ? Math.max(0, Math.min(100, Math.round(n)))
        : fallback;

    return NextResponse.json({
      summary:
        typeof parsed.summary === "string" && parsed.summary.trim()
          ? parsed.summary.trim()
          : null,
      traits: {
        head: clamp(parsed.traits?.head, 60),
        heart: clamp(parsed.traits?.heart, 60),
        body: clamp(parsed.traits?.body, 60),
        wing: clamp(parsed.traits?.wing, 60),
      },
    });
  } catch (err) {
    console.error("type-insight error:", err);
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 },
    );
  }
}
