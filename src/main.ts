/**
 * `model-migrate` — which of the models your code calls are being retired, what replaces them,
 * and whether the replacement still answers your prompts the same way.
 *
 *   model-migrate scan [dir] [--json] [--offline]
 *   model-migrate capture <prompts.jsonl> --model <id> [--limit N] [--concurrency N] [--json]
 *   model-migrate compare [--from <id>] [--candidates a,b,c] [--limit N] [--json]
 *   model-migrate export --agentcheck [--from <id>] [--out <file>]
 *
 * `scan` reads files on this machine; its one request is a GET for the retirement data
 * (src/data.ts). `capture` and `compare` call the model providers on YOUR keys from the
 * environment and keep everything in `.model-migrate/`; nothing goes anywhere else. No account,
 * no telemetry, no LLM calls of ours.
 */
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { applyLimit, resolveProvider, runModel } from "./capture.js";
import { compare } from "./compare.js";
import { DATA_URL, PAGES_URL, loadData, type FetchLike } from "./data.js";
import { CliError, usage } from "./errors.js";
import { exportAgentcheck, uploadHint } from "./export.js";
import { INSTALL } from "./install.js";
import { readPrompts } from "./prompts.js";
import { keyFor } from "./providers.js";
import { renderError, renderJson, renderText } from "./render.js";
import { renderCapture, renderCompare } from "./render-runs.js";
import { scan } from "./scan.js";
import { capturedModels, writeCaptures } from "./store.js";
import { version } from "./version.js";

export const HELP = `model-migrate ${version()} — find the LLM models your code uses that are being retired, and test the replacements

Usage
  ${INSTALL} scan [dir]
      every model ID in dir (default: .) with a shutdown date: the date, the provider's
      replacement, the replacement's price ratio per token, the API changes it documents, a page
      per model
  ${INSTALL} scan [dir] --json
      the same, as JSON; --offline uses the bundled data, no request
  ${INSTALL} demo
      the same scan on a synthetic app shipped with this package, with the bundled data: reads
      nothing of yours and makes no request

  ${INSTALL} capture <prompts.jsonl> --model <id>
      run your prompts on the retiring model, on your own key, and keep its answers and token
      counts in .model-migrate/ (before its date: after it, nobody can). --limit N (default 100),
      --concurrency N
  ${INSTALL} compare [--from <id>] [--candidates a,b,c]
      replay them on the recommended replacement, a cheaper sibling and a model from another
      provider (or the 1-4 you name), on your keys: pass rate against the retiring model's answers
      (no LLM judge), measured cost per 1,000 calls, documented API changes
  ${INSTALL} export --agentcheck [--from <id>] [--out <file>]
      write the captures as traces agentcheck can import; sends nothing

Keys: OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY (or GOOGLE_API_KEY), your own, read from
the environment and sent only to that provider. Prompt file: one JSON object per line,
{"prompt": "..."} or {"messages": [...], "tools": [...], "expect": {...}}; see the README.

scan's one request: GET ${DATA_URL}. Nothing about your files is sent.
Every announced shutdown, by date: ${PAGES_URL}
`;

export interface Deps {
  stdout: (s: string) => void;
  stderr: (s: string) => void;
  fetch?: FetchLike;
  now?: () => Date;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  /** wait before retrying a provider call; tests pass 0 */
  retryDelayMs?: number;
}

const defaultDeps: Deps = {
  stdout: (s) => process.stdout.write(s),
  stderr: (s) => process.stderr.write(s),
};

export async function main(argv: string[], deps: Deps = defaultDeps): Promise<number> {
  const json = argv.includes("--json");
  try {
    return await run(argv, deps);
  } catch (e) {
    if (e instanceof CliError) {
      (json ? deps.stdout : deps.stderr)(renderError(e.toJSON(), json));
      return e.exitCode;
    }
    throw e;
  }
}

const COMMANDS = ["scan", "demo", "capture", "compare", "export"];

/** The package root: `demo` scans the synthetic app shipped in it (examples/demo-app). */
const PACKAGE_ROOT = fileURLToPath(new URL("..", import.meta.url));

function int(v: string | undefined, name: string): number | undefined {
  if (v === undefined) return undefined;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1)
    throw usage(`${name} must be a whole number`, `e.g. ${name} 50`);
  return n;
}

async function run(argv: string[], deps: Deps): Promise<number> {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        json: { type: "boolean" },
        offline: { type: "boolean" },
        model: { type: "string" },
        from: { type: "string" },
        candidates: { type: "string" },
        limit: { type: "string" },
        concurrency: { type: "string" },
        agentcheck: { type: "boolean" },
        out: { type: "string" },
        help: { type: "boolean", short: "h" },
        version: { type: "boolean", short: "v" },
      },
    });
  } catch (e) {
    throw usage(
      e instanceof Error ? e.message : String(e),
      `run \`${INSTALL} --help\` for the options`,
    );
  }
  const { values, positionals } = parsed;
  if (values.version) {
    deps.stdout(`${version()}\n`);
    return 0;
  }
  const [command, ...rest] = positionals;
  if (values.help || command === undefined || command === "help") {
    deps.stdout(HELP);
    return 0;
  }
  if (!COMMANDS.includes(command))
    throw usage(
      `unknown command "${command}"`,
      `the commands are ${COMMANDS.join(", ")}; run \`${INSTALL} --help\``,
    );

  const cwd = deps.cwd ?? process.cwd();
  const env = deps.env ?? process.env;
  const today = (deps.now?.() ?? new Date()).toISOString().slice(0, 10);
  const runOpts = {
    env,
    fetch: deps.fetch,
    now: deps.now,
    concurrency: int(values.concurrency, "--concurrency"),
    retryDelayMs: deps.retryDelayMs,
  };

  if (command === "scan") return runScan(rest, values, deps, cwd, today);

  if (command === "demo") {
    if (rest.length > 0) throw usage("demo takes no arguments", `run \`${INSTALL} demo\``);
    if (!values.json) deps.stdout("Synthetic app, written for this demo: not anyone's code.\n\n");
    const demo = { json: values.json, offline: true };
    return runScan(["examples/demo-app"], demo, deps, PACKAGE_ROOT, today);
  }

  if (command === "capture") {
    if (rest.length !== 1)
      throw usage(
        "capture takes one prompt file",
        `run \`${INSTALL} capture prompts.jsonl --model <retiring model>\``,
      );
    if (!values.model)
      throw usage("capture needs --model", "name the retiring model, e.g. --model gpt-5-mini");
    const model = values.model;
    const provider = resolveProvider(model);
    keyFor(provider, env); // fail before reading anything else
    const prompts = applyLimit(
      await readPrompts(path.resolve(cwd, rest[0]!)),
      int(values.limit, "--limit"),
    );
    const loaded = await loadData({ offline: values.offline, fetch: deps.fetch });
    const records = await runModel(model, prompts, runOpts);
    const file = await writeCaptures(cwd, model, records);
    deps.stdout(
      values.json
        ? JSON.stringify(
            {
              tool: "model-migrate",
              version: version(),
              command: "capture",
              model,
              provider,
              file,
              prompts: records.length,
              answered: records.filter((r) => r.result).length,
              errors: records.filter((r) => r.error).map((r) => ({ id: r.id, ...r.error })),
            },
            null,
            2,
          ) + "\n"
        : renderCapture(model, provider, records, file, loaded.data, today),
    );
    return 0;
  }

  const from = values.from ?? (await onlyCapture(cwd));

  if (command === "compare") {
    const loaded = await loadData({ offline: values.offline, fetch: deps.fetch });
    const candidates = values.candidates
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const report = await compare({
      cwd,
      retiring: from,
      candidates,
      data: loaded.data,
      today,
      limit: int(values.limit, "--limit"),
      run: runOpts,
    });
    deps.stdout(
      values.json
        ? JSON.stringify(
            { tool: "model-migrate", version: version(), command: "compare", today, ...report },
            null,
            2,
          ) + "\n"
        : renderCompare(report, loaded.data, today),
    );
    return 0;
  }

  // export
  if (!values.agentcheck)
    throw usage("export needs a format", "the format in this version is --agentcheck");
  const { file, traces } = await exportAgentcheck(cwd, from, values.out);
  deps.stdout(
    values.json
      ? JSON.stringify(
          {
            tool: "model-migrate",
            version: version(),
            command: "export",
            format: "agentcheck",
            file,
            traces,
          },
          null,
          2,
        ) + "\n"
      : `model-migrate ${version()} · wrote ${traces} trace${traces === 1 ? "" : "s"} of ${from} to ${file}\n\n${uploadHint(file)}\n`,
  );
  return 0;
}

/** `--from` defaults to the one model captured so far. */
async function onlyCapture(cwd: string): Promise<string> {
  const models = await capturedModels(cwd);
  if (models.length === 1) return models[0]!;
  throw usage(
    models.length
      ? `${models.length} captures in .model-migrate/: ${models.join(", ")}`
      : "no capture in .model-migrate/ yet",
    models.length
      ? "name the retiring model: --from <model>"
      : `run \`${INSTALL} capture prompts.jsonl --model <retiring model>\` first`,
  );
}

async function runScan(
  rest: string[],
  values: { json?: boolean; offline?: boolean },
  deps: Deps,
  cwd: string,
  today: string,
): Promise<number> {
  if (rest.length > 1)
    throw usage(`scan takes one directory, got ${rest.length}`, `run \`${INSTALL} scan [dir]\``);
  const shownRoot = rest[0] ?? ".";
  const root = path.resolve(cwd, shownRoot);
  let info;
  try {
    info = await stat(root);
  } catch {
    throw new CliError({
      code: "DIR_NOT_FOUND",
      cause: `no file or directory at ${shownRoot}`,
      fix: `pass the directory that holds your code, e.g. \`${INSTALL} scan .\``,
      retryable: false,
    });
  }
  if (!info.isDirectory())
    throw new CliError({
      code: "NOT_A_DIRECTORY",
      cause: `${shownRoot} is a file, not a directory`,
      fix: `pass the directory that holds it, e.g. \`${INSTALL} scan .\``,
      retryable: false,
    });
  const loaded = await loadData({ offline: values.offline, fetch: deps.fetch });
  const result = await scan(root, loaded.data, today);
  deps.stdout((values.json ? renderJson : renderText)(result, loaded, today, shownRoot));
  return 0;
}
