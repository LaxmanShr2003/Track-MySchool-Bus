import { Express, Router } from "express";
import { studentRoutes } from "../module/students/student.routes";

export const router = (app: Express) => {
  const router = Router();
  studentRoutes(router)
  app.use("/api/", router);
};
