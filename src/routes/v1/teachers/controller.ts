import type { NextFunction, Request, Response } from "express";
import { initializeTeacher, validateTeacher } from "./service";

export const createTeacherController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { auth0_id, roles } = req.body;
    const user = await initializeTeacher(auth0_id, roles);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const validateTeacherController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teacher_code } = req.body;
    const teacherId = await validateTeacher(teacher_code);
    res.status(200).json(teacherId);
  } catch (err) {
    next(err);
  }
};
