import { describe, beforeEach, afterEach, it, expect, vi, type Mock } from "vitest";
import express, { type Request, type Response, type NextFunction } from "express";
import errorHandler from "@/middleware/error-handler";
import Joi from "joi";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";
import { createTestApp } from "@tests/utils/create-app";
import CustomError from "@errors/CustomError";

vi.mock("@/utils", () => {
  return {
    __esModule: true,
    getErrorMessage: vi.fn(),
  };
});

import { getErrorMessage } from "@/utils";
import { setDebug } from "@tests/vitest.setup";

describe("errorHandler", () => {
  let app: express.Express;
  let req: Request;
  let res: Response;
  const next = vi.fn() as NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    setDebug(false);
    app = createTestApp();
    app.use(express.json());
    req = {} as Request;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      headersSent: false,
    } as unknown as Response;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("default behavior", async () => {
    it("should handle CustomError and return appropriate status and code", async () => {
      const customError = new CustomError({
        message: "Custom error occurred",
        statusCode: 400,
        code: "ERR_CUSTOM",
      });
      errorHandler(customError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: "Custom error occurred",
          code: "ERR_CUSTOM",
        },
      });
      expect(customError).toBeInstanceOf(CustomError);
    });

    it("should handle Joi.ValidationError and return 422", async () => {
      const schema = Joi.object({
        name: Joi.string().required(),
      });

      const { error } = schema.validate({});
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: "Validation error",
          code: "ERR_VALID",
          errors: [
            {
              message: '"name" is required',
            },
          ],
        },
      });
    });

    it("should handle UnauthorizedError and return appropriate status and code", async () => {
      const unauthorizedError = new UnauthorizedError("Unauthorized access");
      errorHandler(unauthorizedError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(unauthorizedError.statusCode);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: "Unauthorized access",
          code: "ERR_AUTH",
        },
      });
    });

    it("handles UnauthorizedError without `.code`", () => {
      const err = new UnauthorizedError("Not authorized");
      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(err.statusCode);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: "Not authorized",
          code: "ERR_AUTH",
        },
      });
    });

    it("should handle unknown errors and return 500", async () => {
      const unknownError = new Error("Unknown error");
      errorHandler(unknownError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: "An error occurred. Please view logs for more details.",
        },
      });
    });
  });

  describe("environment logic", async () => {
    it("should respect APP_DEBUG=true", async () => {
      setDebug(true);
      const unknownError = new Error("Debug mode error");
      errorHandler(unknownError, req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(unknownError);
    });

    it("should respect APP_DEBUG=false", async () => {
      const unknownError = new Error("Production mode error");
      errorHandler(unknownError, req, res, next);
      console.log("x", res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: "An error occurred. Please view logs for more details.",
        },
      });
    });
  });

  describe("fallback logic", async () => {
    it("should use getErrorMessage when it returns a non-empty string", () => {
      (getErrorMessage as Mock).mockReturnValue("Specific error message");

      const err = new Error("Original");
      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: "Specific error message",
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should use default fallback message when getErrorMessage returns empty", () => {
      (getErrorMessage as Mock).mockReturnValue("");

      const err = new Error("Original");
      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          message: "An error occurred. Please view logs for more details.",
        },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
