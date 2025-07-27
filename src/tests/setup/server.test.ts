import { describe, it, beforeAll, expect } from "vitest";
import request from "supertest";
import { createServer } from "@/server";
import express, { type Request, type Response, type NextFunction } from "express";
import v1 from "@routes/v1";
import config from "@/config";

// silence morgan logs in test
vi.mock("morgan", () => ({
  default: () => (req: Request, res: Response, next: NextFunction) => next(),
}));

describe("createServer", () => {
  let app: express.Express;

  beforeAll(async () => {
    app = await createServer();
    app.use("/api/v1", v1);
  });

  it("should mount /api/v1 routes", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).not.toBe(404);
    expect(res.body).toEqual({ ok: true, environment: config.env });
  });

  it("should return 404 for unknown route", async () => {
    const res = await request(app).get("/non-existent");
    expect(res.status).toBe(404);
  });
});
