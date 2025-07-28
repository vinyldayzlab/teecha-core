import Joi from "joi";

export const auth0Id = Joi.string().trim().min(1).required().messages({
  "string.base": "Auth0 ID must be a string",
  "string.min": "Auth0 ID must have exactly at least 1 character",
  "string.empty": "Auth0 ID must not be empty",
  "any.required": "Auth0 ID is required",
});

export const teacherId = Joi.string()
  .trim()
  .required()
  .pattern(/^[0-9a-fA-F]{24}/)
  .required()
  .messages({
    "string.base": "Teacher ID must be an ObjectId string",
    "string.pattern.base": "Teacher ID must be a valid 24-character hex string",
    "string.min": "Teacher ID must have exactly 24 characters",
    "string.max": "Teacher ID must have exactly 24 characters",
    "string.empty": "Teacher ID must not be empty",
    "any.required": "Teacher ID is required",
  });

export const teacherCode = Joi.string().trim().min(6).max(6).required().messages({
  "string.base": "Teacher Code must be a string",
  "string.min": "Teacher Code must have exactly 6 characters",
  "string.max": "Teacher Code must have exactly 6 characters",
  "string.empty": "Teacher Code must not be empty",
  "any.required": "Teacher Code is required",
});

export const roles = Joi.array()
  .items(
    Joi.string().valid("teacher").messages({
      "string.base": "Role must be a string",
      "any.only": 'Roles can only be "teacher"',
    }),
  )
  .min(1)
  .required()
  .messages({
    "array.base": "Roles must be an array",
    "array.min": "At least one role is required",
    "any.required": "Roles are required",
  });

export const studentEmail = Joi.string().email().trim().required().messages({
  "string.base": "Student email must be a string and a valid email",
  "string.empty": "Student email must not be empty",
  "any.required": "Student email is required",
});
