import type { Request, Response, NextFunction } from "express";
import EntityNotFoundError from "@errors/EntityNotFoundError";
import logger from "@/logger";
import { getUserByAuth0Id } from "@db/users";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // logger
  //   .child({ logMetadata: `User: ${req.auth?.payload.sub}` })
  //   .debug("Requesting users");
  const auth0Id = req.auth?.payload.sub;
  if (!auth0Id) {
    throw new EntityNotFoundError({
      message: "User ID not found",
      statusCode: 404,
      code: "ERR_NF",
    });
  }
  const user = await getUserByAuth0Id(auth0Id);
  if (!user) {
    throw new EntityNotFoundError({
      message: "User not found with specified ID",
      statusCode: 404,
      code: "ERR_NF",
    });
  }
  res.status(200).json(user);
};
