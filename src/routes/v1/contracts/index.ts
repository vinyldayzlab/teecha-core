import express, { Router } from "express";
import { getContracts } from "./controller";

const contracts: Router = express.Router();

// ideally this should be a query with multiple contract ids
contracts.get("/", getContracts);

export default contracts;
