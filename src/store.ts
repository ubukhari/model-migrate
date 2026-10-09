/**
 * Captures live in `.model-migrate/` in the directory you run from: one JSONL file per model, one
 * line per prompt with the request, the model's answer and the token counts the provider reported.
 * The directory gets its own `.gitignore` (`*`), since prompts and answers can be sensitive. Nothing
 * here is sent anywhere.
 */
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { CliError, type Problem } from "./errors.js";
import { INSTALL } from "./install.js";
import type { Expect } from "./prompts.js";
import type { CallResult, Message, Provider, ToolSpec } from "./providers.js";

export const STORE_DIR = ".model-migrate";

export interface CaptureRecord {
  id: string;
  model: string;
  provider: Provider;
  /** ISO time of the call */
  at: string;
  request: { messages: Message[]; tools?: ToolSpec[]; max_tokens: number };
  expect?: Expect;
  result?: CallResult;
  error?: Problem;
  latency_ms: number;
}

/** `gpt-5-mini` → `gpt-5-mini.jsonl`; `ft:…:acme::x` → `ft_…_acme__x.jsonl`. */
export function fileFor(model: string): string {
  return `${model.replace(/[^A-Za-z0-9._-]/g, "_")}.jsonl`;
}

/**
 * A capture goes to `.model-migrate/<model>.jsonl`; a candidate's replay of it (from `compare`)
 * to `.model-migrate/replays/<retiring>/<candidate>.jsonl`, so captures stay one per model.
 */
export async function writeCaptures(
  cwd: string,
  model: string,
  records: CaptureRecord[],
  replayOf?: string,
): Promise<string> {
  const root = path.join(cwd, STORE_DIR);
  await mkdir(root, { recursive: true });
  await writeFile(path.join(root, ".gitignore"), "*\n");
  const dir = replayOf ? path.join(root, "replays", fileFor(replayOf).slice(0, -6)) : root;
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, fileFor(model));
  await writeFile(file, records.map((r) => JSON.stringify(r)).join("\n") + "\n");
  return path.relative(cwd, file).split(path.sep).join("/");
}

export async function readCaptures(cwd: string, model: string): Promise<CaptureRecord[]> {
  const file = path.join(cwd, STORE_DIR, fileFor(model));
  let text: string;
  try {
    text = await readFile(file, "utf8");
  } catch {
    throw new CliError({
      code: "NO_CAPTURE",
      cause: `no capture for ${model} in ${STORE_DIR}/`,
      fix: `run \`${INSTALL} capture <prompts.jsonl> --model ${model}\` first, while the model still answers`,
      retryable: false,
    });
  }
  return text
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as CaptureRecord);
}

/** The models captured so far (file names back to model IDs where they round-trip). */
export async function capturedModels(cwd: string): Promise<string[]> {
  try {
    const names = await readdir(path.join(cwd, STORE_DIR));
    return names.filter((n) => n.endsWith(".jsonl")).map((n) => n.slice(0, -".jsonl".length));
  } catch {
    return [];
  }
}
