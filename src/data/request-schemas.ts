import Joi from "joi";

// const user = {
//   teacher_code: Joi.string().allow(null).optional().empty(null).messages({
//     "string.base": "Teacher Code must be a string",
//   }),
//   name: Joi.string().min(3).max(255).required().messages({
//     "string.base": "Name must be a string",
//     "string.empty": "Name must not be empty",
//     "string.min": "Name must have at least 3 characters long",
//     "string.max": "Name must not exceed 255 characters",
//     "any.required": "Name is required",
//   }),
// }

const validateTeacher = {
  teacher_code: Joi.string().trim().min(6).max(6).required().messages({
    "string.base": "Teacher Code must be a string",
    "string.min": "Teacher Code must have exactly 6 characters",
    "string.max": "Teacher Code must have exactly 6 characters",
    "string.empty": "Teacher Code must not be empty",
  }),
};

const createTeacher = {
  auth0_id: Joi.string().trim().min(1).required().messages({
    "string.base": "Auth0 ID must be a string",
    "string.min": "Auth0 ID must have exactly at least 1 character",
    "string.empty": "Auth0 ID must not be empty",
    "any.required": "Auth0 ID is required",
  }),
  roles: Joi.array()
    .items(
      Joi.string().valid("teacher").messages({
        "any.only": 'Roles can only be "teacher"',
        "string.base": "Role must be a string",
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Roles must be an array",
      "array.min": "At least one role is required",
      "any.required": "Roles are required",
      "array.includes": "Roles must only include valid values",
    }),
};

export const validateTeacherSchema = Joi.object(validateTeacher);
export const createTeacherSchema = Joi.object(createTeacher);
