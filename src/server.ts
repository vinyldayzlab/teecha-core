import express from "express";
import type { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import v1 from "./routes/v1";
import errorHandler from "./middleware/error-handler";
import config from "./config";
import { runIssueTestToken } from "./issue-test-token";

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors())
    .use(helmet());

  app.get("/health", (req: Request, res: Response) => {
    runIssueTestToken();
    res.json({ ok: true, environment: config.env });
  });

  app.use("/v1", v1);

  app.use(errorHandler);

  return app;
};
