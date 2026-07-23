const AI_API_URL =
  process.env.AI_API_URL ?? "https://api.groq.com/openai/v1/chat/completions";
const AI_MODEL = process.env.AI_MODEL ?? "llama-3.3-70b-versatile";

export type AiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type AiChatOptions = {
  messages: AiMessage[];
  model?: string;
  temperature?: number;
  responseFormat?: "json_object";
  stream?: boolean;
};

/**
 * Calls the configured LLM provider's chat completions endpoint and returns
 * the raw fetch Response. Caller decides whether to `.json()` it or stream
 * `.body`.
 */
export async function aiChat({
  messages,
  model = AI_MODEL,
  temperature = 0.7,
  responseFormat,
  stream = false,
}: AiChatOptions): Promise<Response> {
  if (!process.env.AI_API_KEY) {
    throw new Error("AI_API_KEY is not set");
  }

  const res = await fetch(AI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      stream,
      ...(responseFormat ? { response_format: { type: responseFormat } } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`AI provider error ${res.status}: ${text}`);
  }

  return res;
}
