import { Request, Response, NextFunction } from "express";
import {
  BusRouteIdSchemaType,
  BusRouteNameSchemaType,
  CreateBusRouteSchemaType,
} from "./busRoute.schema";
import { BusRouteService } from "./busRoute.service";
import { messageFormater } from "../../libs/messageFormater";

export const BusRouteController = {
  addDriver: async (
    req: Request<{}, {}, CreateBusRouteSchemaType>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const busRouteData = req.body;
      const response = await BusRouteService.addBusRoute(busRouteData);
      res.json(
        messageFormater(true, response, "Successfully added bus route", 200)
      );
    } catch (error) {
      next(error);
    }
  },

  findAllBusRoute: async (
    req: Request<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await BusRouteService.findAllBusRoute();

      res.json(
        messageFormater(
          true,

          response.length === 0 ? "No bus routes found" : undefined,
          response,
          200
        )
      );
    } catch (error) {
      next(error);
    }
  },

  findBusRouteById: async (
    req: Request<{ id: number }, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const response = await BusRouteService.findBusRouteById(id);
      res.json(
        messageFormater(true, "Successfully fetched bus route", response, 200)
      );
    } catch (error) {
      next(error);
    }
  },
  findBusRouteByName: async (
    req: Request<BusRouteNameSchemaType, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { routeName } = req.params;
      const response = await BusRouteService.findBusRouteByName(routeName);
      res.json(
        messageFormater(true, response, "Successfully fetched bus route", 200)
      );
    } catch (error) {
      next(error);
    }
  },

  deleteRoute: async (
    req: Request<BusRouteIdSchemaType, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const response = await BusRouteService.deleteBusRoute(id);
      res.json(
        messageFormater(
          true,
          response.success ? "Bus route deleted successfully" : undefined,
          200
        )
      );
    } catch (error) {
      next(error);
    }
  },
};
