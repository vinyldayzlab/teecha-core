import { vi } from "vitest";
import type { Request, Response, NextFunction } from "express";

vi.mock("@/middleware/authenticate-user", () => ({
  default: (_req: Request, _res: Response, next: NextFunction) => {
    next();
  },
}));

vi.mock("@/config", () => ({
  default: {
    mongoURL: "mongodb://localhost:27017/test",
    appSecret: "my-test-secret",
    env: "test",
    debug: "true",
  },
}));
