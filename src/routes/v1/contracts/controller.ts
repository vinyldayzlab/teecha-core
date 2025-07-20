import type { Request, Response } from "express";

export const getContracts = (req: Request, res: Response) => {
  // const tasks = await prisma.task.findMany({
  //   where: {
  //     user_id: req.jwtAuth?.payload.sub,
  //   },
  // });
  res.status(200).json([]);
};
