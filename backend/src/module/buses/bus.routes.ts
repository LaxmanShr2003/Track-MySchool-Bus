import { Router } from "express";
import ZOD from "../../middlewares/schemaValidator";
import {
  BusIdSchema,
  BusNameSchema,
  BusNumberPlateSchema,
  createBusSchema,
} from "./bus.schema";
import { busController } from "./bus.controller";

export const BusRouter = (route: Router) => {
  route.get("/bus/assigned", busController.findUnAssignedBuses);
  route.post(
    "/bus",

    ZOD.requestParser({
      schema: createBusSchema,
      type: "Body",
    }),
    // (req) => console.log(req.body),
    busController.addBus
  );

  route.get("/buses", busController.findAllBuses);
  route.get(
    "/bus/busName/:busName",
    ZOD.requestParser({
      schema: BusNameSchema,
      type: "Params",
    }),
    busController.findByBusName
  );

  route.get(
    "/bus/busNumber/:plateNumber",
    ZOD.requestParser({
      schema: BusNumberPlateSchema,
      type: "Params",
    }),
    busController.findByBusNumber
  );
  route.get(
    "/bus/:id",
    ZOD.requestParser({
      schema: BusIdSchema,
      type: "Params",
    }),
    busController.findById
  );
  route.delete(
    "/bus/:id",
    ZOD.requestParser({
      schema: BusIdSchema,
      type: "Params",
    }),
    busController.deleteBus
  );
  route.patch(
    "/bus/update/:id",
    ZOD.requestParser(
      {
        schema: createBusSchema,
        type: "Body",
      },
      {
        schema: BusIdSchema,
        type: "Params",
      }
    ),

    busController.updateBus
  );
  route.get("/buses", busController.findAllBuses);
};
