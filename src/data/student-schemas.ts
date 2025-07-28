import Joi from "joi";
import { studentEmail, teacherId } from "./joi-validations";

const validateStudent = {
  teacher_id: teacherId,
  student_email: studentEmail,
};

export const validateStudentSchema = Joi.object(validateStudent);
