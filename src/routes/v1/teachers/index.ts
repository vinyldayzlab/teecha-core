import express, { Router } from "express";
import authenticateUser from "../../../middleware/authenticate-user";
import { validateTeacher } from "./controller";
import { validateTeacherSchema } from "../../../data/request-schemas";
import validateRequest from "../../../middleware/validate-request";

const teachers: Router = express.Router();

teachers.use(authenticateUser);
teachers.post(
  "/validate",
  validateRequest(validateTeacherSchema),
  validateTeacher,
);

export default teachers;
