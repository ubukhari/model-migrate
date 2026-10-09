/**
 * `capture`: run your prompts on a model, on your own key, and keep its answers and the token
 * counts the provider reports in `.model-migrate/`. Made for the retiring model while it still
 * answers: after its shutdown date this record cannot be made.
 *
 * Spend is on your key and capped: at most `--limit` prompts (default 100) per run, at most
 * `max_tokens` each (default 1,024), `--concurrency` calls at a time (default 2). One retry for a
 * call the provider says is worth retrying (429, 5xx).
 */
import { CliError, type Problem } from "./errors.js";
import type { PromptEntry } from "./prompts.js";
import { call, keyFor, providerFor, type FetchLike, type Provider } from "./providers.js";
import type { CaptureRecord } from "./store.js";

export const DEFAULT_LIMIT = 100;
export const MAX_LIMIT = 1_000;

export interface RunOptions {
  env: NodeJS.ProcessEnv;
  fetch?: FetchLike;
  concurrency?: number;
  now?: () => Date;
  /** wait between a retryable failure and its retry; tests pass 0 */
  retryDelayMs?: number;
}

export function resolveProvider(model: string): Provider {
  const p = providerFor(model);
  if (!p)
    throw new CliError({
      code: "UNKNOWN_PROVIDER",
      cause: `cannot tell which provider serves "${model}"`,
      fix: "use an OpenAI (gpt-…, o…), Anthropic (claude-…) or Gemini API (gemini-…) model ID",
      retryable: false,
    });
  return p;
}

/** Run every prompt on one model. Failed calls are kept as records with their error. */
export async function runModel(
  model: string,
  prompts: PromptEntry[],
  opts: RunOptions,
): Promise<CaptureRecord[]> {
  const provider = resolveProvider(model);
  const key = keyFor(provider, opts.env);
  const now = opts.now ?? (() => new Date());
  const delay = opts.retryDelayMs ?? 2_000;
  const records: CaptureRecord[] = new Array(prompts.length);
  let next = 0;
  const worker = async () => {
    while (next < prompts.length) {
      const i = next++;
      const p = prompts[i]!;
      const request = {
        messages: p.messages,
        ...(p.tools ? { tools: p.tools } : {}),
        max_tokens: p.max_tokens,
      };
      const started = Date.now();
      const base = { id: p.id, model, provider, at: now().toISOString(), request };
      const attempt = () =>
        call(
          provider,
          { model, messages: p.messages, tools: p.tools, maxTokens: p.max_tokens },
          key,
          opts.fetch,
        );
      let record: CaptureRecord;
      try {
        let result;
        try {
          result = await attempt();
        } catch (e) {
          if (!(e instanceof CliError) || !e.retryable) throw e;
          await new Promise((r) => setTimeout(r, delay));
          result = await attempt();
        }
        record = {
          ...base,
          ...(p.expect ? { expect: p.expect } : {}),
          result,
          latency_ms: Date.now() - started,
        };
      } catch (e) {
        const error: Problem =
          e instanceof CliError
            ? e.toJSON()
            : {
                code: "CALL_FAILED",
                cause: e instanceof Error ? e.message : String(e),
                fix: "check the network and retry",
                retryable: true,
              };
        // a missing model or a refused key will fail every prompt the same way: stop now
        if (error.code === "MODEL_NOT_FOUND" || error.code === "KEY_REJECTED") throw e;
        record = {
          ...base,
          ...(p.expect ? { expect: p.expect } : {}),
          error,
          latency_ms: Date.now() - started,
        };
      }
      records[i] = record;
    }
  };
  const n = Math.max(1, Math.min(opts.concurrency ?? 2, 8));
  await Promise.all(Array.from({ length: Math.min(n, prompts.length) }, worker));
  return records;
}

export function applyLimit(prompts: PromptEntry[], limit: number | undefined): PromptEntry[] {
  const cap = limit ?? DEFAULT_LIMIT;
  if (!Number.isInteger(cap) || cap < 1 || cap > MAX_LIMIT)
    throw new CliError(
      {
        code: "BAD_ARGUMENTS",
        cause: `--limit must be a whole number from 1 to ${MAX_LIMIT}`,
        fix: "e.g. --limit 50",
        retryable: false,
      },
      2,
    );
  return prompts.slice(0, cap);
}
