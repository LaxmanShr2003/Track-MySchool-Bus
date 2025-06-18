import { Exception } from "../../libs/exceptionHandler";
import ORMHelper from "../../libs/ORMHelper";
import { busRepository } from "../buses/bus.repository";
import { driverRepository } from "../driver/driver.repository";
import { StudentRepository } from "../students/student.repository";
import { BusRouteRepository } from "./busRoute.repository";
import { CreateBusRouteSchemaType } from "./busRoute.schema";

export const BusRouteService = {
  addBusRoute: async (data: CreateBusRouteSchemaType) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const isBusRouteExists = await BusRouteRepository.findBusRouteByName({
        runner,
        routeName: { routeName: data.routeName },
      });
      if (isBusRouteExists)
        throw new Exception("Bus route name already exists", 400);

      await ORMHelper.createTransaction();

      const busRouteResponse = await BusRouteRepository.insert({
        runner,
        data,
      });

      await busRepository.setAssignedTrue({ runner, busId: data.busId });
      await driverRepository.setAssignedTrue({
        runner,
        driverId: data.driverId,
      });
      await StudentRepository.setAssignedTrue({
        runner,
        studentIds: data.studentIds,
      });

      await runner.commitTransaction();
      return busRouteResponse;
    } catch (error) {
      await runner.rollbackTransaction();
      throw error;
    } finally {
      await runner.release();
    }
  },

  deleteBusRoute: async (id: number) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const isBusRouteExists = await BusRouteRepository.findBusRouteById({
        runner,
        id: { id: id },
      });
      if (!isBusRouteExists)
        throw new Exception("Bus route is not exists", 400);
      const assignments = isBusRouteExists.routeAssignment;
      if (assignments?.length) {
        const busId = assignments[0].busId;
        const driverId = assignments[0].driverId;
        const studentIds = assignments.map((a) => a.studentId);

        // Mark assigned entities as false (optional based on your logic)
        await busRepository.setAssignedFalse({ runner, busId });
        await driverRepository.setAssignedFalse({ runner, driverId });
        await StudentRepository.setAssignedFalse({ runner, studentIds });
      }
      const response = await BusRouteRepository.delete({
        runner,
        id: { id: id },
      });
      if (!response.success)
        throw new Exception("Unable to delete busRoute", 400);
      return response;
    } catch (error) {
      throw error;
    }
  },

  findBusRouteById: async (id: number) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await BusRouteRepository.findBusRouteById({
        runner,
        id: { id: id },
      });
      if (!response) throw new Exception("Bus route not found", 400);
      return response;
    } catch (error) {
      throw error;
    }
  },
  findBusRouteByName: async (busRouteName: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await BusRouteRepository.findBusRouteByName({
        runner,
        routeName: { routeName: busRouteName },
      });
      if (!response)
        throw new Exception("Bus route not found by this name", 400);

      return response;
    } catch (error) {
      throw error;
    }
  },
  findAllBusRoute: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await BusRouteRepository.findAllBusRoute({ runner });
      if (!response) throw new Exception("Unable to fetch the bus route", 400);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
