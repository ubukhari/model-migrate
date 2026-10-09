/**
 * The retirement data: the live copy from agentcheck, or the copy bundled with this version.
 *
 * The one network request this CLI makes is `GET <DATA_URL>`, with no body, no query string and
 * nothing about your files. `--offline` skips it. When the request fails, or answers with
 * something that is not this data, the bundled copy is used and a warning says so.
 */
import bundledJson from "./data/retirements.json" with { type: "json" };
import type { Problem } from "./errors.js";
import { version } from "./version.js";

export const DATA_URL = "https://agentwares-agentcheck.vercel.app/models/retirements.json";
export const PAGES_URL = "https://agentwares-agentcheck.vercel.app/models";
const TIMEOUT_MS = 8_000;

export type ProviderKey = "openai" | "anthropic" | "gemini-api" | "vertex-ai";

export interface Price {
  input: number;
  output: number;
}

export interface PriceComparison {
  replacement: string;
  retiring: Price;
  replacementPrice: Price;
  ratio: Price;
  from?: string;
  until?: string;
  note?: string;
}

export interface Retirement {
  provider: ProviderKey;
  id: string;
  aliases: string[];
  kind: "model" | "fine-tune";
  finetunePrefixes?: string[];
  announced: string | null;
  shutdown: string;
  shutdownIsEarliest: boolean;
  replacements: string[];
  replacementNote?: string;
  source: string;
  seen: string;
  prices: PriceComparison[];
  priceNote?: string;
  breaks: { short: string; text: string; source: string }[];
  notes: string[];
}

export interface Dataset {
  version: 1;
  updated: string;
  windowStart: string;
  scope: string;
  priceBasis: string;
  providers: Record<ProviderKey, { name: string; platform: string; deprecations: string }>;
  entries: Retirement[];
}

export const BUNDLED = bundledJson as unknown as Dataset;

export interface LoadedData {
  data: Dataset;
  source: "live" | "bundled";
  warnings: Problem[];
}

export type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

/** Enough of the shape to trust: a version 1 document whose entries carry what the CLI prints. */
export function isDataset(x: unknown): x is Dataset {
  if (!x || typeof x !== "object") return false;
  const d = x as Partial<Dataset>;
  return (
    d.version === 1 &&
    typeof d.updated === "string" &&
    !!d.providers &&
    Array.isArray(d.entries) &&
    d.entries.every(
      (e) =>
        typeof e?.id === "string" &&
        typeof e.shutdown === "string" &&
        Array.isArray(e.aliases) &&
        Array.isArray(e.replacements) &&
        Array.isArray(e.prices) &&
        Array.isArray(e.breaks) &&
        !!d.providers?.[e.provider],
    )
  );
}

export async function loadData(opts: {
  offline?: boolean;
  fetch?: FetchLike;
  url?: string;
}): Promise<LoadedData> {
  if (opts.offline) return { data: BUNDLED, source: "bundled", warnings: [] };
  const url = opts.url ?? DATA_URL;
  const doFetch = opts.fetch ?? fetch;
  let why: string;
  try {
    const res = await doFetch(url, {
      headers: { accept: "application/json", "user-agent": `model-migrate/${version()}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) {
      const body: unknown = await res.json();
      if (isDataset(body)) {
        // never step back to older data than this version shipped with
        if (body.updated >= BUNDLED.updated) return { data: body, source: "live", warnings: [] };
        return { data: BUNDLED, source: "bundled", warnings: [] };
      }
      why = `${url} answered with a document that is not retirement data (version 1)`;
    } else {
      why = `${url} answered HTTP ${res.status}`;
    }
  } catch (e) {
    why = `GET ${url} failed: ${e instanceof Error ? e.message : String(e)}`;
  }
  return {
    data: BUNDLED,
    source: "bundled",
    warnings: [
      {
        code: "DATA_FETCH_FAILED",
        cause: `${why}; using the data bundled with model-migrate ${version()} (checked ${BUNDLED.updated})`,
        fix: "retry for the latest dates, or pass --offline to use the bundled data without the request",
        retryable: true,
      },
    ],
  };
}
