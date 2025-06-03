import { Router } from "express";
import { MulterHelper } from "../../middlewares/multer";
import { env } from "../../config/env.config";
import ZOD from "../../middlewares/schemaValidator";
import { createDriverSchema, driverEmailSchema, driverIdSchema, driverUserNameSchema } from "./driver.schema";
import { driverController } from "./driver.controller";

export const driverRoute = (route: Router) => {
  route.post(
    "/driver",

    MulterHelper.getStorage(env.ACCESS_PATH!, {
      moduleName: "driverProfileImg",
      isFile: false,
    }).single("driverProfileImg"),

    ZOD.requestParser({
      schema: createDriverSchema,
      type: "Body",
    }),
    // (req) => console.log(req),
    driverController.addDriver
  );

  route.get("/drivers", driverController.findAllDrivers);
  route.get(
    "/driver/:id",
    ZOD.requestParser({
      schema: driverIdSchema,
      type: "Params",
    }),
    driverController.findById
  );
   route.get(
    "/driver/email/:email",
    ZOD.requestParser({
      schema: driverEmailSchema,
      type: "Params",
    }),
    driverController.findDriverByEmail
  );
   route.get(
    "/driver/userName/:userName",
    ZOD.requestParser({
      schema: driverUserNameSchema,
      type: "Params",
    }),
    driverController.findDriverByUserName
  );
   route.get(
    "/driver/number/:number",
    ZOD.requestParser({
      schema: driverEmailSchema,
      type: "Params",
    }),
    driverController.findDriverByMobileNumber
  );
   route.delete(
    "/driver/delete/:id",
    ZOD.requestParser({
      schema:driverIdSchema,
      type: "Params",
    }),
    driverController.deleteDriver
  );

   route.patch(
      "/driver/update/:id",
      MulterHelper.getStorage(env.ACCESS_PATH!, {
        moduleName: "driverProfileImg",
        isFile: false,
      }).single("driverProfileImg"),
  
      ZOD.requestParser(
        {
          schema: driverIdSchema,
          type: "Params",
        },
        {
          schema: createDriverSchema,
          type: "Body",
        }
      ),
      driverController.updateDriver
    );
  
  
  
};
