/**
 * `scan`: find the model IDs in a directory's code and config that have a shutdown date.
 *
 * Reads JS/TS, Python, YAML and JSON files and `.env` files, on this machine only. From a `.env`
 * file it reports the variable's NAME and never its value. Nothing read here leaves the machine,
 * and no line of a file is ever printed: a finding is a file and a line number.
 */
import { opendir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import type { Dataset, Retirement } from "./data.js";

const CODE_EXT = new Set([
  ".js",
  ".mjs",
  ".cjs",
  ".jsx",
  ".ts",
  ".mts",
  ".cts",
  ".tsx",
  ".py",
  ".yaml",
  ".yml",
  ".json",
]);
/** Directories that hold someone else's code, build output or our own captures. */
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".hg",
  ".svn",
  "dist",
  "build",
  "out",
  ".next",
  ".nuxt",
  ".turbo",
  ".vercel",
  "coverage",
  ".venv",
  "venv",
  "env",
  "__pycache__",
  ".mypy_cache",
  ".pytest_cache",
  ".tox",
  "site-packages",
  "vendor",
  ".model-migrate",
]);
const SKIP_FILES = new Set(["package-lock.json", "pnpm-lock.yaml", "npm-shrinkwrap.json"]);
const MAX_FILE_BYTES = 1_000_000;
const MAX_FILES = 50_000;

export interface Location {
  /** relative to the scanned directory, with forward slashes */
  file: string;
  line: number;
  /** for `.env` files: the variable's name (its value is never read out) */
  envName?: string;
  /** sampling parameters this file also sets, for breaks that concern them */
  sampling?: string[];
}

export interface Finding {
  entry: Retirement;
  /** the strings found in the code that name this entry */
  names: string[];
  matchedAs: "id" | "alias" | "fine-tune";
  locations: Location[];
}

export interface ScanResult {
  root: string;
  filesRead: number;
  /** files over 1 MB, unreadable, or past the 50,000-file limit */
  filesSkipped: number;
  findings: Finding[];
}

export function isEnvFile(name: string): boolean {
  return name === ".env" || name.startsWith(".env.");
}

export function isScannable(name: string): boolean {
  if (SKIP_FILES.has(name)) return false;
  return isEnvFile(name) || CODE_EXT.has(path.extname(name).toLowerCase());
}

/** Every scannable file under `root`, depth first, never following a symlink. */
async function* walk(root: string): AsyncGenerator<string> {
  const dir = await opendir(root);
  for await (const d of dir) {
    if (d.isSymbolicLink()) continue;
    const full = path.join(root, d.name);
    if (d.isDirectory()) {
      if (!SKIP_DIRS.has(d.name)) yield* walk(full);
    } else if (d.isFile() && isScannable(d.name)) {
      yield full;
    }
  }
}

interface Target {
  entry: Retirement;
  matchedAs: Finding["matchedAs"];
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * The matcher for one dataset. An ID counts only as a whole token: not inside a longer ID
 * (`gpt-4` in `gpt-4o`, `gpt-4.1` or `gpt-4-turbo`), not in Amazon Bedrock's
 * `anthropic.claude-…-v1:0` or Google Cloud's `claude-…@date` forms (those platforms set their own
 * dates), and an ID with no hyphen (`o1`, `o3`) only where it is plainly a value: quoted, or after
 * `=`, `:` or `/`.
 */
export function makeMatcher(data: Dataset) {
  const byName = new Map<string, Target[]>();
  const add = (name: string, t: Target) => byName.set(name, [...(byName.get(name) ?? []), t]);
  for (const entry of data.entries) {
    if (entry.kind === "fine-tune") continue;
    add(entry.id, { entry, matchedAs: "id" });
    for (const a of entry.aliases) add(a, { entry, matchedAs: "alias" });
  }
  const names = [...byName.keys()].sort((a, b) => b.length - a.length);
  const re = new RegExp(
    `(?<![A-Za-z0-9_.@:-])(${names.map(escape).join("|")})(?![A-Za-z0-9_.@]|-[A-Za-z0-9])`,
    "g",
  );
  const finetunes = data.entries.flatMap((entry) =>
    (entry.finetunePrefixes ?? []).map((prefix) => ({ entry, prefix })),
  );

  return function matchLine(text: string): { name: string; targets: Target[] }[] {
    const out: { name: string; targets: Target[] }[] = [];
    for (const m of text.matchAll(re)) {
      const name = m[1]!;
      if (!name.includes("-") && !plainlyAValue(text, m.index, name.length)) continue;
      out.push({ name, targets: byName.get(name)! });
    }
    let at = text.indexOf("ft:");
    while (at >= 0) {
      const rest = text.slice(at);
      const hits = finetunes
        .filter((f) => rest.startsWith(f.prefix))
        .map((f): Target => ({ entry: f.entry, matchedAs: "fine-tune" }));
      if (hits.length) out.push({ name: rest.split(/[^A-Za-z0-9_.:-]/)[0]!, targets: hits });
      at = text.indexOf("ft:", at + 3);
    }
    return out;
  };
}

/**
 * For an ID with no hyphen: quoted on both sides (`"o3"`), or the whole value after `=` or `:`
 * (`MODEL=o3`, `model: o3`), or after a router prefix (`"openai/o3"`). `x = o3 * 2` is code.
 */
function plainlyAValue(text: string, index: number, length: number): boolean {
  const before = text.slice(0, index).trimEnd();
  const prev = before.charAt(before.length - 1);
  const after = text.slice(index + length);
  const next = after.charAt(0);
  if (/["'`]/.test(prev)) return next === prev;
  const tail = after.trim();
  const lineEnds = tail === "" || tail.startsWith("#") || tail.startsWith("//");
  if (prev === "=" || prev === ":") return lineEnds;
  if (prev === "/") return /["'`]/.test(next) || lineEnds;
  return false;
}

const SAMPLING = /\b(temperature|top_p|top_k|topP|topK)\b/g;

function samplingIn(text: string): string[] {
  return [...new Set([...text.matchAll(SAMPLING)].map((m) => m[1]!))].sort();
}

/** Scan one file's text. `file` is only a label. */
export function scanText(
  file: string,
  text: string,
  matchLine: ReturnType<typeof makeMatcher>,
): { entry: Retirement; name: string; matchedAs: Finding["matchedAs"]; location: Location }[] {
  const env = isEnvFile(path.basename(file));
  const out: ReturnType<typeof scanText> = [];
  const lines = text.split(/\r?\n/);
  let sampling: string[] | undefined;
  lines.forEach((raw, i) => {
    let value = raw;
    let envName: string | undefined;
    if (env) {
      const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_.-]*)\s*=\s*(.*)$/.exec(raw);
      if (!m || raw.trimStart().startsWith("#")) return;
      envName = m[1]!;
      value = m[2]!;
    }
    for (const hit of matchLine(value)) {
      sampling ??= env ? [] : samplingIn(text);
      for (const { entry, matchedAs } of hit.targets) {
        out.push({
          entry,
          name: hit.name,
          matchedAs,
          location: {
            file,
            line: i + 1,
            ...(envName ? { envName } : {}),
            ...(sampling.length ? { sampling } : {}),
          },
        });
      }
    }
  });
  return out;
}

/** Shut down first (they fail now), most recent first; then upcoming, soonest first. */
export function byUrgency(today: string) {
  return (a: Finding, b: Finding): number => {
    const pa = a.entry.shutdown <= today;
    const pb = b.entry.shutdown <= today;
    if (pa !== pb) return pa ? -1 : 1;
    const d = pa
      ? b.entry.shutdown.localeCompare(a.entry.shutdown)
      : a.entry.shutdown.localeCompare(b.entry.shutdown);
    return (
      d || a.entry.provider.localeCompare(b.entry.provider) || a.entry.id.localeCompare(b.entry.id)
    );
  };
}

export async function scan(root: string, data: Dataset, today: string): Promise<ScanResult> {
  const matchLine = makeMatcher(data);
  const found = new Map<string, Finding>();
  let filesRead = 0;
  let filesSkipped = 0;
  for await (const file of walk(root)) {
    if (filesRead >= MAX_FILES) {
      filesSkipped += 1;
      continue;
    }
    let text: string;
    try {
      if ((await stat(file)).size > MAX_FILE_BYTES) {
        filesSkipped += 1;
        continue;
      }
      text = await readFile(file, "utf8");
    } catch {
      filesSkipped += 1;
      continue;
    }
    filesRead += 1;
    const rel = path.relative(root, file).split(path.sep).join("/");
    for (const hit of scanText(rel, text, matchLine)) {
      const key = `${hit.entry.provider}/${hit.entry.id}`;
      const f = found.get(key) ?? {
        entry: hit.entry,
        names: [],
        matchedAs: hit.matchedAs,
        locations: [],
      };
      if (!f.names.includes(hit.name)) f.names.push(hit.name);
      if (!f.locations.some((l) => l.file === rel && l.line === hit.location.line))
        f.locations.push(hit.location);
      found.set(key, f);
    }
  }
  const findings = [...found.values()].sort(byUrgency(today));
  for (const f of findings)
    f.locations.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
  return { root, filesRead, filesSkipped, findings };
}
