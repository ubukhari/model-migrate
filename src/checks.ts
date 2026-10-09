/**
 * The checks `compare` runs on each prompt: a candidate's answer against the retiring model's.
 * Deterministic only: no LLM judge, no tokens spent on judging.
 *
 *   exact       the same text, after trimming
 *   normalized  the same text after folding case, spaces and punctuation
 *   json        valid JSON where the retiring model gave JSON (or `expect.json`)
 *   schema      matches `expect.schema`
 *   tool_call   the same tools in the same order, with the same argument names
 *   refusal     no refusal where the retiring model answered
 *   length      between half and twice the retiring model's length
 *
 * A prompt passes when every check that gates it passes. Exact and normalized match gate only
 * when `expect.match` asks for them, or when the retiring model's answer is a short label (40
 * characters or fewer, no JSON, no tool call), where the label is the answer.
 */
import type { Expect } from "./prompts.js";
import type { CaptureRecord } from "./store.js";

export type CheckName =
  "exact" | "normalized" | "json" | "schema" | "tool_call" | "refusal" | "length";

export interface CheckResult {
  name: CheckName;
  pass: boolean;
  gating: boolean;
  detail?: string;
}

export interface PairResult {
  id: string;
  /** null when the retiring model's own call failed, so there is nothing to compare */
  pass: boolean | null;
  checks: CheckResult[];
  error?: string;
}

export const SHORT_LABEL = 40;
export const LENGTH_RANGE: readonly [number, number] = [0.5, 2];

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** JSON in the answer: the whole text, or one fenced ```json block. Objects and arrays only. */
export function parseJsonLoose(text: string): { ok: true; value: unknown } | { ok: false } {
  const t = text.trim();
  const fenced = /^```(?:json)?\s*\n([\s\S]*?)\n?```$/i.exec(t);
  const body = fenced ? fenced[1]! : t;
  if (!/^[[{]/.test(body.trim())) return { ok: false };
  try {
    return { ok: true, value: JSON.parse(body) as unknown };
  } catch {
    return { ok: false };
  }
}

type Schema = Record<string, unknown>;

function typeOf(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (typeof v === "number") return Number.isInteger(v) ? "integer" : "number";
  return typeof v;
}

/** A small JSON Schema validator: type, enum, const, properties, required, additionalProperties, items. */
export function validateSchema(value: unknown, schema: Schema, at = "$"): string[] {
  const errors: string[] = [];
  const t = schema["type"];
  if (t !== undefined) {
    const types = Array.isArray(t) ? (t as string[]) : [t as string];
    const actual = typeOf(value);
    const ok = types.some((x) => x === actual || (x === "number" && actual === "integer"));
    if (!ok) return [`${at}: expected ${types.join(" or ")}, got ${actual}`];
  }
  if (
    Array.isArray(schema["enum"]) &&
    !(schema["enum"] as unknown[]).some((e) => JSON.stringify(e) === JSON.stringify(value))
  )
    errors.push(`${at}: not one of the allowed values`);
  if ("const" in schema && JSON.stringify(schema["const"]) !== JSON.stringify(value))
    errors.push(`${at}: not the required value`);
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const o = value as Record<string, unknown>;
    const props = (schema["properties"] ?? {}) as Record<string, Schema>;
    for (const r of (schema["required"] as string[] | undefined) ?? [])
      if (!(r in o)) errors.push(`${at}.${r}: missing`);
    for (const [k, v] of Object.entries(o)) {
      if (props[k]) errors.push(...validateSchema(v, props[k], `${at}.${k}`));
      else if (schema["additionalProperties"] === false) errors.push(`${at}.${k}: not allowed`);
    }
  }
  if (Array.isArray(value) && schema["items"] && typeof schema["items"] === "object")
    value.forEach((v, i) =>
      errors.push(...validateSchema(v, schema["items"] as Schema, `${at}[${i}]`)),
    );
  return errors;
}

function argKeys(args: unknown): string {
  return args && typeof args === "object" && !Array.isArray(args)
    ? Object.keys(args).sort().join(",")
    : typeof args;
}

/** Every check for one prompt: `candidate` against `baseline`, the retiring model's record. */
export function checkPair(
  baseline: CaptureRecord,
  candidate: CaptureRecord | undefined,
): PairResult {
  const id = baseline.id;
  if (!baseline.result)
    return { id, pass: null, checks: [], error: "the retiring model's call failed" };
  if (!candidate?.result)
    return {
      id,
      pass: false,
      checks: [],
      error: candidate?.error ? `${candidate.error.code}: ${candidate.error.cause}` : "no answer",
    };
  const expect: Expect = baseline.expect ?? {};
  const b = baseline.result;
  const c = candidate.result;
  const checks: CheckResult[] = [];

  const baseJson = parseJsonLoose(b.text);
  const wantsJson =
    expect.json === true || !!expect.schema || (baseJson.ok && b.text.trim() !== "");
  const isLabel =
    !wantsJson &&
    b.tool_calls.length === 0 &&
    b.text.trim().length > 0 &&
    b.text.trim().length <= SHORT_LABEL;

  checks.push({
    name: "exact",
    pass: b.text.trim() === c.text.trim(),
    gating: expect.match === "exact",
  });
  checks.push({
    name: "normalized",
    pass: normalize(b.text) === normalize(c.text),
    gating: expect.match === "normalized" || (expect.match === undefined && isLabel),
  });

  if (wantsJson) {
    const cj = parseJsonLoose(c.text);
    checks.push({
      name: "json",
      pass: cj.ok,
      gating: true,
      ...(cj.ok ? {} : { detail: "not valid JSON" }),
    });
    if (expect.schema) {
      const errs = cj.ok ? validateSchema(cj.value, expect.schema) : ["not JSON"];
      checks.push({
        name: "schema",
        pass: errs.length === 0,
        gating: true,
        ...(errs.length ? { detail: errs.slice(0, 3).join("; ") } : {}),
      });
    }
  }

  if (b.tool_calls.length || expect.tool) {
    const names = (x: typeof b) => x.tool_calls.map((t) => t.name);
    let pass: boolean;
    let detail: string | undefined;
    if (expect.tool && !b.tool_calls.length) {
      pass = c.tool_calls[0]?.name === expect.tool;
      if (!pass) detail = `expected ${expect.tool}, got ${names(c).join(", ") || "no tool call"}`;
    } else {
      const sameNames = names(b).join(">") === names(c).join(">");
      const sameArgs =
        sameNames &&
        b.tool_calls.every((t, i) => argKeys(t.args) === argKeys(c.tool_calls[i]?.args));
      pass = sameNames && sameArgs;
      if (!sameNames)
        detail = `${names(b).join(" > ")} became ${names(c).join(" > ") || "no tool call"}`;
      else if (!sameArgs) detail = "same tools, different argument names";
    }
    checks.push({ name: "tool_call", pass, gating: true, ...(detail ? { detail } : {}) });
  }

  checks.push({
    name: "refusal",
    pass: !(c.refused && !b.refused),
    gating: true,
    ...(c.refused && !b.refused ? { detail: "refused where the retiring model answered" } : {}),
  });

  const bl = b.text.trim().length;
  if (bl >= 20) {
    const ratio = c.text.trim().length / bl;
    const pass = ratio >= LENGTH_RANGE[0] && ratio <= LENGTH_RANGE[1];
    checks.push({
      name: "length",
      pass,
      gating: true,
      ...(pass ? {} : { detail: `${ratio.toFixed(2)}× the retiring model's length` }),
    });
  }

  return { id, pass: checks.filter((x) => x.gating).every((x) => x.pass), checks };
}
