/** What `capture`, `compare` and `export` print. */
import type { Dataset } from "./data.js";
import { INSTALL } from "./install.js";
import { daysUntil, shortDate } from "./render.js";
import { findEntry, CATALOG_SEEN } from "./catalog.js";
import type { CompareReport, Tokens } from "./compare.js";
import { STORE_DIR, type CaptureRecord } from "./store.js";
import { meanTokens } from "./compare.js";
import { version } from "./version.js";

const PROVIDER_NAME = { openai: "OpenAI", anthropic: "Anthropic", gemini: "Gemini API" } as const;

const money = (x: number | null) =>
  x === null
    ? "no list price"
    : `$${x < 10 ? x.toFixed(2) : Math.round(x).toLocaleString("en-US")}`;
const tok = (t: Tokens | null) => (t ? `${t.mean_input} in / ${t.mean_output} out` : "-");

function deadline(model: string, data: Dataset, today: string): string | null {
  const e = findEntry(data, model);
  if (!e) return null;
  const d = daysUntil(e, today);
  return d > 0
    ? `${model} shuts down ${shortDate(e.shutdown)}, in ${d} day${d === 1 ? "" : "s"}.`
    : `${model} was due to shut down ${shortDate(e.shutdown)}.`;
}

export function renderCapture(
  model: string,
  provider: keyof typeof PROVIDER_NAME,
  records: CaptureRecord[],
  file: string,
  data: Dataset,
  today: string,
): string {
  const ok = records.filter((r) => r.result).length;
  const failed = records.filter((r) => r.error);
  const out = [
    `model-migrate ${version()} · captured ${records.length} prompt${records.length === 1 ? "" : "s"} on ${model} (${PROVIDER_NAME[provider]}, your key)`,
    "",
    `  answered     ${ok} of ${records.length}${failed.length ? `; ${failed.length} failed` : ""}`,
    `  tokens       ${tok(meanTokens(records))} per call (mean, as ${PROVIDER_NAME[provider]} reported them)`,
    `  saved        ${file} (prompts and answers stay on this machine; ${STORE_DIR}/ has its own .gitignore)`,
  ];
  for (const f of failed.slice(0, 3))
    out.push(`  failed       ${f.id}: ${f.error!.code}: ${f.error!.cause}`);
  out.push("");
  const when = deadline(model, data, today);
  if (when) out.push(when);
  out.push(`Next: ${INSTALL} compare --from ${model}`);
  return out.join("\n") + "\n";
}

export function renderCompare(r: CompareReport, data: Dataset, today: string): string {
  const ran = r.candidates.filter((c) => c.status === "ran");
  const out = [
    `model-migrate ${version()} · ${r.retiring.answered} prompt${r.retiring.answered === 1 ? "" : "s"} captured on ${r.retiring.model}, replayed on ${ran.length} candidate${ran.length === 1 ? "" : "s"} (your keys)`,
    "",
  ];
  // a skipped candidate's reason runs on past the columns it has no numbers for
  const rows: { cells: string[]; skipped?: string }[] = [
    { cells: ["model", "why", "pass rate", "cost / 1,000 calls", "tokens per call"] },
    {
      cells: [
        r.retiring.model,
        "retiring",
        "baseline",
        money(r.retiring.cost_per_1000_calls),
        tok(r.retiring.tokens),
      ],
    },
    ...r.candidates.map((c) =>
      c.status === "skipped"
        ? { cells: [c.model, c.why], skipped: `skipped: ${c.skipped_reason}` }
        : {
            cells: [
              c.model,
              c.why,
              c.pass_rate === null ? "-" : `${c.passed}/${c.compared} (${c.pass_rate}%)`,
              money(c.cost_per_1000_calls),
              tok(c.tokens),
            ],
          },
    ),
  ];
  const widths = [0, 1, 2, 3, 4].map((i) =>
    Math.max(...rows.map((row) => (row.cells[i] ?? "").length)),
  );
  for (const row of rows) {
    const cells = row.cells.map((cell, i) => cell.padEnd(widths[i]!));
    out.push(`  ${[...cells, ...(row.skipped ? [row.skipped] : [])].join("  ")}`.trimEnd());
  }
  out.push("");

  for (const c of ran) {
    if (c.failures.length) {
      out.push(
        `${c.model}: ${c.compared - c.passed} did not pass (${c.failures.map((f) => `${f.check} ${f.count}`).join(", ")})`,
      );
      for (const ex of c.examples) out.push(`  ${ex.id}: ${ex.detail}`);
    } else {
      out.push(`${c.model}: every prompt passed`);
    }
    for (const b of c.breaks) out.push(`  documented change: ${b.text}`);
    if (c.capture_file) out.push(`  answers saved to ${c.capture_file}`);
    out.push("");
  }

  out.push(
    `Pass = every check that applies holds against ${r.retiring.model}'s answer: JSON and schema, tool calls and`,
    "argument names, no new refusal, length within 0.5-2x, and the same label for short answers. No LLM judge.",
    `Cost = the mean tokens each provider reported for these prompts x its list price (read ${shortDate(CATALOG_SEEN)});`,
    "cached input and batch discounts are not counted.",
  );
  const when = deadline(r.retiring.model, data, today);
  if (when) out.push("", when);
  const page =
    r.retiring.page_url ?? "https://agentwares-agentcheck.vercel.app/models?ref=model-migrate";
  out.push(
    `To re-run these on your own endpoint whenever a provider ships a model, with history: agentcheck, ${page}#agentcheck`,
  );
  return out.join("\n") + "\n";
}
