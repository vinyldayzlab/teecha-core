import express from "express";
import type { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

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
    res.json({ ok: true });
  });

  return app;
};
