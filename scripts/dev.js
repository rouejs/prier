import * as esbuild from "esbuild";
let ctx = await esbuild.context({
  entryPoints: ["./src/prier.ts"],
  sourcemap: true,
  bundle: true,
  format: "esm",
  splitting: true,
  // watch: {
  //   onRebuild(error, result) {
  //     if (error) console.error("watch build failed:", error);
  //     else console.log("watch build succeeded:", result);
  //   },
  // },
  outdir: "./dist",
});
await ctx.watch();
console.log("watching...");
