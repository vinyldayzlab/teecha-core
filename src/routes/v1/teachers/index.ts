import express, { Router } from "express";
import authenticateUser from "../../../middleware/authenticate-user";
import {
  createTeacherController,
  validateTeacherController,
} from "./controller";
import { validateTeacherSchema } from "../../../data/request-schemas";
import validateRequest from "../../../middleware/validate-request";

const teachers: Router = express.Router();

teachers.use(authenticateUser);
teachers.post(
  "/validate",
  validateRequest(validateTeacherSchema),
  validateTeacherController,
);
teachers.post("/create", createTeacherController);

export default teachers;
