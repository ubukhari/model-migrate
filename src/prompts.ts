/**
 * The prompt file `capture` reads: JSONL, one prompt per line.
 *
 *   {"id": "refund-1", "messages": [{"role": "user", "content": "…"}],
 *    "tools": [{"name": "lookup_order", "parameters": {…}}],
 *    "expect": {"json": true, "schema": {…}, "tool": "lookup_order", "match": "normalized"},
 *    "max_tokens": 1024}
 *   {"prompt": "Classify: …"}        a shorthand for one user message
 *
 * `expect` is optional; it says what a good answer must keep (see src/checks.ts). Blank lines and
 * lines starting with `//` are skipped.
 */
import { readFile } from "node:fs/promises";
import { CliError } from "./errors.js";
import { INSTALL } from "./install.js";
import type { Message, ToolSpec } from "./providers.js";

export interface Expect {
  /** the answer must be valid JSON */
  json?: boolean;
  /** …and match this JSON Schema (type, properties, required, items, enum, additionalProperties) */
  schema?: Record<string, unknown>;
  /** the answer must call this tool first */
  tool?: string;
  /** the answer must match the retiring model's, exactly or after normalising case, spaces and punctuation */
  match?: "exact" | "normalized";
}

export interface PromptEntry {
  id: string;
  messages: Message[];
  tools?: ToolSpec[];
  expect?: Expect;
  max_tokens: number;
}

export const DEFAULT_MAX_TOKENS = 1024;

const bad = (line: number, cause: string, fix: string) =>
  new CliError({
    code: "PROMPTS_INVALID",
    cause: `line ${line}: ${cause}`,
    fix,
    retryable: false,
  });

export function parsePrompts(text: string): PromptEntry[] {
  const out: PromptEntry[] = [];
  const ids = new Set<string>();
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = i + 1;
    const t = raw.trim();
    if (!t || t.startsWith("//")) return;
    let o: Record<string, unknown>;
    try {
      o = JSON.parse(t) as Record<string, unknown>;
    } catch {
      throw bad(line, "not valid JSON", "write one JSON object per line (JSONL)");
    }
    if (!o || typeof o !== "object" || Array.isArray(o))
      throw bad(line, "not a JSON object", "write one JSON object per line (JSONL)");
    let messages: Message[];
    if (typeof o["prompt"] === "string") messages = [{ role: "user", content: o["prompt"] }];
    else if (Array.isArray(o["messages"])) {
      messages = (o["messages"] as unknown[]).map((m, k) => {
        const mm = m as { role?: unknown; content?: unknown };
        if (
          !mm ||
          !["system", "user", "assistant"].includes(String(mm.role)) ||
          typeof mm.content !== "string"
        )
          throw bad(
            line,
            `messages[${k}] needs role system|user|assistant and string content`,
            'e.g. {"role": "user", "content": "…"}',
          );
        return { role: mm.role as Message["role"], content: mm.content };
      });
    } else
      throw bad(line, "needs `messages` or `prompt`", 'add "prompt": "…" or "messages": [...]');
    if (!messages.some((m) => m.role === "user"))
      throw bad(line, "has no user message", "add a message with role user");
    const id = typeof o["id"] === "string" && o["id"] ? o["id"] : `line-${line}`;
    if (ids.has(id)) throw bad(line, `id "${id}" is used twice`, "give each prompt its own id");
    ids.add(id);
    const tools = o["tools"];
    if (tools !== undefined && !Array.isArray(tools))
      throw bad(line, "`tools` must be an array", 'e.g. [{"name": "lookup", "parameters": {…}}]');
    for (const [k, tool] of ((tools as unknown[]) ?? []).entries())
      if (!tool || typeof (tool as { name?: unknown }).name !== "string")
        throw bad(line, `tools[${k}] has no name`, "give each tool a string name");
    const max = o["max_tokens"];
    out.push({
      id,
      messages,
      ...(tools ? { tools: tools as ToolSpec[] } : {}),
      ...(o["expect"] && typeof o["expect"] === "object" ? { expect: o["expect"] as Expect } : {}),
      max_tokens: typeof max === "number" && max > 0 ? Math.min(max, 32_000) : DEFAULT_MAX_TOKENS,
    });
  });
  if (!out.length)
    throw new CliError({
      code: "PROMPTS_EMPTY",
      cause: "the prompt file has no prompts",
      fix: 'add one JSON object per line, e.g. {"prompt": "…"}',
      retryable: false,
    });
  return out;
}

export async function readPrompts(file: string): Promise<PromptEntry[]> {
  let text: string;
  try {
    text = await readFile(file, "utf8");
  } catch {
    throw new CliError({
      code: "PROMPTS_NOT_FOUND",
      cause: `cannot read ${file}`,
      fix: `pass a JSONL file of your own prompts, e.g. \`${INSTALL} capture prompts.jsonl --model gpt-5-mini\``,
      retryable: false,
    });
  }
  return parsePrompts(text);
}
