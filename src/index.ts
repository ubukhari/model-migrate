/** The library behind the CLI: load the retirement data and scan a directory with it. */
export { BUNDLED, DATA_URL, PAGES_URL, isDataset, loadData } from "./data.js";
export type { Dataset, LoadedData, PriceComparison, Retirement } from "./data.js";
export { CliError, type Problem } from "./errors.js";
export { main } from "./main.js";
export { makeMatcher, scan, scanText } from "./scan.js";
export type { Finding, Location, ScanResult } from "./scan.js";

/** The day the README sample was recorded on (scripts/sample.mjs). */
export const SAMPLE_DATE = "2026-10-08";
