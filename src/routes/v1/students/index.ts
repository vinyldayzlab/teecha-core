import express, { Router } from "express";
import authenticateUser from "@middleware/authenticate-user";
import { validateStudentController } from "./controller";
import validateRequest from "@middleware/validate-request";
import { validateStudentSchema } from "@data/student-schemas";

const students: Router = express.Router();

students.use(authenticateUser);
students.post("/validate", validateRequest(validateStudentSchema), validateStudentController);

export default students;
