import type { Request, Response, NextFunction } from "express";
import EntityNotFoundError from "../../../errors/EntityNotFoundError";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // throw new EntityNotFoundError({
  //   message: "User not found",
  //   statusCode: 404,
  //   code: "ERR_NF",
  // });
  res.status(200).json({ id: 1, name: "Lucca" });
};
