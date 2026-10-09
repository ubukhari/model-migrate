/**
 * `export --agentcheck`: write a capture as traces in the shape agentcheck's trace import already
 * accepts (`POST /api/v1/targets/{id}/traces`, source `agentcheck_record`, the same shape as the
 * `agentcheck_record` MCP tool). It writes a file; it sends nothing. You upload it, if you want to.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { CliError } from "./errors.js";
import { readCaptures, STORE_DIR, type CaptureRecord } from "./store.js";

export const AGENTCHECK_URL = "https://agentwares-agentcheck.vercel.app";

export interface AgentcheckTrace {
  name: string;
  input: { messages: { role: string; content: string }[] };
  output: string;
  toolCalls: { name: string; args: unknown }[];
  model: string;
}

export function toAgentcheck(records: CaptureRecord[]): {
  source: "agentcheck_record";
  traces: AgentcheckTrace[];
} {
  return {
    source: "agentcheck_record",
    traces: records
      .filter((r) => r.result)
      .map((r) => ({
        name: `${r.model} · ${r.id}`.slice(0, 120),
        input: { messages: r.request.messages },
        // a tool-only answer still needs an output for agentcheck's import
        output: r.result!.text || r.result!.tool_calls.map((t) => `${t.name}()`).join(" "),
        toolCalls: r.result!.tool_calls.map((t) => ({ name: t.name, args: t.args })),
        model: r.model,
      })),
  };
}

export async function exportAgentcheck(
  cwd: string,
  model: string,
  out?: string,
): Promise<{ file: string; traces: number }> {
  const records = await readCaptures(cwd, model);
  const doc = toAgentcheck(records);
  if (!doc.traces.length)
    throw new CliError({
      code: "NO_ANSWERS",
      cause: `the capture for ${model} has no successful answers to export`,
      fix: "run capture again; every call in it failed",
      retryable: true,
    });
  const file = out ?? path.join(STORE_DIR, "agentcheck-traces.json");
  await writeFile(path.resolve(cwd, file), JSON.stringify(doc, null, 2) + "\n");
  return { file: file.split(path.sep).join("/"), traces: doc.traces.length };
}

export function uploadHint(file: string): string {
  return [
    "To keep re-running these with agentcheck, import them on a target you monitor (your own key,",
    "free at /dashboard/keys); nothing has been sent:",
    "",
    `  curl -X POST ${AGENTCHECK_URL}/api/v1/targets/<target-id>/traces \\`,
    '    -H "authorization: Bearer $AGENTCHECK_API_KEY" -H "content-type: application/json" \\',
    `    --data @${file}`,
  ].join("\n");
}
