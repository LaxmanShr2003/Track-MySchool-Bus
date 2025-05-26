import express, { Express } from "express";
import helmet from "helmet";
import path from "path";
import morgan from "morgan";
import * as dotenv from "dotenv";
import cors from "cors";
import { env } from "./env.config";
import { router } from "../shared";
// import morgan from 'morgan'; // optional

dotenv.config();

export const initializeExpressServer = (app: Express) => {
  // app.use(
  //   '/static/',
  //   express.static(path.join(process.env.PUBLIC_PATH as string, '/public/'))
  // );
  app.use("/static", express.static(path.join(env.ACCESS_PATH!)));

  app.use(morgan("dev"));
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.disable("x-powered-by");
  app.use(cors({ origin: "*" }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  router(app);
  const PORT = env.SERVER_PORT;
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
};
