import { build } from "esbuild";
build({
  entryPoints: ["./src/prier.ts"],
  sourcemap: true,
  bundle: true,
  format: "esm",
  splitting: true,
  watch: {
    onRebuild(error, result) {
      if (error) console.error("watch build failed:", error);
      else console.log("watch build succeeded:", result);
    },
  },
  outdir: "./dist",
})
  .then(() => {
    console.log("[watch] build finished, watching for changes...");
  })
  .catch(() => process.exit(1));
