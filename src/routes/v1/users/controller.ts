import type { Request, Response } from "express";

export const getUser = (req: Request, res: Response) => {
  res.status(200).json({ id: 1, name: "Lucca" });
};
