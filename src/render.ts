/** What `scan` prints: text for a person, `--json` for a program. */
import {
  PAGES_URL,
  type Dataset,
  type LoadedData,
  type PriceComparison,
  type Retirement,
} from "./data.js";
import type { Problem } from "./errors.js";
import type { Finding, Location, ScanResult } from "./scan.js";
import { version } from "./version.js";

const DAY_MS = 86_400_000;
const SHORT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function shortDate(iso: string): string {
  return SHORT.format(new Date(`${iso}T00:00:00Z`)).replace("Sept", "Sep");
}

export function daysUntil(e: Retirement, today: string): number {
  return Math.round(
    (Date.parse(`${e.shutdown}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / DAY_MS,
  );
}

/** The page on agentcheck, tagged so a visit from the terminal is counted as one. */
export function pageUrl(e: Retirement): string {
  return `${PAGES_URL}/${e.provider}/${e.id}?ref=model-migrate`;
}

export function times(x: number): string {
  const v = x >= 10 ? Math.round(x) : x >= 1 ? Math.round(x * 10) / 10 : Math.round(x * 100) / 100;
  return `${v}×`;
}

function period(p: PriceComparison): string {
  if (p.until) return ` until ${shortDate(p.until)}`;
  if (p.from) return ` from ${shortDate(p.from)}`;
  return "";
}

function when(e: Retirement, today: string): string {
  const d = daysUntil(e, today);
  const earliest = e.shutdownIsEarliest ? " (earliest possible date)" : "";
  if (d > 0) return `${shortDate(e.shutdown)}, in ${d} day${d === 1 ? "" : "s"}${earliest}`;
  if (d === 0) return `${shortDate(e.shutdown)}, today${earliest}`;
  return `${shortDate(e.shutdown)}, ${-d} day${d === -1 ? "" : "s"} ago${earliest}: requests to it now fail`;
}

function place(l: Location): string {
  return l.envName ? `${l.file} (${l.envName})` : `${l.file}:${l.line}`;
}

/** Wrap `items` joined by ", " at `width`, continuing lines under `indent`. */
function wrap(items: string[], indent: string, width = 100): string {
  const lines: string[] = [];
  let cur = "";
  for (const item of items) {
    const next = cur ? `${cur}, ${item}` : item;
    if (cur && indent.length + next.length > width) {
      lines.push(`${cur},`);
      cur = item;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines.join(`\n${indent}`);
}

const PAD = "               ";

function findingText(f: Finding, data: Dataset, today: string): string {
  const e = f.entry;
  const p = data.providers[e.provider];
  const out: string[] = [];
  const named = f.names.join(", ");
  out.push(named === e.id ? `${e.id}  ·  ${p.platform}` : `${named} → ${e.id}  ·  ${p.platform}`);
  out.push(`  shutdown     ${when(e, today)}`);
  const repl = e.replacements.length
    ? e.replacements.join(" or ") + (e.replacementNote ? ` (${e.replacementNote})` : "")
    : (e.replacementNote ?? "none named");
  out.push(`  replacement  ${repl}`);
  if (e.prices.length) {
    e.prices.forEach((pr, i) => {
      const label = i === 0 ? "  price        " : PAD;
      const promo = pr.note && /promotional/i.test(pr.note) ? ", at its promotional price" : "";
      out.push(
        `${label}${pr.replacement}: ${times(pr.ratio.input)} input, ${times(pr.ratio.output)} output per token${period(pr)}${promo}`,
      );
    });
  } else if (e.kind === "fine-tune") {
    out.push("  price        no ratio: the replacement for a fine-tune is a base model");
  } else {
    out.push(`  price        no ratio: ${e.priceNote ?? "not listed"}`);
  }
  if (e.breaks.length) {
    e.breaks.forEach((b, i) => out.push(`${i === 0 ? "  breaks       " : PAD}${b.short}`));
    const sampling = [...new Set(f.locations.flatMap((l) => l.sampling ?? []))];
    const concerned = e.breaks.some((b) => /temperature|top_p/.test(b.text));
    if (concerned && sampling.length) {
      const files = [...new Set(f.locations.filter((l) => l.sampling).map((l) => l.file))];
      out.push(`${PAD}this code sets ${sampling.join(", ")} in ${files.join(", ")}`);
    }
  } else {
    out.push(`  breaks       none documented by ${p.name}`);
  }
  out.push(`  found in     ${wrap(f.locations.map(place), PAD)}`);
  out.push(`  details      ${pageUrl(e)}`);
  return out.join("\n");
}

export function renderText(
  result: ScanResult,
  loaded: LoadedData,
  today: string,
  shownRoot: string,
): string {
  const { data } = loaded;
  const head = `model-migrate ${version()} · scanned ${result.filesRead} file${result.filesRead === 1 ? "" : "s"} in ${shownRoot} · retirement data checked ${shortDate(data.updated)} (${loaded.source})`;
  const out = [head, ""];
  for (const w of loaded.warnings) out.push(`warning ${w.code}: ${w.cause}`, `  fix: ${w.fix}`, "");
  const n = result.findings.length;
  if (n === 0) {
    out.push(
      "No model ID in these files has an announced shutdown on the OpenAI API, Claude API, Gemini API",
      "or Vertex AI pages this data is built from (language models only).",
      "",
      `Every announced shutdown, by date: ${PAGES_URL}`,
    );
    return out.join("\n") + "\n";
  }
  const shut = result.findings.filter((f) => f.entry.shutdown <= today).length;
  out.push(
    `${n} model${n === 1 ? "" : "s"} in this code ${n === 1 ? "has" : "have"} a shutdown date${shut ? ` (${shut} already shut down)` : ""}:`,
    "",
  );
  for (const f of result.findings) out.push(findingText(f, data, today), "");
  if (shut < n)
    out.push(
      "Record each retiring model's answers on your own prompts before its date: after it, nobody can.",
    );
  out.push(
    `Dates and replacements come from each provider's own deprecation page; prices from its pricing page.`,
  );
  return out.join("\n") + "\n";
}

export function renderJson(
  result: ScanResult,
  loaded: LoadedData,
  today: string,
  shownRoot: string,
): string {
  const { data } = loaded;
  return (
    JSON.stringify(
      {
        tool: "model-migrate",
        version: version(),
        command: "scan",
        today,
        scanned: {
          root: shownRoot,
          files_read: result.filesRead,
          files_skipped: result.filesSkipped,
        },
        data: { source: loaded.source, updated: data.updated, scope: data.scope },
        findings: result.findings.map((f) => {
          const e = f.entry;
          return {
            names: f.names,
            provider: e.provider,
            platform: data.providers[e.provider].platform,
            model_id: e.id,
            matched_as: f.matchedAs,
            status: e.shutdown <= today ? "shut_down" : "retiring",
            shutdown_date: e.shutdown,
            shutdown_is_earliest_possible: e.shutdownIsEarliest,
            days_until_shutdown: daysUntil(e, today),
            replacements: e.replacements,
            ...(e.replacementNote ? { replacement_note: e.replacementNote } : {}),
            price_ratios: e.prices.map((p) => ({
              replacement: p.replacement,
              input: p.ratio.input,
              output: p.ratio.output,
              ...(p.from ? { from: p.from } : {}),
              ...(p.until ? { until: p.until } : {}),
            })),
            ...(e.priceNote ? { price_note: e.priceNote } : {}),
            breaks: e.breaks.map((b) => ({ text: b.text, source: b.source })),
            source_url: e.source,
            page_url: pageUrl(e),
            locations: f.locations.map((l) => ({
              file: l.file,
              line: l.line,
              ...(l.envName ? { env_name: l.envName } : {}),
              ...(l.sampling ? { sets: l.sampling } : {}),
            })),
          };
        }),
        warnings: loaded.warnings,
      },
      null,
      2,
    ) + "\n"
  );
}

export function renderError(e: Problem, json: boolean): string {
  if (json) return JSON.stringify({ error: e }, null, 2) + "\n";
  return `model-migrate: ${e.code}: ${e.cause}\n  fix: ${e.fix}\n`;
}
