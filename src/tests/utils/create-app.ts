import express from "express";

export function createTestApp() {
  const app = express();
  app.use(express.json());
  return app;
}
