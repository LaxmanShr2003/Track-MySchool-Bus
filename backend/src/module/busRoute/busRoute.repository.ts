import { In } from "typeorm";
import { Runner } from "../../global/global";
import { uniqueKey } from "../../libs/hash";
import ORMHelper from "../../libs/ORMHelper";

import { BusRoute } from "../../models/BusRoute";

import { RouteAssignment } from "../../models/RouteAssignment";

import { CreateBusRouteSchemaType } from "./busRoute.schema";

export const BusRouteRepository = {
  insert: async ({
    runner,
    data,
  }: Runner & { data: CreateBusRouteSchemaType }) => {
    const busRouteRepo = runner.manager.getRepository(BusRoute);
    const routeAssignRepo = runner.manager.getRepository(RouteAssignment);

    try {
      const busRoute = busRouteRepo.create({
        routeName: data.routeName,
        startLat: data.startLat,
        startLng: data.startLng,
        endLat: data.endLat,
        endLng: data.endLng,
        startingPointName: data.startingPointName,
        destinationPointName: data.destinationPointName,
        status: data.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await busRouteRepo.save(busRoute);

      const assignments = data.studentIds.map((studentId) =>
        routeAssignRepo.create({
          busId: data.busId,
          driverId: data.driverId,
          studentId,
          assignedDate: data.assignedDate,
          endDate: data.endDate ?? null,
          status: data.assignmentStatus ?? "ACTIVE",
          busRoute: busRoute,
        })
      );
      await routeAssignRepo.save(assignments);

      return busRoute;
    } catch (err: any) {
      err.level = "DB";
      throw err;
    }
  },

  findBusRouteById: async ({
    runner,
    id,
  }: Runner & { id: Pick<BusRoute, "id"> }) => {
    const repo = await runner.manager.getRepository(BusRoute);
    try {
      const response:BusRoute = await repo.findOne({
        where: {
          id: { id: id.id },
        },
        relations: ["RouteAssignment"],
      });
      return response;
    } catch (err: any) {
      err.level = "DB";
      throw err;
    }
  },

  findBusRouteByName: async ({
    runner,
    routeName,
  }: Runner & { routeName: Pick<BusRoute, "routeName"> }) => {
    const repo = await runner.manager.getRepository(BusRoute);
    try {
      const response = await repo.findOne({
        where: {
          routeName: { routeName: routeName.routeName },
        },
      });
      return response;
    } catch (err: any) {
      err.level = "DB";
      throw err;
    }
  },

  delete: async ({ runner, id }: Runner & { id: Pick<BusRoute, "id"> }) => {
    const busRouteRepo = runner.manager.getRepository(BusRoute);
    const routeAssignmentRepo = runner.manager.getRepository(RouteAssignment);

    try {
      await runner.startTransaction();

      await routeAssignmentRepo.update(
        { busRoute: { id } },
        { status: "CANCELLED" }
      );
      // Delete bus route
      await busRouteRepo.delete(id);

      await runner.commitTransaction();

      return { success: true };
    } catch (err: any) {
      await runner.rollbackTransaction();
      err.level = "DB";
      throw err;
    } finally {
      await runner.release();
    }
  },

  // Existing methods...

  update: async ({
    runner,
    id,
    data,
  }: Runner & {
    id: string;
    data: Partial<CreateBusRouteSchemaType> & {
      busId?: string;
      driverId?: string;
      studentIds?: string[];
      assignedDate?: string;
      endDate?: string | null;
      assignmentStatus?: "ACTIVE" | "COMPLETED" | "CANCELLED";
    };
  }) => {
    const busRouteRepo = runner.manager.getRepository(BusRoute);
    const routeAssignmentRepo = runner.manager.getRepository(RouteAssignment);

    try {
      await runner.startTransaction();

      // Find existing BusRoute
      const busRoute = await busRouteRepo.findOne({ where: { id } });
      if (!busRoute) throw new Error("BusRoute not found");

      // Update BusRoute fields if present
      if (data.routeName !== undefined) busRoute.routeName = data.routeName;
      if (data.startLat !== undefined) busRoute.startLat = data.startLat;
      if (data.startLng !== undefined) busRoute.startLng = data.startLng;
      if (data.endLat !== undefined) busRoute.endLat = data.endLat;
      if (data.endLng !== undefined) busRoute.endLng = data.endLng;
      if (data.startingPointName !== undefined)
        busRoute.startingPointName = data.startingPointName;
      if (data.destinationPointName !== undefined)
        busRoute.destinationPointName = data.destinationPointName;
      if (data.status !== undefined) busRoute.status = data.status;

      await busRouteRepo.save(busRoute);

      // If busId, driverId, or studentIds provided, update assignments
      if (
        data.busId !== undefined &&
        data.driverId !== undefined &&
        data.studentIds !== undefined &&
        data.assignedDate !== undefined
      ) {
        // Delete existing assignments for this routeId
        await routeAssignmentRepo.update(
          { busRoute: { id } },
          { status: "CANCELLED" }
        );

        // Create new assignments
        const assignments = data.studentIds.map((studentId) =>
          routeAssignmentRepo.create({
            busId: data.busId,
            driverId: data.driverId,
            studentId,
            assignedDate: data.assignedDate,
            endDate: data.endDate ?? null,
            status: data.assignmentStatus ?? "ACTIVE",
            busRoute: busRoute,
          })
        );
        await routeAssignmentRepo.save(assignments);
      }

      await runner.commitTransaction();

      return busRoute;
    } catch (err: any) {
      await runner.rollbackTransaction();
      err.level = "DB";
      throw err;
    } finally {
      await runner.release();
    }
  },

  findAllBusRoute: async ({ runner }: Runner) => {
    const repo = await runner.manager.getRepository(BusRoute);
    try {
      const response = await repo.find();
      return response;
    } catch (err: any) {
      err.level = "DB";
      throw err;
    }
  },
};
