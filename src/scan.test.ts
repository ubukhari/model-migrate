import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { BUNDLED } from "./data.js";
import { isScannable, makeMatcher, scan, scanText } from "./scan.js";

const TODAY = "2026-10-08";
const DEMO = path.resolve(import.meta.dirname, "../examples/demo-app");
const match = makeMatcher(BUNDLED);
const names = (line: string) => match(line).map((m) => m.name);
const ids = (line: string) => match(line).flatMap((m) => m.targets.map((t) => t.entry.id));

describe("the matcher", () => {
  it("finds quoted IDs, aliases and router-prefixed IDs", () => {
    expect(names(`model: "gpt-5-mini",`)).toEqual(["gpt-5-mini"]);
    expect(ids(`model="claude-sonnet-4-5"`)).toEqual(["claude-sonnet-4-5-20250929"]);
    expect(names(`"openai/o3-mini"`)).toEqual(["o3-mini"]);
    expect(names(`MODEL=gpt-4`)).toEqual(["gpt-4"]);
    expect(names(`path: models/gemini-2.0-flash-001`)).toEqual(["gemini-2.0-flash-001"]);
  });

  it("an ID counts only as a whole token", () => {
    expect(names(`"gpt-4o"`)).toEqual([]);
    expect(names(`"gpt-4.1"`)).toEqual([]);
    expect(names(`"gpt-4-turbo"`)).toEqual(["gpt-4-turbo"]);
    expect(names(`"gpt-5-mini-2025-08-07"`)).toEqual(["gpt-5-mini-2025-08-07"]);
    expect(names(`"gpt-5.6-terra"`)).toEqual([]);
  });

  it("skips Claude IDs in Bedrock's and Google Cloud's forms, whose dates those platforms set", () => {
    expect(names(`"anthropic.claude-sonnet-4-5-20250929-v1:0"`)).toEqual([]);
    expect(names(`"us.anthropic.claude-opus-4-1-20250805-v1:0"`)).toEqual([]);
    expect(names(`"claude-sonnet-4-5@20250929"`)).toEqual([]);
  });

  it("takes an ID with no hyphen only where it is plainly a value", () => {
    expect(names(`model: "o3"`)).toEqual(["o3"]);
    expect(names(`MODEL=o1`)).toEqual(["o1"]);
    expect(names(`model: o3  # cheap`)).toEqual(["o3"]);
    expect(names(`const o3 = 3;`)).toEqual([]);
    expect(names(`total = o3 * 2`)).toEqual([]);
    expect(names(`f(o1, o3)`)).toEqual([]);
  });

  it("matches fine-tuned IDs to their retiring base, and not newer bases", () => {
    expect(ids(`"ft:gpt-3.5-turbo-0125:acme::x1"`)).toEqual(["ft-gpt-3.5-turbo"]);
    expect(ids(`"ft:gpt-4-0613:acme::x1"`)).toEqual(["ft-gpt-4"]);
    expect(ids(`"ft:gpt-4o-2024-08-06:acme::x1"`)).toEqual([]);
    expect(ids(`"ft:gpt-4.1-2025-04-14:acme::x1"`)).toEqual([]);
  });

  it("one Gemini ID can name two platforms' schedules", () => {
    expect(
      match(`"gemini-2.0-flash"`)[0]!
        .targets.map((t) => t.entry.provider)
        .sort(),
    ).toEqual(["gemini-api", "vertex-ai"]);
  });
});

describe("files", () => {
  it("reads code, config and .env files, and nothing else", () => {
    for (const f of ["a.ts", "a.tsx", "a.py", "a.yaml", "a.yml", "a.json", ".env", ".env.local"])
      expect(isScannable(f)).toBe(true);
    for (const f of ["a.md", "a.txt", "package-lock.json", "pnpm-lock.yaml", "a.lock"])
      expect(isScannable(f)).toBe(false);
  });

  it("from a .env file reports the variable's name and never its value", () => {
    const hits = scanText(".env", "SECRET=sk-not-a-model\nMODEL=gpt-5-mini\n# X=o3\n", match);
    expect(hits).toHaveLength(1);
    expect(hits[0]!.location).toEqual({ file: ".env", line: 2, envName: "MODEL" });
    expect(JSON.stringify(hits)).not.toContain("sk-not-a-model");
  });

  it("notes the sampling parameters a file sets next to a model", () => {
    const hits = scanText("a.py", `model="claude-sonnet-4-5"\ntemperature=0.2\n`, match);
    expect(hits[0]!.location.sampling).toEqual(["temperature"]);
  });
});

describe("scan", () => {
  const tmp = mkdtempSync(path.join(tmpdir(), "model-migrate-"));
  afterAll(() => rmSync(tmp, { recursive: true, force: true }));

  it("finds the synthetic demo app's retiring models, soonest first", async () => {
    const r = await scan(DEMO, BUNDLED, TODAY);
    expect(r.filesRead).toBe(4);
    expect(r.findings.map((f) => `${f.entry.provider}/${f.entry.id}`)).toEqual([
      "vertex-ai/gemini-2.5-flash",
      "openai/ft-gpt-4.1-nano-2025-04-14",
      "openai/o3-mini-2025-01-31",
      "anthropic/claude-sonnet-4-5-20250929",
      "openai/gpt-5-mini-2025-08-07",
    ]);
    const mini = r.findings.find((f) => f.entry.id === "gpt-5-mini-2025-08-07")!;
    expect(mini.locations).toEqual([
      { file: ".env.example", line: 3, envName: "SUMMARY_MODEL" },
      { file: "src/summarize.ts", line: 8 },
    ]);
  });

  it("skips dependencies and build output, and puts shut-down models first", async () => {
    mkdirSync(path.join(tmp, "node_modules/pkg"), { recursive: true });
    mkdirSync(path.join(tmp, "dist"), { recursive: true });
    writeFileSync(path.join(tmp, "node_modules/pkg/index.js"), `"gpt-3.5-turbo"`);
    writeFileSync(path.join(tmp, "dist/out.js"), `"gpt-3.5-turbo"`);
    writeFileSync(path.join(tmp, "app.ts"), `const a = "gpt-5-codex";\nconst b = "gpt-5-mini";\n`);
    const r = await scan(tmp, BUNDLED, TODAY);
    expect(r.filesRead).toBe(1);
    expect(r.findings.map((f) => f.entry.id)).toEqual(["gpt-5-codex", "gpt-5-mini-2025-08-07"]);
  });
});
