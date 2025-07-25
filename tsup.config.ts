import { defineConfig } from "tsup";
import path from "path";

export default defineConfig({
  entry: ["src/app.ts"],
  outDir: "dist",
  format: ["esm"],
  sourcemap: true,
  target: "node18",
  clean: true,
  dts: false,
  tsconfig: "./tsconfig.json",
  esbuildOptions(options) {
    options.alias = {
      "@": path.resolve(__dirname, "src"),
      "@errors": path.resolve(__dirname, "src/errors"),
      "@db": path.resolve(__dirname, "src/db"),
      "@routes": path.resolve(__dirname, "src/routes"),
      "@setup": path.resolve(__dirname, "src/setup"),
      "@middleware": path.resolve(__dirname, "src/middleware"),
      "@tests": path.resolve(__dirname, "src/tests"),
    };
  },
});
