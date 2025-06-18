import { Router } from "express";
import ZOD from "../../middlewares/schemaValidator";
import { createBusRouteSchema } from "./busRoute.schema";
import { BusRouteController } from "./busRoute.controller";

export const busRouteRouter = (router: Router) => {
  router.post(
    "/busRoute",
    ZOD.requestParser({
      schema: createBusRouteSchema,
      type: "Body",
    }),
    BusRouteController.addDriver
  );
};
