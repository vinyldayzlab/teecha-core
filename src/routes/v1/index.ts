import express, { Router } from "express";
import contracts from "./contracts";
import users from "./users";
import teachers from "./teachers";

const v1: Router = express.Router();

v1.use("/users", users);
v1.use("/teachers", teachers);
v1.use("/contracts", contracts);

export default v1;
