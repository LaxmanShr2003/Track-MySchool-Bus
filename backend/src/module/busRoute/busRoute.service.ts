import { validateUnassigned } from "../../libs/checkUnassignedUser";
import { Exception } from "../../libs/exceptionHandler";
import { groupAssignments } from "../../libs/groupAssignments";
import ORMHelper from "../../libs/ORMHelper";
import { BusRoute } from "../../models/BusRoute";
import { RouteAssignment } from "../../models/RouteAssignment";
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

      await ORMHelper.createTransaction(runner);
      await validateUnassigned(runner, {
        busId: data.busId,
        driverId: data.driverId,
        studentIds: data.studentIds,
      });
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

      await ORMHelper.commitTransaction(runner);
      return busRouteResponse;
    } catch (error) {
      await ORMHelper.rollBackTransaction(runner);
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  deleteBusRoute: async (id: number) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      // Start transaction
      await ORMHelper.createTransaction(runner);

      const busRouteRepo = runner.manager.getRepository(BusRoute);
      const assignmentRepo = runner.manager.getRepository(RouteAssignment);

      // Fetch the bus route with its assignments
      const busRoute = await BusRouteRepository.findBusRouteById({
        runner,
        id: { id },
      });

      if (!busRoute) throw new Exception("Bus route does not exist", 400);

      // Mark route as INACTIVE
      await busRouteRepo.update({ id }, { status: "INACTIVE" });

      // Cancel all assignments for this route
      await assignmentRepo.update(
        { busRoute: { id } },
        { assignmentStatus: "CANCELLED" }
      );

      // Unassign related entities if any
      const assignments = busRoute.routeAssignment as RouteAssignment[];
      if (assignments?.length) {
        const { busId, driverId } = assignments[0];
        const studentIds = assignments.map((a) => a.studentId);

        await busRepository.setAssignedFalse({ runner, busId });
        await driverRepository.setAssignedFalse({ runner, driverId });
        await StudentRepository.setAssignedFalse({ runner, studentIds });
      }

      await ORMHelper.commitTransaction(runner);

      return { success: true };
    } catch (err) {
      await ORMHelper.rollBackTransaction(runner);
      throw err;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  findBusRouteById: async (id: number) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response: BusRoute = await BusRouteRepository.findBusRouteById({
        runner,
        id: { id: id },
      });
      if (!response) throw new Exception("Bus route not found", 400);
      const transformedRoutes = {
        ...response,
        routeAssignment: groupAssignments(response.routeAssignment),
      };

      return transformedRoutes;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
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
    } finally {
      await ORMHelper.release(runner);
    }
  },
  findAllBusRoute: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response: BusRoute[] = await BusRouteRepository.findAllBusRoute({
        runner,
      });
      if (!response) throw new Exception("Unable to fetch the bus route", 400);

      const transformedRoutes = response.map((route) => ({
        ...route,
        routeAssignment: groupAssignments(route.routeAssignment),
      }));
      return transformedRoutes;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },
};
