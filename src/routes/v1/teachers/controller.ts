import type { NextFunction, Request, Response } from "express";
import { validateTeacher } from "./service";

export const validateTeacherController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { teacher_code } = req.body;
    const teacherId = await validateTeacher(teacher_code);
    res.status(200).json(teacherId);
  } catch (err) {
    next(err);
  }
};
