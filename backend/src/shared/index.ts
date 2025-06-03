import { Express, Router } from "express";
import { studentRoutes } from "../module/students/student.routes";
import { BusRouter } from "../module/buses/bus.routes";
import { driverRoute } from "../module/driver/driver.routes";

export const router = (app: Express) => {
  const router = Router();
  studentRoutes(router);
  BusRouter(router);
  driverRoute(router);
  app.use("/api/", router);
};
