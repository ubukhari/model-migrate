# model-migrate

Find every LLM model ID in your code that OpenAI, Anthropic or Google is retiring, with its
shutdown date, the provider's recommended replacement, the replacement's price ratio and the API
changes the provider documents.

```sh
npx --allow-git=root github:agentwares/model-migrate scan
```

No account, no API key. It reads your files on your machine and sends nothing about them.

Then, before the shutdown date, record what the retiring model answers on your own prompts and
replay them on the replacements, on your own keys:

```sh
npx --allow-git=root github:agentwares/model-migrate capture prompts.jsonl --model gpt-5-mini
npx --allow-git=root github:agentwares/model-migrate compare
```

## What it prints

Recorded on 8 October 2026 over the **synthetic** app in [`examples/demo-app`](examples/demo-app)
(`node scripts/sample.mjs`), not anyone's real code:

```text
model-migrate 0.2.0 · scanned 4 files in examples/demo-app · retirement data checked 8 Oct 2026 (bundled)

5 models in this code have a shutdown date:

gemini-2.5-flash  ·  Vertex AI (Gemini Enterprise Agent Platform)
  shutdown     20 Oct 2026, in 12 days
  replacement  gemini-3.8-flash or gemini-3.5-flash-lite or gemini-3.1-flash-lite
  price        gemini-3.8-flash: 2.5× input, 1.5× output per token until 31 Dec 2026
               gemini-3.8-flash: 5× input, 3× output per token from 1 Jan 2027
               gemini-3.5-flash-lite: 1× input, 1× output per token
               gemini-3.1-flash-lite: 0.83× input, 0.6× output per token
  breaks       temperature, top_p and top_k are deprecated and should be removed
               thinking_budget gives way to thinking_level
               a function response that does not match its call returns an empty answer, not an error
  found in     config/models.yaml:4
  details      https://agentwares-agentcheck.vercel.app/models/vertex-ai/gemini-2.5-flash?ref=model-migrate

ft:gpt-4.1-nano-2025-04-14:acme::a1b2c3 → ft-gpt-4.1-nano-2025-04-14  ·  OpenAI API
  shutdown     23 Oct 2026, in 15 days
  replacement  gpt-5.6-luna
  price        no ratio: the replacement for a fine-tune is a base model
  breaks       none documented by OpenAI
  found in     config/models.yaml:5
  details      https://agentwares-agentcheck.vercel.app/models/openai/ft-gpt-4.1-nano-2025-04-14?ref=model-migrate

o3-mini → o3-mini-2025-01-31  ·  OpenAI API
  shutdown     23 Oct 2026, in 15 days
  replacement  gpt-5.6-sol
  price        gpt-5.6-sol: 3.6× input, 4.6× output per token, at its promotional price
  breaks       none documented by OpenAI
  found in     config/models.yaml:3
  details      https://agentwares-agentcheck.vercel.app/models/openai/o3-mini-2025-01-31?ref=model-migrate

claude-sonnet-4-5 → claude-sonnet-4-5-20250929  ·  Claude API
  shutdown     30 Nov 2026, in 53 days
  replacement  claude-sonnet-5-5
  price        claude-sonnet-5-5: 0.67× input, 0.67× output per token
  breaks       a non-default temperature, top_p or top_k returns a 400 error
               a newer tokenizer counts about 30% more tokens for the same text
               this code sets temperature in src/agent.py
  found in     src/agent.py:9
  details      https://agentwares-agentcheck.vercel.app/models/anthropic/claude-sonnet-4-5-20250929?ref=model-migrate

gpt-5-mini → gpt-5-mini-2025-08-07  ·  OpenAI API
  shutdown     11 Dec 2026, in 64 days
  replacement  gpt-5.6-terra
  price        gpt-5.6-terra: 8× input, 6× output per token
  breaks       none documented by OpenAI
  found in     .env.example (SUMMARY_MODEL), src/summarize.ts:8
  details      https://agentwares-agentcheck.vercel.app/models/openai/gpt-5-mini-2025-08-07?ref=model-migrate

Record each retiring model's answers on your own prompts before its date: after it, nobody can.
Dates and replacements come from each provider's own deprecation page; prices from its pricing page.
```

Each finding links to a page with the sources: for example
[gpt-5-mini shutdown on 11 Dec 2026](https://agentwares-agentcheck.vercel.app/models/openai/gpt-5-mini-2025-08-07).
Every announced shutdown, by date: [agentwares-agentcheck.vercel.app/models](https://agentwares-agentcheck.vercel.app/models).

## Usage

```sh
npx --allow-git=root github:agentwares/model-migrate scan [dir]         # default: the current directory
npx --allow-git=root github:agentwares/model-migrate scan [dir] --json  # the same, as JSON
npx --allow-git=root github:agentwares/model-migrate scan --offline     # use the data bundled with this version; no request
npx --allow-git=root github:agentwares/model-migrate demo               # the scan on a synthetic app shipped with it; reads nothing of yours
```

- **Reads** JavaScript, TypeScript, Python, YAML, JSON and `.env` files under `dir`, skipping
  `node_modules`, build output, virtualenvs and lockfiles. From a `.env` file it reports the
  variable's **name**, never its value. It prints file names and line numbers, never a line.
- **Matches** an ID only as a whole token: `gpt-4` is not found inside `gpt-4o` or `gpt-4.1`; Claude
  IDs in Amazon Bedrock's (`anthropic.claude-…-v1:0`) and Google Cloud's (`claude-…@date`) forms are
  skipped because those platforms set their own dates; an ID with no hyphen (`o1`, `o3`) counts only
  where it is plainly a value (`"o3"`, `MODEL=o3`, `model: o3`). Fine-tuned IDs (`ft:…`) match their
  retiring base model. Router prefixes such as `openai/` and `models/` are understood.
- **Sends** one request: `GET https://agentwares-agentcheck.vercel.app/models/retirements.json`,
  with no body and no query. If it fails, the data bundled with this version is used and a warning
  says so. `--offline` skips it.
- **Exit codes:** 0 when the scan ran (with or without findings), 1 for an error, 2 for a usage
  mistake. With `--json`, an error is `{"error": {"code", "cause", "fix", "retryable"}}` on stdout.

`--json` gives, per finding: `names` (what the code says), `provider`, `platform`, `model_id`,
`status` (`retiring` or `shut_down`), `shutdown_date`, `days_until_shutdown`, `replacements`,
`price_ratios`, `breaks` with their sources, `source_url`, `page_url` and `locations`.

## Test the replacement on your own prompts

A deprecation page tells you the replacement; only your prompts tell you whether it answers the
same way, and what it costs on them. After the shutdown nobody can ask the old model again, so
record its answers first.

```sh
npx --allow-git=root github:agentwares/model-migrate capture prompts.jsonl --model gpt-5-mini  # the retiring model, your key
npx --allow-git=root github:agentwares/model-migrate compare                                   # 2-4 candidates, your keys
npx --allow-git=root github:agentwares/model-migrate compare --candidates gpt-5.6-luna,gemini-3.8-flash
npx --allow-git=root github:agentwares/model-migrate export --agentcheck                       # writes a file; sends nothing
```

**The prompt file** is JSONL, one prompt per line (see [`examples/prompts.jsonl`](examples/prompts.jsonl)):

```jsonl
{"id": "classify-1", "prompt": "Classify the ticket as billing, bug or other: ..."}
{"id": "extract-1", "messages": [{"role": "system", "content": "Reply with JSON only."}, {"role": "user", "content": "..."}], "expect": {"json": true, "schema": {"type": "object", "required": ["name", "amount"]}}}
{"id": "tool-1", "messages": [{"role": "user", "content": "Where is order A-1029?"}], "tools": [{"name": "lookup_order", "parameters": {"type": "object", "properties": {"order_id": {"type": "string"}}}}]}
```

`expect` is optional: `json`, `schema`, `tool` (the tool to call first) and `match`
(`exact` or `normalized`).

**Keys and spend.** `capture` and `compare` call OpenAI (Chat Completions), Anthropic (Messages)
or the Gemini API (generateContent) with your own `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` or
`GEMINI_API_KEY` (or `GOOGLE_API_KEY`) from the environment; each key goes only to its own
provider. The spend is yours, and capped: at most 100 prompts per run unless you pass `--limit`
(up to 1,000), 1,024 output tokens per prompt unless the prompt sets `max_tokens`, two calls at a
time (`--concurrency`). A candidate whose key is not set is skipped, not guessed. Vertex AI
credentials are not supported; the same Gemini model IDs work with a Gemini API key.

**Where things go.** Prompts and answers go to the provider you call and to
`.model-migrate/` in the current directory, which gets its own `.gitignore`. Nothing of yours is
sent to us: besides the provider calls, the only request is the same GET for the retirement data
that `scan` makes, which `--offline` skips.

**The checks** are deterministic; there is no LLM judge and no token spend beyond the replays. A
prompt passes when every check that applies holds against the retiring model's answer: valid JSON
(and the schema) where it gave JSON, the same tool names in order with the same argument names, no
refusal where it answered, a length between half and twice its length, and, for short labels (40
characters or fewer) or when `expect.match` asks, the same answer after normalising case, spaces
and punctuation. **Cost per 1,000 calls** is the mean tokens each provider reported for these
prompts at its list price, read on 8 October 2026; cached input and batch discounts are not
counted.

By default `compare` tries the provider's recommended replacement, the most capable cheaper model
from the same provider, and the model from another provider whose output price is nearest the
replacement's. Recorded with fixed provider replies over the **synthetic** prompts in
[`examples/prompts.jsonl`](examples/prompts.jsonl), with only OpenAI and Gemini keys set, not a
live run:

```text
$ npx --allow-git=root github:agentwares/model-migrate capture examples/prompts.jsonl --model gpt-5-mini
model-migrate 0.2.0 · captured 4 prompts on gpt-5-mini (OpenAI, your key)

  answered     4 of 4
  tokens       52 in / 18 out per call (mean, as OpenAI reported them)
  saved        .model-migrate/gpt-5-mini.jsonl (prompts and answers stay on this machine; .model-migrate/ has its own .gitignore)

gpt-5-mini shuts down 11 Dec 2026, in 64 days.
Next: npx --allow-git=root github:agentwares/model-migrate compare --from gpt-5-mini

$ npx --allow-git=root github:agentwares/model-migrate compare
model-migrate 0.2.0 · 4 prompts captured on gpt-5-mini, replayed on 2 candidates (your keys)

  model              why                      pass rate  cost / 1,000 calls  tokens per call
  gpt-5-mini         retiring                 baseline   $0.05               52 in / 18 out
  gpt-5.6-terra      recommended replacement  3/4 (75%)  $0.32               52 in / 18 out
  gpt-6.1-sol        cheaper sibling          3/4 (75%)  $0.28               52 in / 18 out
  claude-sonnet-5-5  another provider         skipped: no ANTHROPIC_API_KEY in the environment

gpt-5.6-terra: 1 did not pass (schema 1)
  extract-1: schema: $.amount: expected number, got string
  answers saved to .model-migrate/replays/gpt-5-mini/gpt-5.6-terra.jsonl

gpt-6.1-sol: 1 did not pass (tool_call 1)
  tool-1: tool_call: lookup_order became get_order
  answers saved to .model-migrate/replays/gpt-5-mini/gpt-6.1-sol.jsonl

Pass = every check that applies holds against gpt-5-mini's answer: JSON and schema, tool calls and
argument names, no new refusal, length within 0.5-2x, and the same label for short answers. No LLM judge.
Cost = the mean tokens each provider reported for these prompts x its list price (read 8 Oct 2026);
cached input and batch discounts are not counted.

gpt-5-mini shuts down 11 Dec 2026, in 64 days.
To re-run these on your own endpoint whenever a provider ships a model, with history: agentcheck, https://agentwares-agentcheck.vercel.app/models/openai/gpt-5-mini-2025-08-07?ref=model-migrate#agentcheck
```

`export --agentcheck` writes `.model-migrate/agentcheck-traces.json` in the shape agentcheck's
trace import already accepts (`POST /api/v1/targets/{id}/traces`), and prints the command to
upload it to a target you monitor there, if you want to.

## Where the data comes from

Only the providers' own pages, each entry with its source URL and the date it was read:

| Provider   | Dates and replacements                                                                                               | Prices                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| OpenAI API | [deprecations](https://developers.openai.com/api/docs/deprecations)                                                  | [pricing](https://developers.openai.com/api/docs/pricing)                                  |
| Claude API | [model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)                            | [pricing](https://platform.claude.com/docs/en/about-claude/pricing)                        |
| Gemini API | [deprecations](https://ai.google.dev/gemini-api/docs/deprecations)                                                   | [pricing](https://ai.google.dev/gemini-api/docs/pricing)                                   |
| Vertex AI  | [model versions and lifecycle](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/model-versions) | [pricing](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing) |

It covers language models (chat, reasoning, completions, code, search, computer-use and
deep-research IDs, and OpenAI fine-tune families) with a shutdown date from 1 July 2025 on. Audio,
realtime, speech, image, video, embedding and moderation models are left out. A price ratio is the
replacement's list price per token divided by the retiring model's, at the standard tier; it
leaves out how many tokens each model spends on the same prompt, which only your own prompts show.
Where a price is not on the pricing page there is no ratio, and the entry says why.

## Inside Claude Code

The repo is also a Claude Code plugin marketplace with one skill, `/model-migrate:model-migrate`,
which runs the scan and walks through the change for each finding:

```text
/plugin marketplace add agentwares/model-migrate
/plugin install model-migrate@model-migrate
```

An agent can ask the same question over MCP: the `agentcheck_model_retirements` tool on
`https://agentwares-agentcheck.vercel.app/api/mcp` takes model IDs and returns the same facts, with
no key.

## License

MIT, by [agentwares](https://github.com/agentwares). model-migrate is a free tool from
[agentcheck](https://agentwares-agentcheck.vercel.app), which re-runs an agent's checks when a
provider ships a model.
