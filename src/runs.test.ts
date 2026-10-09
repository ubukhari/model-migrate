/**
 * capture, compare and export, end to end through `main`, against fixed provider replies
 * (src/fake-providers.ts). No live call, no real key: the keys below are placeholders the fake
 * never checks, and a test asserts each goes only to its own provider's host, in a header.
 */
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { BUNDLED } from "./data.js";
import { defaultCandidates, priceOf } from "./catalog.js";
import { checkPair, normalize, parseJsonLoose, validateSchema } from "./checks.js";
import { fakeProviders, type Seen } from "./fake-providers.js";
import { INSTALL } from "./install.js";
import { main } from "./main.js";
import { parsePrompts } from "./prompts.js";
import { call, parseReply, providerFor } from "./providers.js";
import type { CaptureRecord } from "./store.js";

const NOW = () => new Date("2026-10-08T12:00:00Z");
const PKG = path.resolve(import.meta.dirname, "..");
const PROMPTS = path.join(PKG, "examples/prompts.jsonl");
const ENV = { OPENAI_API_KEY: "test-openai-key", GEMINI_API_KEY: "test-gemini-key" };

async function cli(argv: string[], cwd: string, seen: Seen[] = [], env: NodeJS.ProcessEnv = ENV) {
  let stdout = "";
  let stderr = "";
  const providers = fakeProviders(seen);
  const code = await main(argv, {
    stdout: (s) => (stdout += s),
    stderr: (s) => (stderr += s),
    fetch: (url, init) =>
      url.includes("agentwares-agentcheck")
        ? Promise.resolve(Response.json(BUNDLED))
        : providers(url, init),
    now: NOW,
    cwd,
    env,
    retryDelayMs: 0,
  });
  return { code, stdout, stderr };
}

describe("providers", () => {
  it("knows each provider from the model ID", () => {
    expect(providerFor("gpt-5-mini")).toBe("openai");
    expect(providerFor("o3-mini")).toBe("openai");
    expect(providerFor("ft:gpt-4.1-nano-2025-04-14:acme::x")).toBe("openai");
    expect(providerFor("claude-sonnet-4-5")).toBe("anthropic");
    expect(providerFor("models/gemini-2.5-flash")).toBe("gemini");
    expect(providerFor("llama-3")).toBe(undefined);
  });

  it("each key goes only to its provider, in its header, never in a body", async () => {
    const seen: Seen[] = [];
    const fetch = fakeProviders(seen);
    const req = {
      messages: [{ role: "user" as const, content: "Where is order A-1029?" }],
      maxTokens: 64,
    };
    await call("openai", { ...req, model: "gpt-5-mini" }, "k-openai", fetch);
    await call("anthropic", { ...req, model: "claude-sonnet-5-5" }, "k-anthropic", fetch);
    await call("gemini", { ...req, model: "gemini-3.8-flash" }, "k-gemini", fetch);
    expect(seen.map((s) => new URL(s.url).host)).toEqual([
      "api.openai.com",
      "api.anthropic.com",
      "generativelanguage.googleapis.com",
    ]);
    expect(seen[0]!.headers["authorization"]).toBe("Bearer k-openai");
    expect(seen[1]!.headers["x-api-key"]).toBe("k-anthropic");
    expect(seen[2]!.headers["x-goog-api-key"]).toBe("k-gemini");
    for (const s of seen) expect(JSON.stringify(s.body)).not.toMatch(/k-(openai|anthropic|gemini)/);
    expect(seen[0]!.body["max_completion_tokens"]).toBe(64);
  });

  it("reads text, tool calls, refusals and the provider's own token counts", () => {
    const openai = parseReply("openai", {
      choices: [{ finish_reason: "stop", message: { content: "ok", refusal: null } }],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 7,
        completion_tokens_details: { reasoning_tokens: 3 },
      },
    });
    expect(openai).toMatchObject({
      text: "ok",
      refused: false,
      usage: { input_tokens: 10, output_tokens: 7, reasoning_tokens: 3 },
    });
    const anthropic = parseReply("anthropic", {
      content: [{ type: "tool_use", name: "lookup", input: { id: 1 } }],
      stop_reason: "tool_use",
      usage: { input_tokens: 5, output_tokens: 4 },
    });
    expect(anthropic.tool_calls).toEqual([{ name: "lookup", args: { id: 1 } }]);
    const gemini = parseReply("gemini", {
      candidates: [{ content: { parts: [{ text: "x" }] }, finishReason: "SAFETY" }],
      usageMetadata: { promptTokenCount: 8, candidatesTokenCount: 2, thoughtsTokenCount: 5 },
    });
    expect(gemini).toMatchObject({
      refused: true,
      usage: { input_tokens: 8, output_tokens: 7, reasoning_tokens: 5 },
    });
  });
});

describe("checks", () => {
  const rec = (
    text: string,
    extra: Partial<CaptureRecord> = {},
    tools: { name: string; args: unknown }[] = [],
  ): CaptureRecord => ({
    id: "p",
    model: "m",
    provider: "openai",
    at: "",
    request: { messages: [], max_tokens: 10 },
    latency_ms: 0,
    result: {
      text,
      tool_calls: tools,
      refused: false,
      finish: "stop",
      usage: { input_tokens: 1, output_tokens: 1 },
    },
    ...extra,
  });

  it("normalizes case, spaces and punctuation; finds fenced JSON; validates a schema", () => {
    expect(normalize("  Billing. ")).toBe("billing");
    expect(parseJsonLoose('```json\n{"a": 1}\n```')).toEqual({ ok: true, value: { a: 1 } });
    expect(parseJsonLoose("billing").ok).toBe(false);
    const schema = {
      type: "object",
      required: ["n"],
      properties: { n: { type: "number" } },
      additionalProperties: false,
    };
    expect(validateSchema({ n: 1 }, schema)).toEqual([]);
    expect(validateSchema({ n: "1", x: 2 }, schema)).toEqual([
      "$.n: expected number, got string",
      "$.x: not allowed",
    ]);
  });

  it("a short label must match after normalising; a long answer only needs a sane length", () => {
    expect(checkPair(rec("billing"), rec("Billing.")).pass).toBe(true);
    expect(checkPair(rec("billing"), rec("bug")).pass).toBe(false);
    const long = "The team meeting moved to Thursday because the venue flooded overnight.";
    expect(
      checkPair(rec(long), rec("Because of a flood the meeting is on Thursday now, as planned."))
        .pass,
    ).toBe(true);
    expect(checkPair(rec(long), rec("Thursday.")).pass).toBe(false);
  });

  it("tool calls must keep their names and argument names; a new refusal fails", () => {
    const base = rec("", {}, [{ name: "lookup_order", args: { order_id: "A" } }]);
    expect(
      checkPair(base, rec("", {}, [{ name: "lookup_order", args: { order_id: "B" } }])).pass,
    ).toBe(true);
    expect(checkPair(base, rec("", {}, [{ name: "lookup_order", args: { id: "A" } }])).pass).toBe(
      false,
    );
    const refused = rec("I'm sorry, but I can't help with that.");
    refused.result!.refused = true;
    expect(
      checkPair(rec("The answer is that the meeting moved."), refused).checks.find(
        (c) => c.name === "refusal",
      )?.pass,
    ).toBe(false);
  });
});

describe("candidates and prices", () => {
  it("defaults to the replacement, a cheaper model from the same provider and one from another", () => {
    expect(defaultCandidates("gpt-5-mini", BUNDLED, "2026-10-08")).toEqual([
      { model: "gpt-5.6-terra", why: "recommended replacement" },
      { model: "gpt-6.1-sol", why: "cheaper sibling" },
      { model: "claude-sonnet-5-5", why: "another provider" },
    ]);
  });

  it("uses the price in force on the day, and the data's price for a retiring model", () => {
    expect(priceOf("gemini-3.8-flash", "2026-12-31")).toMatchObject({ input: 0.75, output: 3.75 });
    expect(priceOf("gemini-3.8-flash", "2027-01-01")).toMatchObject({ input: 1.5, output: 7.5 });
    expect(priceOf("gpt-5-mini", "2026-10-08", BUNDLED)).toEqual({ input: 0.25, output: 2 });
    expect(priceOf("llama-3", "2026-10-08", BUNDLED)).toBe(undefined);
  });

  it("parses the example prompt file", () => {
    const prompts = parsePrompts(readFileSync(PROMPTS, "utf8"));
    expect(prompts.map((p) => p.id)).toEqual(["classify-1", "extract-1", "tool-1", "summary-1"]);
    expect(prompts[1]!.expect?.schema).toBeTruthy();
    expect(() => parsePrompts('{"messages": [{"role": "bot", "content": "x"}]}')).toThrow(/role/);
  });
});

describe("capture → compare → export", () => {
  const cwd = mkdtempSync(path.join(tmpdir(), "model-migrate-runs-"));
  afterAll(() => rmSync(cwd, { recursive: true, force: true }));

  it("capture keeps the retiring model's answers and token counts in .model-migrate/", async () => {
    const seen: Seen[] = [];
    const r = await cli(["capture", PROMPTS, "--model", "gpt-5-mini"], cwd, seen);
    expect(r.code).toBe(0);
    expect(r.stdout).toContain("captured 4 prompts on gpt-5-mini (OpenAI, your key)");
    expect(r.stdout).toContain("gpt-5-mini shuts down 11 Dec 2026, in 64 days.");
    expect(seen.every((s) => s.url.startsWith("https://api.openai.com/"))).toBe(true);
    expect(readFileSync(path.join(cwd, ".model-migrate/.gitignore"), "utf8")).toBe("*\n");
    const lines = readFileSync(path.join(cwd, ".model-migrate/gpt-5-mini.jsonl"), "utf8")
      .trim()
      .split("\n");
    const first = JSON.parse(lines[0]!) as CaptureRecord;
    expect(lines).toHaveLength(4);
    expect(first.result?.usage).toEqual({
      input_tokens: 52,
      output_tokens: 18,
      reasoning_tokens: 6,
    });
  });

  it("capture without the key says which variable to set, and calls nothing", async () => {
    const seen: Seen[] = [];
    const r = await cli(["capture", PROMPTS, "--model", "claude-sonnet-4-5", "--json"], cwd, seen);
    expect(r.code).toBe(1);
    expect(JSON.parse(r.stdout).error).toMatchObject({ code: "KEY_MISSING", retryable: false });
    expect(JSON.parse(r.stdout).error.fix).toContain("ANTHROPIC_API_KEY");
    expect(seen).toEqual([]);
  });

  it("compare runs the candidates whose keys are set, skips the rest, and reports pass rate and cost", async () => {
    const r = await cli(["compare", "--json"], cwd);
    expect(r.code).toBe(0);
    const out = JSON.parse(r.stdout);
    expect(out.retiring).toMatchObject({
      model: "gpt-5-mini",
      answered: 4,
      tokens: { mean_input: 52, mean_output: 18 },
      cost_per_1000_calls: 0.05,
      shutdown: "2026-12-11",
    });
    const [terra, sol, sonnet] = out.candidates;
    expect(terra).toMatchObject({
      model: "gpt-5.6-terra",
      status: "ran",
      passed: 3,
      compared: 4,
      pass_rate: 75,
    });
    expect(terra.failures).toEqual([{ check: "schema", count: 1 }]);
    expect(terra.cost_per_1000_calls).toBe(0.32);
    expect(sol).toMatchObject({
      model: "gpt-6.1-sol",
      passed: 3,
      failures: [{ check: "tool_call", count: 1 }],
    });
    expect(sonnet).toMatchObject({
      model: "claude-sonnet-5-5",
      status: "skipped",
      skipped_reason: "no ANTHROPIC_API_KEY in the environment",
    });
    expect(sonnet.breaks.map((b: { text: string }) => b.text).join(" ")).toMatch(/400 error/);
  });

  it("compare text ends with the hand-off to agentcheck, tagged ?ref=model-migrate", async () => {
    const r = await cli(["compare", "--candidates", "gemini-3.8-flash"], cwd);
    expect(r.code).toBe(0);
    expect(r.stdout).toContain("gemini-3.8-flash  your choice");
    const last = r.stdout.trimEnd().split("\n").at(-1)!;
    expect(last).toContain("agentcheck");
    expect(last).toContain("/models/openai/gpt-5-mini-2025-08-07?ref=model-migrate#agentcheck");
  });

  it("export --agentcheck writes traces agentcheck's import reads, and sends nothing", async () => {
    const seen: Seen[] = [];
    const r = await cli(["export", "--agentcheck", "--from", "gpt-5-mini"], cwd, seen);
    expect(r.code).toBe(0);
    expect(seen).toEqual([]);
    expect(r.stdout).toContain("nothing has been sent");
    const doc = JSON.parse(
      readFileSync(path.join(cwd, ".model-migrate/agentcheck-traces.json"), "utf8"),
    );
    expect(doc.source).toBe("agentcheck_record");
    expect(doc.traces).toHaveLength(4);
    expect(doc.traces[2]).toMatchObject({
      toolCalls: [{ name: "lookup_order", args: { order_id: "A-1029" } }],
      model: "gpt-5-mini",
    });
    // the committed example is this export; agentcheck's own importer is run on it in
    // apps/agentcheck/src/app/models/_lib/export.test.ts
    expect(doc).toEqual(
      JSON.parse(readFileSync(path.join(PKG, "examples/agentcheck-traces.json"), "utf8")),
    );
  });

  it("the README's compare sample is this run's real output", async () => {
    const readme = readFileSync(path.join(PKG, "README.md"), "utf8");
    const fresh = mkdtempSync(path.join(tmpdir(), "model-migrate-readme-"));
    try {
      const cap = await cli(["capture", PROMPTS, "--model", "gpt-5-mini", "--offline"], fresh);
      const cmp = await cli(["compare", "--offline"], fresh);
      const sample =
        `$ ${INSTALL} capture examples/prompts.jsonl --model gpt-5-mini\n${cap.stdout}\n` +
        `$ ${INSTALL} compare\n${cmp.stdout}`;
      expect(readme).toContain("```text\n" + sample.trimEnd() + "\n```");
    } finally {
      rmSync(fresh, { recursive: true, force: true });
    }
  });
});
