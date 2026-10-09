/** Every error and warning carries what went wrong, why, how to fix it, and whether a retry helps. */
interface Problem {
    code: string;
    cause: string;
    fix: string;
    retryable: boolean;
}
declare class CliError extends Error implements Problem {
    readonly code: string;
    readonly cause: string;
    readonly fix: string;
    readonly retryable: boolean;
    /** 2 for a usage mistake, 1 for anything else */
    readonly exitCode: number;
    constructor(p: Problem, exitCode?: number);
    toJSON(): Problem;
}

declare const DATA_URL = "https://agentwares-agentcheck.vercel.app/models/retirements.json";
declare const PAGES_URL = "https://agentwares-agentcheck.vercel.app/models";
type ProviderKey = "openai" | "anthropic" | "gemini-api" | "vertex-ai";
interface Price {
    input: number;
    output: number;
}
interface PriceComparison {
    replacement: string;
    retiring: Price;
    replacementPrice: Price;
    ratio: Price;
    from?: string;
    until?: string;
    note?: string;
}
interface Retirement {
    provider: ProviderKey;
    id: string;
    aliases: string[];
    kind: "model" | "fine-tune";
    finetunePrefixes?: string[];
    announced: string | null;
    shutdown: string;
    shutdownIsEarliest: boolean;
    replacements: string[];
    replacementNote?: string;
    source: string;
    seen: string;
    prices: PriceComparison[];
    priceNote?: string;
    breaks: {
        short: string;
        text: string;
        source: string;
    }[];
    notes: string[];
}
interface Dataset {
    version: 1;
    updated: string;
    windowStart: string;
    scope: string;
    priceBasis: string;
    providers: Record<ProviderKey, {
        name: string;
        platform: string;
        deprecations: string;
    }>;
    entries: Retirement[];
}
declare const BUNDLED: Dataset;
interface LoadedData {
    data: Dataset;
    source: "live" | "bundled";
    warnings: Problem[];
}
type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;
/** Enough of the shape to trust: a version 1 document whose entries carry what the CLI prints. */
declare function isDataset(x: unknown): x is Dataset;
declare function loadData(opts: {
    offline?: boolean;
    fetch?: FetchLike;
    url?: string;
}): Promise<LoadedData>;

interface Deps {
    stdout: (s: string) => void;
    stderr: (s: string) => void;
    fetch?: FetchLike;
    now?: () => Date;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    /** wait before retrying a provider call; tests pass 0 */
    retryDelayMs?: number;
}
declare function main(argv: string[], deps?: Deps): Promise<number>;

interface Location {
    /** relative to the scanned directory, with forward slashes */
    file: string;
    line: number;
    /** for `.env` files: the variable's name (its value is never read out) */
    envName?: string;
    /** sampling parameters this file also sets, for breaks that concern them */
    sampling?: string[];
}
interface Finding {
    entry: Retirement;
    /** the strings found in the code that name this entry */
    names: string[];
    matchedAs: "id" | "alias" | "fine-tune";
    locations: Location[];
}
interface ScanResult {
    root: string;
    filesRead: number;
    /** files over 1 MB, unreadable, or past the 50,000-file limit */
    filesSkipped: number;
    findings: Finding[];
}
interface Target {
    entry: Retirement;
    matchedAs: Finding["matchedAs"];
}
/**
 * The matcher for one dataset. An ID counts only as a whole token: not inside a longer ID
 * (`gpt-4` in `gpt-4o`, `gpt-4.1` or `gpt-4-turbo`), not in Amazon Bedrock's
 * `anthropic.claude-…-v1:0` or Google Cloud's `claude-…@date` forms (those platforms set their own
 * dates), and an ID with no hyphen (`o1`, `o3`) only where it is plainly a value: quoted, or after
 * `=`, `:` or `/`.
 */
declare function makeMatcher(data: Dataset): (text: string) => {
    name: string;
    targets: Target[];
}[];
/** Scan one file's text. `file` is only a label. */
declare function scanText(file: string, text: string, matchLine: ReturnType<typeof makeMatcher>): {
    entry: Retirement;
    name: string;
    matchedAs: Finding["matchedAs"];
    location: Location;
}[];
declare function scan(root: string, data: Dataset, today: string): Promise<ScanResult>;

/** The library behind the CLI: load the retirement data and scan a directory with it. */

/** The day the README sample was recorded on (scripts/sample.mjs). */
declare const SAMPLE_DATE = "2026-10-08";

export { BUNDLED, CliError, DATA_URL, type Dataset, type Finding, type LoadedData, type Location, PAGES_URL, type PriceComparison, type Problem, type Retirement, SAMPLE_DATE, type ScanResult, isDataset, loadData, main, makeMatcher, scan, scanText };
