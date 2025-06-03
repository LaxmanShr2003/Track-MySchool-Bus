import { Request, Response, NextFunction } from "express";
import {
  BusIdSchemaType,
  BusNameSchemaType,
  BusNumberPlateSchemaType,
  createBusSchemaType,
} from "./bus.schema";
import { busService } from "./bus.service";
import { messageFormater } from "../../libs/messageFormater";

export const busController = {
  addBus: async (
    req: Request<{}, {}, createBusSchemaType>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const busData = req.body;
      const response = await busService.addBus(busData);
      res
        .status(201)
        .json(messageFormater(true, response, "Successfully added user data"));
    } catch (error) {
      next(error);
    }
  },

  findAllBuses: async (
    req: Request<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await busService.findAllBus();
      res
        .status(201)
        .json(messageFormater(true, response, "Successfully fetched all user"));
    } catch (error) {
      next(error);
    }
  },

  findById: async (
    req: Request<BusIdSchemaType, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const response = await busService.findBusById({ id });
      res
        .status(201)
        .json(messageFormater(true, response, "Successfully fetched the user"));
    } catch (error) {
      next(error);
    }
  },

  findByBusName: async (
    req: Request<BusNameSchemaType, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { busName } = req.params;
      const response = await busService.findByBusName(busName);
      res
        .status(201)
        .json(messageFormater(true, response, "Successfully fetched the user"));
    } catch (error) {
      next(error);
    }
  },
  findByBusNumber: async (
    req: Request<BusNumberPlateSchemaType, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { plateNumber } = req.params;
      const response = await busService.findByBusNumber(plateNumber);
      res
        .status(201)
        .json(messageFormater(true, response, "Successfully fetched the user"));
    } catch (error) {
      next(error);
    }
  },

  updateBus: async (
    req: Request<BusIdSchemaType, {}, createBusSchemaType>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const data = req.body;

      const response = await busService.updateBus({ id }, data);
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully updated user data")
        );
    } catch (error) {
      next(error);
    }
  },

  deleteBus: async (
    req: Request<BusIdSchemaType, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const response = await busService.deleteBus({ id });
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully updated user data")
        );
    } catch (error) {
      next(error);
    }
  },
};
