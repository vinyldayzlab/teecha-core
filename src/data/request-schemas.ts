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
// };

const teacher = {
  teacher_code: Joi.string().min(6).max(6).required().messages({
    "string.base": "Teacher Code must be a string",
    "string.min": "Teacher Code must have exactly 6 characters",
    "string.max": "Teacher Code must have exactly 6 characters",
  }),
};

export const validateTeacherSchema = Joi.object(teacher);
