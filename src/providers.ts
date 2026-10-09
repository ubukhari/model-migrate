/**
 * One call to a model on the customer's own key: OpenAI (Chat Completions), Anthropic (Messages)
 * or the Gemini API (generateContent). Plain `fetch`, no SDK. Each provider's reply is reduced to
 * the same shape: the text, the tool calls, whether it refused, and the token counts the provider
 * itself reports. Prompts and outputs go only to that provider; nothing goes anywhere else.
 */
import { CliError } from "./errors.js";

export type Provider = "openai" | "anthropic" | "gemini";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ToolSpec {
  name: string;
  description?: string;
  /** JSON Schema for the arguments */
  parameters?: Record<string, unknown>;
}

export interface CallRequest {
  model: string;
  messages: Message[];
  tools?: ToolSpec[];
  maxTokens: number;
}

export interface ToolCall {
  name: string;
  args: unknown;
}

export interface Usage {
  input_tokens: number;
  /** everything billed as output, reasoning or thinking included */
  output_tokens: number;
  reasoning_tokens?: number;
}

export interface CallResult {
  text: string;
  tool_calls: ToolCall[];
  refused: boolean;
  finish: string;
  usage: Usage;
}

export type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

export const KEY_ENV: Record<Provider, string[]> = {
  openai: ["OPENAI_API_KEY"],
  anthropic: ["ANTHROPIC_API_KEY"],
  gemini: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
};

const ENDPOINT: Record<Provider, string> = {
  openai: "https://api.openai.com/v1/chat/completions",
  anthropic: "https://api.anthropic.com/v1/messages",
  gemini: "https://generativelanguage.googleapis.com/v1beta/models",
};

/** The provider a model ID belongs to, from its name; `ft:` IDs are OpenAI fine-tunes. */
export function providerFor(model: string): Provider | undefined {
  const m = model.toLowerCase().replace(/^(openai|anthropic|gemini|models)\//, "");
  if (/^(gpt-|o\d|chatgpt-|codex-|ft:|davinci|babbage)/.test(m)) return "openai";
  if (m.startsWith("claude-")) return "anthropic";
  if (m.startsWith("gemini-")) return "gemini";
  return undefined;
}

/** The key's value from the environment, or the error that says which variable to set. */
export function keyFor(provider: Provider, env: NodeJS.ProcessEnv): string {
  for (const name of KEY_ENV[provider]) {
    const v = env[name];
    if (v && v.trim()) return v.trim();
  }
  throw new CliError({
    code: "KEY_MISSING",
    cause: `no ${KEY_ENV[provider].join(" or ")} in the environment`,
    fix: `export ${KEY_ENV[provider][0]}=<your own key>; model-migrate sends it only to ${new URL(ENDPOINT[provider]).host}`,
    retryable: false,
  });
}

export function hasKey(provider: Provider, env: NodeJS.ProcessEnv): boolean {
  return KEY_ENV[provider].some((n) => !!env[n]?.trim());
}

const REFUSAL_TEXT =
  /^\s*(i('| a)m sorry,? but i (can('|no)t|won't|am unable to)|i can('|no)t (help|assist) with|i('| a)m (not able|unable) to (help|assist) with)/i;

/** A refusal by the provider's own signal, or by an opening sentence that only a refusal has. */
function refusedText(text: string): boolean {
  return REFUSAL_TEXT.test(text);
}

function parseArgs(raw: unknown): unknown {
  if (typeof raw !== "string") return raw ?? {};
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}

function body(req: CallRequest, provider: Provider): unknown {
  if (provider === "openai") {
    return {
      model: req.model,
      messages: req.messages,
      max_completion_tokens: req.maxTokens,
      ...(req.tools?.length
        ? {
            tools: req.tools.map((t) => ({
              type: "function",
              function: {
                name: t.name,
                description: t.description ?? "",
                parameters: t.parameters ?? { type: "object", properties: {} },
              },
            })),
          }
        : {}),
    };
  }
  if (provider === "anthropic") {
    const system = req.messages
      .filter((m) => m.role === "system")
      .map((m) => m.content)
      .join("\n\n");
    return {
      model: req.model,
      max_tokens: req.maxTokens,
      ...(system ? { system } : {}),
      messages: req.messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role, content: m.content })),
      ...(req.tools?.length
        ? {
            tools: req.tools.map((t) => ({
              name: t.name,
              description: t.description ?? "",
              input_schema: t.parameters ?? { type: "object", properties: {} },
            })),
          }
        : {}),
    };
  }
  const system = req.messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n\n");
  return {
    ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
    contents: req.messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    generationConfig: { maxOutputTokens: req.maxTokens },
    ...(req.tools?.length
      ? {
          tools: [
            {
              functionDeclarations: req.tools.map((t) => ({
                name: t.name,
                description: t.description ?? "",
                parameters: t.parameters ?? { type: "object", properties: {} },
              })),
            },
          ],
        }
      : {}),
  };
}

type J = Record<string, unknown>;
const obj = (v: unknown): J => (v && typeof v === "object" && !Array.isArray(v) ? (v as J) : {});
const arr = (v: unknown): J[] => (Array.isArray(v) ? v.map(obj) : []);
const num = (v: unknown): number => (typeof v === "number" ? v : Number(v ?? 0) || 0);
const s = (v: unknown): string => (typeof v === "string" ? v : v == null ? "" : String(v));

/** Reduce a provider's JSON reply to a CallResult. Exported for the recorded-fixture tests. */
export function parseReply(provider: Provider, json: unknown): CallResult {
  const j = obj(json);
  if (provider === "openai") {
    const choice = arr(j["choices"])[0] ?? {};
    const msg = obj(choice["message"]);
    const text = s(msg["content"]);
    const usage = obj(j["usage"]);
    const details = obj(usage["completion_tokens_details"]);
    return {
      text,
      tool_calls: arr(msg["tool_calls"]).map((c) => {
        const fn = obj(c["function"]);
        return { name: s(fn["name"]), args: parseArgs(fn["arguments"]) };
      }),
      refused: !!msg["refusal"] || refusedText(text),
      finish: s(choice["finish_reason"]),
      usage: {
        input_tokens: num(usage["prompt_tokens"]),
        output_tokens: num(usage["completion_tokens"]),
        ...(details["reasoning_tokens"] !== undefined
          ? { reasoning_tokens: num(details["reasoning_tokens"]) }
          : {}),
      },
    };
  }
  if (provider === "anthropic") {
    const content = arr(j["content"]);
    const text = content
      .filter((b) => b["type"] === "text")
      .map((b) => s(b["text"]))
      .join("");
    const usage = obj(j["usage"]);
    const stop = s(j["stop_reason"]);
    return {
      text,
      tool_calls: content
        .filter((b) => b["type"] === "tool_use")
        .map((b) => ({ name: s(b["name"]), args: b["input"] ?? {} })),
      refused: stop === "refusal" || refusedText(text),
      finish: stop,
      usage: {
        input_tokens: num(usage["input_tokens"]),
        output_tokens: num(usage["output_tokens"]),
      },
    };
  }
  const cand = arr(j["candidates"])[0] ?? {};
  const parts = arr(obj(cand["content"])["parts"]);
  const text = parts
    .filter((p) => typeof p["text"] === "string" && !p["thought"])
    .map((p) => s(p["text"]))
    .join("");
  const meta = obj(j["usageMetadata"]);
  const thoughts = num(meta["thoughtsTokenCount"]);
  const finish = s(cand["finishReason"]) || s(obj(j["promptFeedback"])["blockReason"]);
  return {
    text,
    tool_calls: parts
      .filter((p) => p["functionCall"])
      .map((p) => {
        const fc = obj(p["functionCall"]);
        return { name: s(fc["name"]), args: fc["args"] ?? {} };
      }),
    refused:
      /^(SAFETY|PROHIBITED_CONTENT|BLOCKLIST|SPII|RECITATION)$/.test(finish) || refusedText(text),
    finish,
    usage: {
      input_tokens: num(meta["promptTokenCount"]),
      output_tokens: num(meta["candidatesTokenCount"]) + thoughts,
      ...(thoughts ? { reasoning_tokens: thoughts } : {}),
    },
  };
}

/** One call. Errors carry the provider's own message and whether a retry could help. */
export async function call(
  provider: Provider,
  req: CallRequest,
  key: string,
  doFetch: FetchLike = fetch,
): Promise<CallResult> {
  const model = req.model.replace(/^(openai|anthropic|gemini|models)\//, "");
  const url =
    provider === "gemini"
      ? `${ENDPOINT.gemini}/${encodeURIComponent(model)}:generateContent`
      : ENDPOINT[provider];
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (provider === "openai") headers["authorization"] = `Bearer ${key}`;
  if (provider === "anthropic") {
    headers["x-api-key"] = key;
    headers["anthropic-version"] = "2023-06-01";
  }
  if (provider === "gemini") headers["x-goog-api-key"] = key;
  const res = await doFetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body({ ...req, model }, provider)),
    signal: AbortSignal.timeout(120_000),
  });
  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    json = undefined;
  }
  if (!res.ok) {
    const j = json as { error?: { message?: string; type?: string; status?: string } } | undefined;
    const message = j?.error?.message ?? text.slice(0, 200);
    const retryable = res.status === 429 || res.status >= 500;
    throw new CliError({
      code:
        res.status === 404
          ? "MODEL_NOT_FOUND"
          : res.status === 401 || res.status === 403
            ? "KEY_REJECTED"
            : "PROVIDER_ERROR",
      cause: `${provider} answered HTTP ${res.status} for ${model}: ${message}`,
      fix:
        res.status === 404
          ? "check the model ID; a model past its shutdown date cannot be called"
          : res.status === 401 || res.status === 403
            ? `check ${KEY_ENV[provider][0]}: the provider refused it`
            : retryable
              ? "retry later, or lower --concurrency"
              : "check the prompt file entry this error names",
      retryable,
    });
  }
  return parseReply(provider, json);
}
