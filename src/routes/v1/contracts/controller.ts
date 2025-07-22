import type { NextFunction, Request, Response } from "express";
import { validateContract } from "./service";

export const validateContractController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { teacher_id, student_email } = req.body;
    const valid = await validateContract(teacher_id, student_email);
    res.status(200).json(valid);
  } catch (err) {
    next(err);
  }
};

// tirar student do pending_students, criar um contrato e adicionar ele no array de contracts dentro de teacher
