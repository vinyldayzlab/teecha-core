import express, { Router } from "express";
import authenticateUser from "@middleware/authenticate-user";
import {
  createTeacherController,
  validateTeacherController,
} from "./controller";
import {
  validateTeacherSchema,
  createTeacherSchema,
} from "../../../data/request-schemas";
import validateRequest from "@middleware/validate-request";

const teachers: Router = express.Router();

teachers.use(authenticateUser);
teachers.post(
  "/validate",
  validateRequest(validateTeacherSchema),
  validateTeacherController,
);
teachers.post(
  "/create",
  validateRequest(createTeacherSchema),
  createTeacherController,
);

export default teachers;
