# model-migrate

Find the LLM model IDs in this codebase that OpenAI, Anthropic or Google is retiring, and plan the
change, inside Claude Code.

- `/model-migrate:model-migrate` runs `npx -y --allow-git=root github:agentwares/model-migrate scan` on the
  directory you give (the current one by default) and explains each model with a shutdown date:
  the date, the provider's recommended replacement, the replacement's list-price ratio per token,
  and the API changes the provider documents. Then it proposes the code change for you to approve.

## What it runs, reads and sends

- **Runs** one command, through the Bash tool. The skill and plugin pre-approve nothing, so Claude
  Code asks you before the command runs.
- **Fetches** model-migrate with `npx`, from where that command names, and one data file: the
  retirement dates, replacements and prices from agentwares-agentcheck.vercel.app.
- **Reads** JavaScript, TypeScript, Python, YAML, JSON and `.env` files in the directory. From a
  `.env` file it reports variable names, never values.
- **Sends nothing** about your code. No account, no API key, no LLM calls of its own.

Dates and replacements come from each provider's own deprecation page, prices from its pricing
page, each with the date it was read.

Source, the full CLI and its documentation: [github.com/agentwares/model-migrate](https://github.com/agentwares/model-migrate).
MIT licensed, by agentwares.
