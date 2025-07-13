import { Router } from "express";
import ZOD from "../../middlewares/schemaValidator";
import { busRouteIdSchema, createBusRouteSchema } from "./busRoute.schema";
import { BusRouteController } from "./busRoute.controller";

export const busRouteRouter = (router: Router) => {
  
  router.post(
    "/bus-route",
    ZOD.requestParser({
      schema: createBusRouteSchema,
      type: "Body",
    }),
    BusRouteController.addDriver
  );
  router.get("/bus-routes", BusRouteController.findAllBusRoute);
  router.get("/bus-route/:id", BusRouteController.findBusRouteById);
  router.delete("/bus-route/:id", BusRouteController.deleteRoute);
};
