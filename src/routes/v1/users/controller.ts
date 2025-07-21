import type { Request, Response, NextFunction } from "express";
import EntityNotFoundError from "../../../errors/EntityNotFoundError";
import logger from "../../../logger";

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
  // logger
  //   .child({ logMetadata: `User: ${req.auth?.payload.sub}` })
  //   .debug("Requesting users");
  res.status(200).json({ id: 1, name: "Lucca" });
};
