/**
 * List prices of the current models `compare` picks candidates from, per million tokens, standard
 * tier, text input, shortest context tier, as each provider's pricing page listed them on
 * 8 October 2026. Used only to turn measured token counts into a cost per 1,000 calls; a model not
 * here (and not in the retirement data) gets no cost, never a guessed one.
 */
import type { Dataset, Retirement } from "./data.js";
import { providerFor, type Provider } from "./providers.js";

export const CATALOG_SEEN = "2026-10-08";
export const PRICING_URL: Record<Provider, string> = {
  openai: "https://developers.openai.com/api/docs/pricing",
  anthropic: "https://platform.claude.com/docs/en/about-claude/pricing",
  gemini: "https://ai.google.dev/gemini-api/docs/pricing",
};

export interface ListPrice {
  input: number;
  output: number;
  /** YYYY-MM-DD bounds of this price, where the page gives them */
  from?: string;
  until?: string;
  note?: string;
}

const FLASH_3X: ListPrice[] = [
  { input: 0.75, output: 3.75, until: "2026-12-31" },
  { input: 1.5, output: 7.5, from: "2027-01-01" },
];

export const CATALOG: Record<string, ListPrice[]> = {
  // OpenAI
  "gpt-6-astra": [{ input: 10, output: 50 }],
  "gpt-6.1-sol": [{ input: 2, output: 10 }],
  "gpt-6-sol": [{ input: 2, output: 10 }],
  "gpt-6-luna": [{ input: 0.1, output: 0.5 }],
  "gpt-5.6-sol": [
    { input: 4, output: 20, note: "promotional, available at least through 21 Nov 2026" },
  ],
  "gpt-5.6-terra": [{ input: 2, output: 12 }],
  "gpt-5.6-luna": [{ input: 0.2, output: 1.2 }],
  // Anthropic
  "claude-fable-5-1": [{ input: 10, output: 50 }],
  "claude-opus-5-5": [{ input: 4, output: 20 }],
  "claude-sonnet-5-5": [{ input: 2, output: 10 }],
  "claude-haiku-5-5": [{ input: 0.1, output: 0.5, note: "prompts up to 100,000 tokens" }],
  "claude-opus-4-8": [{ input: 5, output: 25 }],
  "claude-sonnet-4-6": [{ input: 3, output: 15 }],
  "claude-haiku-4-5-20251001": [{ input: 1, output: 5 }],
  // Gemini API
  "gemini-3.8-flash": FLASH_3X,
  "gemini-3.7-flash": FLASH_3X,
  "gemini-3.6-flash": FLASH_3X,
  "gemini-3.5-flash": [{ input: 1.5, output: 9 }],
  "gemini-3.5-flash-lite": [{ input: 0.3, output: 2.5 }],
  "gemini-3.1-flash-lite": [{ input: 0.25, output: 1.5 }],
  "gemini-3.1-pro-preview": [{ input: 2, output: 12, note: "prompts up to 200,000 tokens" }],
};

const bare = (model: string) => model.replace(/^(openai|anthropic|gemini|models)\//, "");

/** The list price on `day`: from the catalog, else the retiring model's price in the data. */
export function priceOf(model: string, day: string, data?: Dataset): ListPrice | undefined {
  const m = bare(model);
  const periods = CATALOG[m];
  if (periods)
    return periods.find((p) => (!p.from || p.from <= day) && (!p.until || day <= p.until));
  const e = data && findEntry(data, m);
  const p = e?.prices[0];
  return p ? { input: p.retiring.input, output: p.retiring.output } : undefined;
}

/** The retirement entry a model ID names (ID or alias); Gemini API before Vertex AI. */
export function findEntry(data: Dataset, model: string): Retirement | undefined {
  const m = bare(model);
  const hits = data.entries.filter((e) => e.id === m || e.aliases.includes(m));
  return hits.find((e) => e.provider !== "vertex-ai") ?? hits[0];
}

/** Dollars for 1,000 calls at the measured mean tokens per call. */
export function costPer1000(price: ListPrice, meanInput: number, meanOutput: number): number {
  return (1000 * (meanInput * price.input + meanOutput * price.output)) / 1e6;
}

export interface Candidate {
  model: string;
  why: "recommended replacement" | "cheaper sibling" | "another provider" | "your choice";
}

const current = (provider: Provider) =>
  Object.keys(CATALOG).filter((m) => providerFor(m) === provider && !m.includes("preview"));

/**
 * The default candidates for a retiring model: the provider's recommended replacement, the most
 * capable cheaper model from the same provider, and the model from another provider whose output
 * price is nearest the replacement's. At most four; `--candidates` replaces them.
 */
export function defaultCandidates(retiring: string, data: Dataset, day: string): Candidate[] {
  const entry = findEntry(data, retiring);
  const recommended = entry?.replacements.find((r) => providerFor(r));
  const out: Candidate[] = [];
  if (!recommended) return out;
  out.push({ model: recommended, why: "recommended replacement" });
  const rp = priceOf(recommended, day, data);
  const provider = providerFor(recommended)!;
  if (rp) {
    const cheaper = current(provider)
      .filter((m) => m !== recommended)
      .map((m) => ({ m, p: priceOf(m, day)! }))
      .filter((x) => x.p.output < rp.output)
      .sort((a, b) => b.p.output - a.p.output || b.p.input - a.p.input)[0];
    if (cheaper) out.push({ model: cheaper.m, why: "cheaper sibling" });
    const others = (["openai", "anthropic", "gemini"] as Provider[])
      .filter((p) => p !== provider)
      .flatMap(current)
      .map((m) => ({ m, p: priceOf(m, day)! }))
      .sort(
        (a, b) =>
          Math.abs(a.p.output - rp.output) - Math.abs(b.p.output - rp.output) ||
          a.p.output - b.p.output,
      )[0];
    if (others) out.push({ model: others.m, why: "another provider" });
  }
  return out;
}
