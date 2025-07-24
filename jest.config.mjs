import { readFileSync } from "fs";
import { pathsToModuleNameMapper } from "ts-jest";

const tsconfig = JSON.parse(readFileSync(new URL("./tsconfig.json", import.meta.url)));

export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "./tsconfig.json",
      },
    ],
  },
  collectCoverageFrom: ["src/**/*.{js,ts}", "!src/**/*.d.ts"],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: "<rootDir>/",
    }),
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
