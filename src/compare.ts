/**
 * `compare`: replay the retiring model's captured prompts on 2–4 candidates, on your own keys, and
 * report each candidate's pass rate against the retiring model's answers (src/checks.ts), its
 * measured cost per 1,000 calls from the token counts each provider reported, and the API changes
 * the providers document. A candidate whose provider key is not set is skipped, not guessed.
 */
import { applyLimit, runModel, type RunOptions } from "./capture.js";
import {
  defaultCandidates,
  findEntry,
  priceOf,
  costPer1000,
  type Candidate,
  type ListPrice,
} from "./catalog.js";
import { checkPair, type CheckName, type PairResult } from "./checks.js";
import { PAGES_URL, type Dataset } from "./data.js";
import { CliError } from "./errors.js";
import type { PromptEntry } from "./prompts.js";
import { KEY_ENV, hasKey, providerFor, type Provider } from "./providers.js";
import { readCaptures, writeCaptures, type CaptureRecord } from "./store.js";

export const MAX_CANDIDATES = 4;

export interface Tokens {
  mean_input: number;
  mean_output: number;
}

export interface CandidateReport {
  model: string;
  provider: Provider | null;
  why: Candidate["why"];
  status: "ran" | "skipped";
  skipped_reason?: string;
  capture_file?: string;
  compared: number;
  passed: number;
  pass_rate: number | null;
  failures: { check: CheckName | "call"; count: number }[];
  examples: { id: string; detail: string }[];
  tokens: Tokens | null;
  price: ListPrice | null;
  cost_per_1000_calls: number | null;
  breaks: { text: string; source: string }[];
}

export interface CompareReport {
  retiring: {
    model: string;
    prompts: number;
    answered: number;
    tokens: Tokens | null;
    price: ListPrice | null;
    cost_per_1000_calls: number | null;
    shutdown: string | null;
    page_url: string | null;
  };
  candidates: CandidateReport[];
}

export function meanTokens(records: CaptureRecord[]): Tokens | null {
  const ok = records.filter((r) => r.result);
  if (!ok.length) return null;
  const sum = (f: (r: CaptureRecord) => number) => ok.reduce((n, r) => n + f(r), 0) / ok.length;
  return {
    mean_input: Math.round(sum((r) => r.result!.usage.input_tokens)),
    mean_output: Math.round(sum((r) => r.result!.usage.output_tokens)),
  };
}

function cost(price: ListPrice | null | undefined, t: Tokens | null): number | null {
  return price && t
    ? Math.round(costPer1000(price, t.mean_input, t.mean_output) * 100) / 100
    : null;
}

/** The changes the providers document for moving onto this candidate, from the retirement data. */
export function breaksFor(model: string, data: Dataset): { text: string; source: string }[] {
  const seen = new Map<string, { text: string; source: string }>();
  for (const e of data.entries)
    if (e.replacements.includes(model))
      for (const b of e.breaks) seen.set(b.text, { text: b.text, source: b.source });
  return [...seen.values()];
}

export function promptsFrom(baseline: CaptureRecord[]): PromptEntry[] {
  return baseline
    .filter((r) => r.result)
    .map((r) => ({
      id: r.id,
      messages: r.request.messages,
      ...(r.request.tools ? { tools: r.request.tools } : {}),
      ...(r.expect ? { expect: r.expect } : {}),
      max_tokens: r.request.max_tokens,
    }));
}

export function summarize(pairs: PairResult[]) {
  const compared = pairs.filter((p) => p.pass !== null);
  const passed = compared.filter((p) => p.pass).length;
  const counts = new Map<CheckName | "call", number>();
  const examples: { id: string; detail: string }[] = [];
  for (const p of compared) {
    if (p.pass) continue;
    if (p.error) {
      counts.set("call", (counts.get("call") ?? 0) + 1);
      if (examples.length < 3) examples.push({ id: p.id, detail: p.error });
      continue;
    }
    for (const c of p.checks.filter((x) => x.gating && !x.pass)) {
      counts.set(c.name, (counts.get(c.name) ?? 0) + 1);
      if (examples.length < 3)
        examples.push({ id: p.id, detail: `${c.name}: ${c.detail ?? "differs"}` });
    }
  }
  return {
    compared: compared.length,
    passed,
    pass_rate: compared.length ? Math.round((passed / compared.length) * 1000) / 10 : null,
    failures: [...counts.entries()]
      .map(([check, count]) => ({ check, count }))
      .sort((a, b) => b.count - a.count),
    examples,
  };
}

export async function compare(opts: {
  cwd: string;
  retiring: string;
  candidates?: string[];
  data: Dataset;
  today: string;
  limit?: number;
  run: RunOptions;
}): Promise<CompareReport> {
  const baseline = await readCaptures(opts.cwd, opts.retiring);
  const prompts = applyLimit(promptsFrom(baseline), opts.limit);
  if (!prompts.length)
    throw new CliError({
      code: "NO_ANSWERS",
      cause: `the capture for ${opts.retiring} has no successful answers to compare against`,
      fix: "run capture again; every call in it failed",
      retryable: true,
    });
  const chosen: Candidate[] = opts.candidates?.length
    ? opts.candidates.map((model) => ({ model, why: "your choice" as const }))
    : defaultCandidates(opts.retiring, opts.data, opts.today);
  if (!chosen.length)
    throw new CliError(
      {
        code: "NO_CANDIDATES",
        cause: `no replacement for ${opts.retiring} is in the retirement data`,
        fix: "name 1 to 4 models: --candidates gpt-5.6-terra,claude-sonnet-5-5",
        retryable: false,
      },
      2,
    );
  if (chosen.length > MAX_CANDIDATES)
    throw new CliError(
      {
        code: "BAD_ARGUMENTS",
        cause: `${chosen.length} candidates; compare runs at most ${MAX_CANDIDATES}`,
        fix: "name up to four models in --candidates",
        retryable: false,
      },
      2,
    );

  const entry = findEntry(opts.data, opts.retiring);
  const baseTokens = meanTokens(baseline);
  const basePrice = priceOf(opts.retiring, entry?.shutdown ?? opts.today, opts.data) ?? null;
  const byId = new Map(baseline.map((r) => [r.id, r]));
  const reports: CandidateReport[] = [];

  for (const cand of chosen) {
    const provider = providerFor(cand.model) ?? null;
    const price = priceOf(cand.model, opts.today, opts.data) ?? null;
    const base = {
      model: cand.model,
      provider,
      why: cand.why,
      breaks: breaksFor(cand.model, opts.data),
      price,
    };
    const skip = (reason: string): CandidateReport => ({
      ...base,
      status: "skipped",
      skipped_reason: reason,
      compared: 0,
      passed: 0,
      pass_rate: null,
      failures: [],
      examples: [],
      tokens: null,
      cost_per_1000_calls: null,
    });
    if (!provider) {
      reports.push(skip("not an OpenAI, Anthropic or Gemini API model ID"));
      continue;
    }
    if (!hasKey(provider, opts.run.env)) {
      reports.push(skip(`no ${KEY_ENV[provider].join(" or ")} in the environment`));
      continue;
    }
    const records = await runModel(cand.model, prompts, opts.run);
    const file = await writeCaptures(opts.cwd, cand.model, records, opts.retiring);
    const recById = new Map(records.map((r) => [r.id, r]));
    const pairs = prompts.map((p) => checkPair(byId.get(p.id)!, recById.get(p.id)));
    const tokens = meanTokens(records);
    reports.push({
      ...base,
      status: "ran",
      capture_file: file,
      ...summarize(pairs),
      tokens,
      cost_per_1000_calls: cost(price, tokens),
    });
  }

  return {
    retiring: {
      model: opts.retiring,
      prompts: baseline.length,
      answered: prompts.length,
      tokens: baseTokens,
      price: basePrice,
      cost_per_1000_calls: cost(basePrice, baseTokens),
      shutdown: entry?.shutdown ?? null,
      page_url: entry ? `${PAGES_URL}/${entry.provider}/${entry.id}?ref=model-migrate` : null,
    },
    candidates: reports,
  };
}
