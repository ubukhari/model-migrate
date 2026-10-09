import { defineConfig } from "tsup";

/**
 * No runtime dependencies: npx installs one package. The retirement data is
 * bundled into dist as the offline fallback; the CLI's only request is the GET for the live copy
 * (src/data.ts).
 */
export default defineConfig({
  entry: { cli: "src/cli.ts", index: "src/index.ts" },
  format: ["esm"],
  platform: "node",
  target: "node20",
  dts: { entry: { index: "src/index.ts" } },
  sourcemap: true,
  clean: true,
  splitting: false,
});
