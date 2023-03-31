import * as esbuild from "esbuild";
esbuild.build({
  entryPoints: ["./src/index.ts"],
  sourcemap: true,
  bundle: true,
  format: "esm",
  splitting: true,
  minify: true,
  outdir: "./dist",
});
