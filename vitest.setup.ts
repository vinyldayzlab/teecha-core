import { vi } from "vitest";
import type { Request, Response, NextFunction } from "express";

vi.mock("@/middleware/authenticate-user", () => ({
  default: (_req: Request, _res: Response, next: NextFunction) => {
    next();
  },
}));
