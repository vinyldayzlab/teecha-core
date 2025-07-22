import type { Request, Response } from "express";
import EntityNotFoundError from "../../../errors/EntityNotFoundError";
import { getTeacherByCode } from "../../../db/teachers";

export const validateTeacher = async (req: Request, res: Response) => {
  const { teacher_code } = req.body;
  const teacher = await getTeacherByCode(teacher_code);
  if (!teacher) {
    throw new EntityNotFoundError({
      message: "Teacher not found with provided code",
      statusCode: 404,
      code: "ERR_NF",
    });
  }
  res.status(200).json(teacher);
};
