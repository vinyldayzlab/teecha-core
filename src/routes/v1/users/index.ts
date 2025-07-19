import express, { Router } from "express";
import { getUser } from "./controller";

const users: Router = express.Router();

users.get("/:id", getUser);

export default users;
