import { Express, Router } from "express";
import { studentRoutes } from "../module/students/student.routes";
import { BusRouter } from "../module/buses/bus.routes";
import { driverRoute } from "../module/driver/driver.routes";
import { busRouteRouter } from "../module/busRoute/busRoute.route";

export const router = (app: Express) => {
  const router = Router();
  studentRoutes(router);
  BusRouter(router);
  driverRoute(router);
  busRouteRouter(router);
  app.use("/api/", router);
};
