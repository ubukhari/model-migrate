import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BUNDLED, DATA_URL, isDataset, loadData, type FetchLike } from "./data.js";
import { main } from "./main.js";

const NOW = () => new Date("2026-10-08T12:00:00Z");
const PKG = path.resolve(import.meta.dirname, "..");

/** Run the CLI in-process with a recorded fetch; returns exit code, stdout, stderr and requests. */
async function run(argv: string[], fetchImpl?: FetchLike) {
  let stdout = "";
  let stderr = "";
  const requests: string[] = [];
  const fetch: FetchLike = async (url, init) => {
    requests.push(url);
    if (!fetchImpl) throw new Error("no network in tests");
    return fetchImpl(url, init);
  };
  const code = await main(argv, {
    stdout: (s) => (stdout += s),
    stderr: (s) => (stderr += s),
    fetch,
    now: NOW,
    cwd: PKG,
  });
  return { code, stdout, stderr, requests };
}

const serve =
  (body: unknown, status = 200): FetchLike =>
  async () =>
    new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("scan", () => {
  it("--json gives every finding with its facts and locations, and makes one GET for the data", async () => {
    const r = await run(["scan", "examples/demo-app", "--json"], serve(BUNDLED));
    expect(r.code).toBe(0);
    expect(r.requests).toEqual([DATA_URL]);
    const out = JSON.parse(r.stdout);
    expect(out).toMatchObject({
      tool: "model-migrate",
      command: "scan",
      today: "2026-10-08",
      scanned: { root: "examples/demo-app", files_read: 4, files_skipped: 0 },
      data: { source: "live", updated: BUNDLED.updated },
      warnings: [],
    });
    const mini = out.findings.find(
      (f: { model_id: string }) => f.model_id === "gpt-5-mini-2025-08-07",
    );
    expect(mini).toMatchObject({
      names: ["gpt-5-mini"],
      provider: "openai",
      status: "retiring",
      shutdown_date: "2026-12-11",
      days_until_shutdown: 64,
      replacements: ["gpt-5.6-terra"],
      price_ratios: [{ replacement: "gpt-5.6-terra", input: 8, output: 6 }],
      source_url: "https://developers.openai.com/api/docs/deprecations",
      page_url:
        "https://agentwares-agentcheck.vercel.app/models/openai/gpt-5-mini-2025-08-07?ref=model-migrate",
      locations: [
        { file: ".env.example", line: 3, env_name: "SUMMARY_MODEL" },
        { file: "src/summarize.ts", line: 8 },
      ],
    });
  });

  it("--offline makes no request at all", async () => {
    const r = await run(["scan", "examples/demo-app", "--offline", "--json"]);
    expect(r.code).toBe(0);
    expect(r.requests).toEqual([]);
    expect(JSON.parse(r.stdout).data.source).toBe("bundled");
  });

  it("when the data request fails it uses the bundled copy and says so, with code, cause, fix and retryable", async () => {
    const r = await run(["scan", "examples/demo-app", "--json"], serve({ nope: true }, 503));
    expect(r.code).toBe(0);
    const out = JSON.parse(r.stdout);
    expect(out.data.source).toBe("bundled");
    expect(out.warnings[0]).toMatchObject({ code: "DATA_FETCH_FAILED", retryable: true });
    expect(out.warnings[0].cause).toContain("HTTP 503");
    expect(out.warnings[0].fix).toContain("--offline");
    expect(out.findings.length).toBe(5);
  });

  it("text output names the date, the replacement, the ratio and the page, and never a line of the file", async () => {
    const r = await run(["scan", "examples/demo-app", "--offline"]);
    expect(r.stdout).toContain("5 models in this code have a shutdown date");
    expect(r.stdout).toContain("gpt-5-mini → gpt-5-mini-2025-08-07");
    expect(r.stdout).toContain("11 Dec 2026, in 64 days");
    expect(r.stdout).toContain("gpt-5.6-terra: 8× input, 6× output per token");
    expect(r.stdout).toContain("this code sets temperature in src/agent.py");
    // no source text: not the prompt, not the env value
    expect(r.stdout).not.toContain("Summarize in two sentences");
    expect(r.stdout).not.toContain("SUMMARY_MODEL=gpt-5-mini");
  });

  it("says so when nothing is retiring", async () => {
    const r = await run(["scan", "scripts", "--offline"]);
    expect(r.code).toBe(0);
    expect(r.stdout).toContain("No model ID in these files has an announced shutdown");
  });
});

describe("errors carry code, cause, fix and retryable", () => {
  it.each([
    [["scan", "no/such/dir"], "DIR_NOT_FOUND", 1],
    [["scan", "package.json"], "NOT_A_DIRECTORY", 1],
    [["capture"], "BAD_ARGUMENTS", 2],
    [["scan", "a", "b"], "BAD_ARGUMENTS", 2],
    [["scan", "--nope"], "BAD_ARGUMENTS", 2],
  ] as const)("%j → %s", async (argv, code, exit) => {
    const r = await run([...argv, "--json"]);
    expect(r.code).toBe(exit);
    const { error } = JSON.parse(r.stdout);
    expect(error.code).toBe(code);
    expect(typeof error.cause).toBe("string");
    expect(typeof error.fix).toBe("string");
    expect(typeof error.retryable).toBe("boolean");
    expect(r.requests).toEqual([]);
  });

  it("in text mode the error goes to stderr", async () => {
    const r = await run(["scan", "no/such/dir"]);
    expect(r.stdout).toBe("");
    expect(r.stderr).toContain("DIR_NOT_FOUND");
    expect(r.stderr).toContain("fix:");
  });
});

describe("data", () => {
  it("the bundled copy is a valid dataset", () => {
    expect(isDataset(BUNDLED)).toBe(true);
    expect(isDataset({ version: 2, entries: [] })).toBe(false);
  });

  it("never steps back to data older than the bundled copy", async () => {
    const older = { ...BUNDLED, updated: "2026-01-01" };
    const loaded = await loadData({ fetch: serve(older) });
    expect(loaded.source).toBe("bundled");
    expect(loaded.warnings).toEqual([]);
  });

  const canonical = path.resolve(PKG, "../agentcheck/src/app/models/_data/retirements.json");
  it.skipIf(!existsSync(canonical))(
    "the bundled copy equals the data the agentcheck pages are built from (`pnpm --filter model-migrate data`)",
    () => {
      expect(readFileSync(path.join(PKG, "src/data/retirements.json"), "utf8")).toBe(
        readFileSync(canonical, "utf8"),
      );
    },
  );
});

describe("demo", () => {
  it("is the scan of the synthetic app shipped in the package, on the bundled data, with no request", async () => {
    const demo = await run(["demo"]);
    const scan = await run(["scan", "examples/demo-app", "--offline"]);
    expect(demo.code).toBe(0);
    expect(demo.requests).toEqual([]);
    expect(demo.stdout).toBe(
      "Synthetic app, written for this demo: not anyone's code.\n\n" + scan.stdout,
    );
    const pkg = JSON.parse(readFileSync(path.join(PKG, "package.json"), "utf8")) as {
      files: string[];
    };
    expect(pkg.files).toContain("examples/demo-app");
  });
});
