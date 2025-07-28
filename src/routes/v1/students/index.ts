import express, { Router } from "express";
import authenticateUser from "@middleware/authenticate-user";
import { validateStudentController } from "./controller";

const students: Router = express.Router();

students.use(authenticateUser);
students.use((req, res, next) => {
  console.log("Student route hit:", req.method, req.path);
  next();
});
students.post("/validate", validateStudentController);

export default students;
