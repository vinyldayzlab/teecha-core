import express, { type Request, type Response, Router } from "express";
import { runIssueTestToken } from "@/issue-test-token";
import config from "@/config";

const health: Router = express.Router();

health.get("/health", (req: Request, res: Response) => {
  runIssueTestToken();
  res.json({ ok: true, environment: config.env });
});

export default health;
