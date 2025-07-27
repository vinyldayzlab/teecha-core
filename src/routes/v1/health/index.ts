import express, { type Request, type Response, Router } from "express";
import { runIssueTestToken } from "@/issue-test-token";
import config from "@/config";

const health: Router = express.Router();

health.get("/", (req: Request, res: Response) => {
  runIssueTestToken();
  res.json({ ok: true, environment: config.env });
});

health.get("/test", (req: Request, res: Response) => {
  throw new Error("Test error");
});

export default health;
