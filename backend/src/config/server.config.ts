import express, { Express } from "express";
import helmet from "helmet";
import path from "path";
import morgan from "morgan";
import * as dotenv from "dotenv";
import cors from "cors";
import { env } from "./env.config";
import { router } from "../shared";
import { errorHandler } from "../libs/errorHandler";
// import morgan from 'morgan'; // optional

dotenv.config();

export const initializeExpressServer = (app: Express) => {


  app.use("/public", express.static(path.resolve('public')));
  
  app.use(morgan("dev"));
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.disable("x-powered-by");
  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  router(app);
  app.use(errorHandler());
  const PORT = env.SERVER_PORT;
  app.listen(PORT,"0.0.0.0", () => {
    console.log(`Server is running at port ${PORT}`);
  });
};
