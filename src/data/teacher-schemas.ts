import Joi from "joi";
import { auth0Id, roles, teacherCode } from "./joi-validations";

const validateTeacher = {
  teacher_code: teacherCode,
};

const createTeacher = {
  auth0_id: auth0Id,
  roles: roles,
};

export const validateTeacherSchema = Joi.object(validateTeacher);
export const createTeacherSchema = Joi.object(createTeacher);
