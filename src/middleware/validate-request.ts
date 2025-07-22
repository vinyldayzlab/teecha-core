import type { NextFunction, Request, Response } from "express";
import type { ObjectSchema } from "joi";

export default function validateRequest(schema: ObjectSchema) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const validated = await schema.validateAsync(req.body, {
        abortEarly: false,
      });
      req.body = validated;
      next();
    } catch (error) {
      next(error);
    }
  };
}
