/**
 * The files that put model-migrate where people already are: the package manifest, the README and
 * its recorded sample, this package's CHANGELOG, and the repo-root files the sync copies from
 * `distribution/root` (the Claude Code plugin marketplace). The public repo has those at its root,
 * so their checks run in the monorepo only; `scripts/sync-oss-repos.sh` re-validates them.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SAMPLE_DATE } from "./index.js";
import { INSTALL, ON_NPM, REPO, RUN } from "./install.js";
import { main } from "./main.js";

const here = (rel: string): URL => new URL(`../${rel}`, import.meta.url);
const read = (rel: string): string => readFileSync(here(rel), "utf8");
const json = <T>(rel: string): T => JSON.parse(read(rel)) as T;
const pkg = json<{
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  files: string[];
  bin: Record<string, string>;
}>("package.json");

describe("package", () => {
  it("is model-migrate with no runtime dependencies", () => {
    expect(pkg.name).toBe("model-migrate");
    expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(pkg.dependencies ?? {}).toEqual({});
    expect(pkg.bin).toEqual({ "model-migrate": "./dist/cli.js" });
    expect(pkg.files).toEqual(expect.arrayContaining(["dist", "README.md", "CHANGELOG.md"]));
  });

  it("CHANGELOG has a section for this version", () => {
    expect(read("CHANGELOG.md")).toMatch(
      new RegExp(`^## ${pkg.version.replace(/\./g, "\\.")} `, "m"),
    );
  });
});

describe("README", () => {
  const readme = read("README.md");

  it("leads with the one-line use", () => {
    expect(readme).toContain("```sh\n" + INSTALL + " scan\n```");
  });

  it("the recorded sample is the CLI's real output on the synthetic demo app (`node scripts/sample.mjs`)", async () => {
    let out = "";
    await main(["scan", "examples/demo-app", "--offline"], {
      stdout: (s) => (out += s),
      stderr: () => undefined,
      now: () => new Date(`${SAMPLE_DATE}T12:00:00Z`),
      cwd: new URL("..", import.meta.url).pathname,
    });
    expect(readme).toContain("**synthetic**");
    expect(readme).toContain("```text\n" + out.trimEnd() + "\n```");
  });

  it("says what it sends", () => {
    expect(readme).toContain(
      "GET https://agentwares-agentcheck.vercel.app/models/retirements.json",
    );
    expect(readme).toContain("agentcheck_model_retirements");
  });
});

const root = "distribution/root";
const frontmatter = (text: string): Record<string, string> =>
  Object.fromEntries(
    (text.split("---")[1] ?? "")
      .split("\n")
      .map((l) => /^([a-z-]+):\s*(.*)$/.exec(l))
      .filter((m): m is RegExpExecArray => m !== null)
      .map((m) => [m[1]!, m[2]!.replace(/^"|"$/g, "")]),
  );

describe.skipIf(!existsSync(here(root)))("repo-root files (distribution/root)", () => {
  it("the marketplace's plugin resolves, and versions match this package", () => {
    const marketplace = json<{
      name: string;
      owner: { name: string };
      plugins: { name: string; source: string }[];
    }>(`${root}/.claude-plugin/marketplace.json`);
    // agentguard's marketplace is "agentwares"; the same name here would clash
    expect(marketplace.name).toBe("model-migrate");
    expect(marketplace.owner.name).toBe("agentwares");
    expect(marketplace.plugins).toHaveLength(1);
    for (const entry of marketplace.plugins) {
      expect(entry.source.startsWith("./")).toBe(true);
      const plugin = json<{ name: string; version: string }>(
        `${root}/${entry.source.slice(2)}/.claude-plugin/plugin.json`,
      );
      expect(plugin.name).toBe(entry.name);
      expect(plugin.version).toBe(pkg.version);
    }
  });

  it("plugin.json carries the links a directory listing needs", () => {
    const plugin = json<Record<string, unknown>>(
      `${root}/plugins/model-migrate/.claude-plugin/plugin.json`,
    );
    for (const key of [
      "homepage",
      "documentationUrl",
      "repository",
      "privacyPolicyUrl",
      "termsOfServiceUrl",
      "supportUrl",
    ])
      expect(String(plugin[key])).toMatch(/^https:\/\//);
  });

  it("the skill runs the published CLI", () => {
    const skills = readdirSync(here(`${root}/plugins/model-migrate/skills`));
    expect(skills).toEqual(["model-migrate"]);
    const text = read(`${root}/plugins/model-migrate/skills/model-migrate/SKILL.md`);
    const front = frontmatter(text);
    expect(front.name).toBe("model-migrate");
    expect(front.description!.length).toBeGreaterThan(80);
    expect(front.description!.length).toBeLessThanOrEqual(1024);
    expect(text).toContain(`${RUN} scan $ARGUMENTS --json`);
  });

  it("nothing pre-approves a tool: Claude Code asks before every command", () => {
    const walk = (dir: string): string[] =>
      readdirSync(here(dir), { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`],
      );
    const files = walk(root);
    for (const f of files.filter((x) => x.endsWith(".md"))) {
      const text = read(f);
      const front = text.startsWith("---") ? (text.split("---")[1] ?? "") : "";
      expect(front, f).not.toMatch(/^\s*(allowed-tools|allowedTools)\s*:/m);
    }
    for (const f of files.filter((x) => x.endsWith(".json")))
      expect(read(f), f).not.toMatch(/allowed-?tools/i);
  });

  it("the listing icon is a 1024 px PNG drawn from distribution/icon.svg (`pnpm icon`)", () => {
    const plugin = json<{ icon?: string }>(
      `${root}/plugins/model-migrate/.claude-plugin/plugin.json`,
    );
    expect(plugin.icon).toBe("./.claude-plugin/icon.png");
    const file = `${root}/plugins/model-migrate/${plugin.icon!.slice(2)}`;
    const png = readFileSync(here(file));
    expect(statSync(here(file)).size).toBeLessThan(2 * 1024 * 1024);
    expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    expect(png.readUInt32BE(16)).toBe(1024);
    expect(png.readUInt32BE(20)).toBe(1024);
    const key = "model-migrate-icon-source-sha256\0";
    const at = png.indexOf(key, 0, "latin1");
    expect(at, "icon.png carries no source hash: run `pnpm icon`").toBeGreaterThan(0);
    const drawnFrom = png.subarray(at + key.length, at + key.length + 64).toString("latin1");
    const svg = createHash("sha256").update(read("distribution/icon.svg")).digest("hex");
    expect(drawnFrom, "distribution/icon.svg changed: run `pnpm icon`").toBe(svg);
  });

  it("the plugin folder has the README the directory lists it by, naming what it runs", () => {
    const readme = read(`${root}/plugins/model-migrate/README.md`);
    expect(readme).toContain(`${RUN} scan`);
    expect(readme).toContain("pre-approve nothing");
    expect(readme).not.toMatch(/`[^`]*\.png[^`]*`/);
  });
});

/**
 * One install command (src/install.ts), everywhere it is shown. Any form of it found elsewhere must
 * be INSTALL, or RUN where an agent runs it unattended; code and agentcheck's pages import it rather
 * than spell it. After flipping ON_NPM, rewrite the files that cannot import it:
 *
 *   MODEL_MIGRATE_WRITE_INSTALL=1 pnpm --filter model-migrate exec vitest run src/distribution
 *
 * which also rewrites the mirror agentcheck's pages import.
 */
const COMMAND =
  /npx (?:-{1,2}[\w-]+(?:=[\w-]+)? )*(?:github:agentwares\/)?model-migrate(?:@latest)?(?![\w./-])/g;
const WRITE = Boolean(process.env["MODEL_MIGRATE_WRITE_INSTALL"]);
const forms = (text: string): string[] => [...text.matchAll(COMMAND)].map((m) => m[0]);
const walk = (rel: string): string[] =>
  !existsSync(here(rel))
    ? []
    : statSync(here(rel)).isFile()
      ? [rel]
      : readdirSync(here(rel), { withFileTypes: true })
          .filter((e) => !["node_modules", "dist", ".next"].includes(e.name))
          .flatMap((e) => walk(`${rel}/${e.name}`));

/** Re-pad the `# comments` of a shell block that names the command, so its columns line up. */
function realign(text: string): string {
  return text.replace(/```sh\n([\s\S]*?)```/g, (block, body: string) => {
    if (forms(body).length === 0) return block;
    const rows = body.split("\n").map((l) => /^(\S.*?\S)\s{2,}(# .*)$/.exec(l));
    const width = Math.max(0, ...rows.map((m) => (m ? m[1]!.length : 0))) + 2;
    const lines = body.split("\n").map((l, i) => {
      const m = rows[i];
      return m ? m[1]!.padEnd(width) + m[2]! : l;
    });
    return "```sh\n" + lines.join("\n") + "```";
  });
}

describe("the install command", () => {
  it(`is ${INSTALL} while ON_NPM is ${String(ON_NPM)}`, () => {
    expect(INSTALL).toBe(`npx ${ON_NPM ? "" : "--allow-git=root github:agentwares/"}${pkg.name}`);
    expect(RUN).toBe(
      ON_NPM
        ? `npx -y ${pkg.name}@latest`
        : `npx -y --allow-git=root github:agentwares/${pkg.name}`,
    );
    expect(REPO).toBe(`https://github.com/agentwares/${pkg.name}`);
  });

  // README, CHANGELOG and the plugin files in the monorepo; the same files at the root of the
  // public repo, where distribution/root has become the repo root
  const docs = [
    "README.md",
    "CHANGELOG.md",
    ...walk("distribution"),
    ...walk(".claude-plugin"),
    ...walk("plugins"),
  ].filter((f) => /\.(md|json)$/.test(f));

  it.each(docs)("%s names only INSTALL or RUN", (file) => {
    const text = read(file);
    if (WRITE) {
      const next = realign(
        text.replace(COMMAND, (m) => (/ (?:-y|--yes) /.test(m) ? RUN : INSTALL)),
      );
      if (next !== text) writeFileSync(here(file), next);
    }
    for (const form of forms(read(file))) expect([INSTALL, RUN], file).toContain(form);
  });

  it("code, scripts and tests import it rather than spell it", () => {
    const files = [...walk("src"), ...walk("scripts")].filter((f) => f !== "src/install.ts");
    expect(files.length).toBeGreaterThan(5);
    for (const file of files) expect(forms(read(file)), file).toEqual([]);
  });
});

/** agentcheck's pages import a mirror of src/install.ts, written here; nothing there spells it. */
const AGENTCHECK = "../agentcheck/src";
const MIRROR = `${AGENTCHECK}/app/models/_lib/install.ts`;
describe.skipIf(!existsSync(here(AGENTCHECK)))("the install command on agentcheck", () => {
  it("the mirror its pages import is src/install.ts", () => {
    const text = [
      "/**",
      " * How to run model-migrate, mirrored from apps/model-migrate-cli/src/install.ts, the one constant.",
      " * Written by apps/model-migrate-cli/src/distribution.test.ts, which fails when the two differ.",
      " */",
      `export const ON_NPM: boolean = ${String(ON_NPM)};`,
      `export const INSTALL = ${JSON.stringify(INSTALL)};`,
      `export const REPO = ${JSON.stringify(REPO)};`,
      "",
    ].join("\n");
    if (WRITE) writeFileSync(here(MIRROR), text);
    expect(read(MIRROR)).toBe(text);
  });

  it("no other agentcheck file spells the command", () => {
    const files = walk(AGENTCHECK).filter((f) => f !== MIRROR && /\.(tsx?|md|txt|json)$/.test(f));
    expect(files.length).toBeGreaterThan(10);
    for (const file of files) expect(forms(read(file)), file).toEqual([]);
  });
});
