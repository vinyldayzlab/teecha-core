import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm"],
  sourcemap: true,
  target: "node18",
  clean: true,
  dts: false,
  tsconfig: "./tsconfig.json",
  esbuildOptions(options) {
    options.alias = {
      "@": "./src",
    };
  },
});
