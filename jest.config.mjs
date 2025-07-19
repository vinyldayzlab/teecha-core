export default {
  preset: "ts-jest/presets/default-esm", // Use ESM preset
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    // Add this if you use path aliases or need to rewrite imports
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
