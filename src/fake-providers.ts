/**
 * Test double for the three providers: fixed replies in each provider's documented response shape
 * (OpenAI Chat Completions, Anthropic Messages, Gemini generateContent), chosen by model and prompt.
 * No live call is ever made in tests. Also used by scripts/sample-compare.mjs for the README's
 * synthetic `compare` sample. Not exported from the package.
 */
import type { FetchLike } from "./providers.js";

type Answer = {
  text?: string;
  tool?: { name: string; args: Record<string, unknown> };
  refuse?: boolean;
};

/** What each synthetic model "answers" to each example prompt (examples/prompts.jsonl). */
export const ANSWERS: Record<string, Record<string, Answer>> = {
  "gpt-5-mini": {
    "classify-1": { text: "billing" },
    "extract-1": { text: '{"name": "Dana Lee", "amount": 42.1}' },
    "tool-1": { tool: { name: "lookup_order", args: { order_id: "A-1029" } } },
    "summary-1": {
      text: "The team meeting moved to Thursday because the venue flooded overnight.",
    },
  },
  "gpt-5.6-terra": {
    "classify-1": { text: "Billing." },
    "extract-1": { text: '```json\n{"name": "Dana Lee", "amount": "42.10"}\n```' },
    "tool-1": { tool: { name: "lookup_order", args: { order_id: "A-1029" } } },
    "summary-1": {
      text: "Because the venue flooded overnight, the team meeting is now on Thursday.",
    },
  },
  "gpt-6.1-sol": {
    "classify-1": { text: "billing" },
    "extract-1": { text: '{"name": "Dana Lee", "amount": 42.1}' },
    "tool-1": { tool: { name: "get_order", args: { id: "A-1029" } } },
    "summary-1": { text: "The meeting was moved to Thursday since the venue flooded overnight." },
  },
  "claude-sonnet-5-5": {
    "classify-1": { text: "billing" },
    "extract-1": { text: '{"name": "Dana Lee", "amount": 42.1}' },
    "tool-1": { tool: { name: "lookup_order", args: { order_id: "A-1029" } } },
    "summary-1": { refuse: true, text: "I'm sorry, but I can't help with that." },
  },
  "gemini-3.8-flash": {
    "classify-1": { text: "billing" },
    "extract-1": { text: '{"name": "Dana Lee", "amount": 42.1}' },
    "tool-1": { tool: { name: "lookup_order", args: { order_id: "A-1029" } } },
    "summary-1": { text: "The team meeting moved to Thursday after the venue flooded overnight." },
  },
};

/** Which example prompt a request carries, by its last user message. */
function promptId(messagesText: string): string {
  if (messagesText.includes("Classify the ticket")) return "classify-1";
  if (messagesText.includes("Extract name and amount")) return "extract-1";
  if (messagesText.includes("order A-1029")) return "tool-1";
  return "summary-1";
}

const usage = { input: 52, output: 18, reasoning: 6 };

export interface Seen {
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
}

/** A fetch that answers like the providers do. `seen` records every request for assertions. */
export function fakeProviders(seen: Seen[] = []): FetchLike {
  return async (url, init) => {
    const body = JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown>;
    const headers = Object.fromEntries(
      Object.entries((init?.headers ?? {}) as Record<string, string>).map(([k, v]) => [
        k.toLowerCase(),
        v,
      ]),
    );
    seen.push({ url, headers, body });
    const text = JSON.stringify(body);
    if (url.startsWith("https://api.openai.com/")) {
      const model = String(body["model"]);
      const a = ANSWERS[model]?.[promptId(text)];
      if (!a)
        return new Response(
          JSON.stringify({ error: { message: `The model \`${model}\` does not exist` } }),
          { status: 404 },
        );
      return Response.json({
        id: "chatcmpl-test",
        object: "chat.completion",
        model,
        choices: [
          {
            index: 0,
            finish_reason: a.tool ? "tool_calls" : "stop",
            message: {
              role: "assistant",
              content: a.tool ? null : (a.text ?? ""),
              refusal: a.refuse ? a.text : null,
              ...(a.tool
                ? {
                    tool_calls: [
                      {
                        id: "call_1",
                        type: "function",
                        function: { name: a.tool.name, arguments: JSON.stringify(a.tool.args) },
                      },
                    ],
                  }
                : {}),
            },
          },
        ],
        usage: {
          prompt_tokens: usage.input,
          completion_tokens: usage.output,
          total_tokens: usage.input + usage.output,
          completion_tokens_details: { reasoning_tokens: usage.reasoning },
        },
      });
    }
    if (url.startsWith("https://api.anthropic.com/")) {
      const model = String(body["model"]);
      const a = ANSWERS[model]?.[promptId(text)];
      if (!a)
        return new Response(
          JSON.stringify({
            type: "error",
            error: { type: "not_found_error", message: `model: ${model}` },
          }),
          { status: 404 },
        );
      return Response.json({
        id: "msg_test",
        type: "message",
        role: "assistant",
        model,
        content: a.tool
          ? [{ type: "tool_use", id: "toolu_1", name: a.tool.name, input: a.tool.args }]
          : [{ type: "text", text: a.text ?? "" }],
        stop_reason: a.refuse ? "refusal" : a.tool ? "tool_use" : "end_turn",
        usage: { input_tokens: usage.input, output_tokens: usage.output },
      });
    }
    if (url.startsWith("https://generativelanguage.googleapis.com/")) {
      const model = decodeURIComponent(/models\/([^:]+):generateContent/.exec(url)?.[1] ?? "");
      const a = ANSWERS[model]?.[promptId(text)];
      if (!a)
        return new Response(
          JSON.stringify({
            error: { code: 404, message: `models/${model} is not found`, status: "NOT_FOUND" },
          }),
          { status: 404 },
        );
      return Response.json({
        candidates: [
          {
            content: {
              role: "model",
              parts: a.tool
                ? [{ functionCall: { name: a.tool.name, args: a.tool.args } }]
                : [{ text: a.text ?? "" }],
            },
            finishReason: a.refuse ? "SAFETY" : "STOP",
          },
        ],
        usageMetadata: {
          promptTokenCount: usage.input,
          candidatesTokenCount: usage.output - usage.reasoning,
          thoughtsTokenCount: usage.reasoning,
          totalTokenCount: usage.input + usage.output,
        },
      });
    }
    throw new Error(`unexpected request to ${url}`);
  };
}
