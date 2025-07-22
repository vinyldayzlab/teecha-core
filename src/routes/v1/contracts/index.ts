import express, { Router } from "express";
import { validateContractController } from "./controller";
import authenticateUser from "../../../../src/middleware/authenticate-user";

const contracts: Router = express.Router();

contracts.use(authenticateUser);
// ideally this should be a query with multiple contract ids
// contracts.get("/", getContracts);
contracts.post("/validate", validateContractController);

export default contracts;
