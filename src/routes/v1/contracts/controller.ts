import type { Request, Response } from "express";

export const getContracts = (req: Request, res: Response) => {
  // const tasks = await prisma.task.findMany({
  //   where: {
  //     user_id: req.jwtAuth?.payload.sub,
  //   },
  // });
  // const user = getUserById(req.auth.payload.sub);
  // console.log("User: ", user);
  res.status(200).json([]);
};
