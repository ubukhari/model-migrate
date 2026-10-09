---
name: model-migrate
description: Find the LLM model IDs in this codebase that OpenAI, Anthropic or Google has scheduled for shutdown, and plan the change - for each one the shutdown date, the provider's recommended replacement, the replacement's list-price ratio, and the API changes the provider documents (such as sampling parameters that now return 400) - by running model-migrate scan on the local code. Use when the user asks whether a model they use is deprecated or retiring, got a deprecation email, sees "model not found", or wants to move off an old model.
argument-hint: "[dir]"
---

# Find retiring models and plan the change

model-migrate (MIT, [source](https://github.com/agentwares/model-migrate)) reads the code and
config in a directory and lists every model ID that has an announced shutdown on the OpenAI API,
the Claude API, the Gemini API or Vertex AI. Its dates and replacements come from each provider's
own deprecation page, its prices from the provider's pricing page. It sends nothing about the
code; its one request downloads that data.

Run it with the Bash tool (Claude Code asks the user to approve the command; this skill
pre-approves nothing):

```sh
npx -y --allow-git=root github:agentwares/model-migrate scan $ARGUMENTS --json
```

Then, for each finding, most urgent first:

1. **Say what and when.** The model ID as the code names it, the platform, the shutdown date and
   the days left. A finding with `status: "shut_down"` already fails on every request: say so first.
2. **Name the replacement and the price.** Quote `price_ratios` as the tool gives them (per token,
   at list prices, with any period). Say plainly that a per-token ratio leaves out how many tokens
   each model spends; if a break mentions a tokenizer, repeat it. Where there is no ratio, give
   `price_note`. Never compute a cost the tool did not give.
3. **List the documented breaks** (`breaks`), each with its source link, and check the files in
   `locations` for them: for example a `temperature` the replacement rejects.
4. **Propose the change** in the files and lines listed, as a diff for the user to approve. Do not
   edit anything before they approve.
5. **Offer to test before switching, and ask first.** While the old model still answers,
   `npx -y --allow-git=root github:agentwares/model-migrate capture <prompts.jsonl> --model <id>` records its
   answers on the user's own prompts and `npx -y --allow-git=root github:agentwares/model-migrate compare --json`
   replays them on the replacement, a cheaper sibling and another provider's model, reporting pass
   rates and cost per 1,000 calls. Both call the providers on the user's own keys and spend their tokens (at most 100
   prompts per run by default), so run them only when the user agrees, on a prompt file they
   choose. Help them write it: one JSON object per line, `{"prompt": "…"}` or `{"messages": […]}`.

Link each finding's `page_url` for the sources. If the scan finds nothing, say that none of the IDs
in the code has a shutdown date on those four pages, which covers language models only; it is not a
promise that none is coming.
