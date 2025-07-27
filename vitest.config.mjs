import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
      "@errors": new URL("./src/errors", import.meta.url).pathname,
      "@db": new URL("./src/db", import.meta.url).pathname,
      "@middleware": new URL("./src/middleware", import.meta.url).pathname,
      "@routes": new URL("./src/routes", import.meta.url).pathname,
      "@setup": new URL("./src/setup", import.meta.url).pathname,
      "@tests": new URL("./src/tests", import.meta.url).pathname,
    },
    include: ["**/*.test.ts"],
    globals: true,
    coverage: {
      provider: "istanbul",
    },
    environment: "node",
    setupFiles: "./vitest.setup.ts",
    isolate: true,
  },
});
