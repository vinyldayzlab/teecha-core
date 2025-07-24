import type { NextFunction, Request, Response } from "express";
import config from "@/config";
import { getErrorMessage } from "@/utils";
import CustomError from "@errors/CustomError";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";
import Joi from "joi";

export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent || config.debug) {
    next(error);
    return;
  }

  if (error instanceof Joi.ValidationError) {
    res.status(422).json({
      error: {
        message: "Validation error",
        code: "ERR_VALID",
        errors: error.details.map((item) => ({
          message: item.message,
        })),
      },
    });
    return;
  }

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
      },
    });
    return;
  }

  if (error instanceof UnauthorizedError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: "code" in error ? error.code : "ERR_AUTH",
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      message:
        getErrorMessage(error) ||
        "An error occurred. Please view logs for more details.",
    },
  });
}
