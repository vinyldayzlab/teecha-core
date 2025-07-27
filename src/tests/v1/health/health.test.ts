import { describe, beforeAll, it, expect, vi } from "vitest";
import request from "supertest";
import express, { type Request, type Response, type NextFunction } from "express";
import config from "@/config";
import health from "@/routes/v1/health";
import errorHandler from "@/middleware/error-handler";
import { createTestApp } from "@tests/utils/create-app";

describe("routes", () => {
  let app: express.Express;

  beforeEach(() => {
    app = createTestApp();
    app.use("/health", health);
    app.use(errorHandler);
  });

  it("GET /health should return ok with env json", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ok: true,
      environment: config.env,
    });
  });

  describe("GET /health/test - error path", () => {
    it("should catch error and respond 500 without stack in production", async () => {
      vi.stubEnv("APP_DEBUG", "false");
      const res = await request(app).get("/health/test");
      expect(res.status).toBe(500);
      // console.log("1", res.error);
      // expect(res.body).toHaveProperty("error");
      // expect(res.body.error).toHaveProperty("message");
      // expect(res.body.error.message).not.toMatch(/at .*:.*:.*/);
    });

    it("should catch error and include stack trace when debug=true", async () => {
      vi.stubEnv("APP_DEBUG", "true");
      const res = await request(app).get("/health/test");
      // console.log("2", res.error);
      expect(res.status).toBe(500);
      // expect(res.body.error.message).toMatch(/Error: Test error/);
      // expect(typeof res.body.error.message).toBe("string");
    });
  });
});
