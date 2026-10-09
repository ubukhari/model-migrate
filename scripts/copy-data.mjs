#!/usr/bin/env node
/**
 * Refresh the bundled fallback from the canonical data the agentcheck pages are built from:
 *
 *   pnpm --filter model-migrate data
 *
 * apps/agentcheck/src/app/models/_data/retirements.json → src/data/retirements.json. The CLI
 * fetches the live copy first; this one is what it uses offline or when the fetch fails.
 * src/data.test.ts fails while the two differ.
 */
import { copyFileSync } from "node:fs";

const from = new URL("../../agentcheck/src/app/models/_data/retirements.json", import.meta.url);
const to = new URL("../src/data/retirements.json", import.meta.url);
copyFileSync(from, to);
console.log(`copied ${from.pathname} -> ${to.pathname}`);
