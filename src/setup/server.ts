import express from "express";
import type { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import v1 from "@/routes/v1";
import errorHandler from "@/middleware/error-handler";

export const createServer = async () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors())
    .use(helmet());

  app.use("/api/v1", v1);

  app.use(errorHandler);

  return app;
};
