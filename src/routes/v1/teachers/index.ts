import express, { Router } from "express";
import authenticateUser from "@middleware/authenticate-user";
import validateRequest from "@middleware/validate-request";
import { createTeacherController, validateTeacherController } from "./controller";
import { createTeacherSchema, validateTeacherSchema } from "@data/teacher-schemas";

const teachers: Router = express.Router();

teachers.use(authenticateUser);
teachers.post("/validate", validateRequest(validateTeacherSchema), validateTeacherController);
teachers.post("/create", validateRequest(createTeacherSchema), createTeacherController);

export default teachers;
