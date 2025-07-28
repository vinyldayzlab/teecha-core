import type { NextFunction, Request, Response } from "express";
import { validateStudent } from "@routes/v1/students/service/functions";
import { getPendingContracts } from "@routes/v1/contracts/service";

export const validateStudentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teacher_id, student_email } = req.body;
    const contracts = await getPendingContracts(teacher_id as string, student_email as string);
    const result = validateStudent(contracts, student_email);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
