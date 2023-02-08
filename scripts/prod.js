import * as esbuild from "esbuild";
esbuild.build({
  entryPoints: ["./src/prier.ts"],
  sourcemap: true,
  bundle: true,
  format: "esm",
  splitting: true,
  minify: true,
  outdir: "./dist",
});
