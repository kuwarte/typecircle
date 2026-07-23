// FILE: src/app/api/type-chat/route.ts
import { NextRequest } from "next/server";
import { aiChat, type AiMessage } from "@/lib/ai-client";
import { TYPES } from "@/lib/types-data";

export const runtime = "nodejs";

type Body = {
  primary_type: number;
  wing: number;
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { primary_type, wing, message, history = [] } = body;

  if (!primary_type || !wing || !message?.trim()) {
    return new Response("Missing primary_type, wing, or message", {
      status: 400,
    });
  }

  const typeData = TYPES.find((t) => t.n === primary_type);

  const system = `You are a thoughtful, specific Enneagram guide. The person you're talking to just found out they're Type ${primary_type}${
    typeData ? ` (${typeData.name})` : ""
  } with a ${wing} wing. Answer their questions about their type conversationally and briefly — 2-4 sentences unless they ask for more. Be concrete and grounded, never generic or preachy. Don't repeat their question back to them.`;

  const messages: AiMessage[] = [
    { role: "system", content: system },
    ...history.slice(-10),
    { role: "user", content: message },
  ];

  let providerRes: Response;
  try {
    providerRes = await aiChat({ messages, stream: true, temperature: 0.7 });
  } catch (err) {
    console.error("type-chat error:", err);
    return new Response("Failed to reach chat service", { status: 500 });
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = providerRes.body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }

      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.replace(/^data:\s*/, "");
            if (payload === "[DONE]") continue;

            try {
              const json = JSON.parse(payload);
              const token = json?.choices?.[0]?.delta?.content;
              if (token) controller.enqueue(encoder.encode(token));
            } catch {
              // skip malformed SSE chunk
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
