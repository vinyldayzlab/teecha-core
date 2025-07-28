import express, { Router } from "express";
import users from "./users";
import teachers from "./teachers";
import health from "./health";
import students from "./students";

const v1: Router = express.Router();

v1.use("/health", health);
v1.use("/students", students);
v1.use("/teachers", teachers);
v1.use("/users", users);

export default v1;
