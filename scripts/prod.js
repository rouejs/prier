import { build } from "esbuild";
build({
  entryPoints: ["./src/prier.ts"],
  sourcemap: true,
  bundle: true,
  format: "esm",
  splitting: true,
  minify: true,
  outdir: "./dist",
}).catch(() => process.exit(1));
