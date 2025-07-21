import express, { Router } from "express";
import { getUser } from "./controller";
import authenticateUser from "../../../middleware/authenticate-user";

const users: Router = express.Router();

users.use(authenticateUser);
users.get("/", getUser);

export default users;
