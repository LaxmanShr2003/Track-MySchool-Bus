import { Request, Response, NextFunction } from "express";
import {
  CreateDriverSchemaType,
  DriverEmailSchemaType,
  DriverIdSchemaType,
  DriverMobileNumberSchemaType,
  DriverUserNameSchemaType,

} from "./driver.schema";
import { Exception } from "../../libs/exceptionHandler";
import { driverService } from "./driver.service";
import { messageFormater } from "../../libs/messageFormater";

export const driverController = {
  addDriver: async (
    req: Request<{}, {}, CreateDriverSchemaType>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.file) {
        throw new Exception("Image is required", 400);
      }

      const profileImg = req.file.filename;
      if (!profileImg) {
        throw new Exception("Please insert image", 400);
      }

      const driverData = req.body;
      const imageUrl = `/public/${req.file.filename}`;

      const response = await driverService.addDriver(driverData, imageUrl);
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully added driver data")
        );
    } catch (error) {
      next(error);
    }
  },
  findUnAssignedDriver: async (
    req: Request<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      
      const response = await driverService.findUnassignedDriver();
      res
        .status(201)
        .json(
          messageFormater(
            true,
            response.length > 0
              ? "unasssigned drivers fetched successfully"
              : "All driver are assigned!",
            response
          )
        );
    } catch (err) {
      next(err);
    }
  },

  findAllDrivers: async (
    req: Request<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await driverService.findAllDrivers();
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully fetched all drivers")
        );
    } catch (error) {
      next(error);
    }
  },

  findById: async (
    req: Request<DriverIdSchemaType, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const response = await driverService.findDriverById(id);
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully fetched the driver")
        );
    } catch (error) {
      next(error);
    }
  },

  findDriverByEmail: async (
    req: Request<DriverEmailSchemaType, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.params;
      const response = await driverService.findDriverById(email);
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully fetched the driver")
        );
    } catch (error) {
      next(error);
    }
  },

  findDriverByMobileNumber: async (
    req: Request<DriverMobileNumberSchemaType, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { mobileNumber } = req.params;
      const response = await driverService.findDriverById(mobileNumber);
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully fetched the driver")
        );
    } catch (error) {
      next(error);
    }
  },

  findDriverByUserName: async (
    req: Request<DriverUserNameSchemaType, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userName } = req.params;
      const response = await driverService.findDriverByUserName(userName);
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully fetched the driver")
        );
    } catch (error) {
      next(error);
    }
  },

  deleteDriver: async (
    req: Request<DriverIdSchemaType, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const response = await driverService.deleteDriver(id);
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully deleted driver data")
        );
    } catch (error) {
      next(error);
    }
  },

  updateDriver: async (
    req: Request<DriverIdSchemaType, {}, CreateDriverSchemaType>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const driverData = req.body;

      let imageUrl: string | undefined = undefined;

      if (req.file) {
        imageUrl = `${req.protocol}://${req.get("host")}/public/${req.file.filename}`;
      }

      // Merge imageUrl if it exists
      const updatedData = imageUrl
        ? { ...driverData, profileImageUrl: imageUrl }
        : driverData;

      const response = await driverService.updateDriver(
        id,
        updatedData,
        imageUrl
      );
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully updated driver data")
        );
    } catch (error) {
      next(error);
    }
  },
};
