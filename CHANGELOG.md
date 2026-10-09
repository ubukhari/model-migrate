# Changelog

## 0.2.0 (2026-10-08)

- `model-migrate capture <prompts.jsonl> --model <id>` runs your prompts (JSONL: messages, optional
  tools and `expect` hints) on the retiring model with your own `OPENAI_API_KEY`,
  `ANTHROPIC_API_KEY` or `GEMINI_API_KEY`, and keeps the answers and the token counts the provider
  reports in `.model-migrate/` (which gets its own `.gitignore`). At most 100 prompts per run by
  default (`--limit`), 1,024 output tokens each unless the prompt says otherwise.
- `model-migrate compare` replays them on the recommended replacement, a cheaper model from the
  same provider and one from another provider (or the 1–4 you name with `--candidates`), on your
  keys, and reports each one's pass rate against the retiring model's answers, its cost per 1,000
  calls from the measured tokens at list price, and the API changes the providers document. Checks
  are deterministic: exact and normalised match, JSON and schema, tool-call names and argument
  names, refusals, length. No LLM judge; a candidate whose key is not set is skipped.
- `model-migrate export --agentcheck` writes the capture as traces agentcheck's trace import
  accepts. It writes a file and sends nothing.
- `model-migrate demo` runs the scan on the synthetic app in `examples/demo-app`, now shipped in
  the package, with the bundled data: it reads nothing of yours and makes no request.

## 0.1.0 (2026-10-08)

First release.

- `model-migrate scan [dir]` finds the model IDs in JavaScript, TypeScript, Python, YAML, JSON and
  `.env` files that have an announced shutdown on the OpenAI API, the Claude API, the Gemini API or
  Vertex AI, and prints each one's shutdown date, the provider's recommended replacement, the
  replacement's list-price ratio per token, the API changes the provider documents, the files and
  lines it is in, and a page with the sources.
- `--json` for programs; `--offline` to use the bundled data and make no request.
- Data from the providers' own deprecation and pricing pages, read on 8 October 2026: 89 language
  model retirements from 1 July 2025 on, 27 of them due between 8 October 2026 and 6 January 2027.
- Errors carry `code`, `cause`, `fix` and `retryable`.
