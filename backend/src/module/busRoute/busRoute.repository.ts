import { Runner } from "../../global/global";

import { BusRoute } from "../../models/BusRoute";

import { RouteAssignment } from "../../models/RouteAssignment";

import { CreateBusRouteSchemaType } from "./busRoute.schema";
import { Checkpoint } from "../../models/CheckPoint";
import { Bus } from "../../models/Bus";

export const BusRouteRepository = {
  insert: async ({
    runner,
    data,
  }: Runner & { data: CreateBusRouteSchemaType }) => {
    const busRouteRepo = runner.manager.getRepository(BusRoute);
    const routeAssignRepo = runner.manager.getRepository(RouteAssignment);
    const checkPointRepo = runner.manager.getRepository(Checkpoint);

    try {
      const busRoute = busRouteRepo.create({
        routeName: data.routeName,
        startLat: data.startLat,
        endLng: data.endLng,
        startingPointName: data.startingPointName,
        status: data.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await busRouteRepo.save(busRoute);

      if (data.checkpoints && data.checkpoints.length > 0) {
        const checkpoints = data.checkpoints.map((cp) =>
          checkPointRepo.create({
            lat: cp.lat,
            lng: cp.lng,
            label: cp.label ?? null,
            order: cp.order,
            busRoute: busRoute,
          })
        );
        await checkPointRepo.save(checkpoints);
      }

      const assignments = data.studentIds.map((studentId) =>
        routeAssignRepo.create({
          busId: data.busId,
          driverId: data.driverId,
          studentId,
          assignedDate: new Date(),
          endDate: data.endDate ?? null,
          assignmentStatus: data.assignmentStatus ?? "ACTIVE",
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
      const response = await repo.findOne({
        where: {
          id: id.id,
        },
        relations: ["routeAssignment"],
      });
      const test = await repo.find();
      console.log(test);
      return response;
    } catch (err: any) {
      err.level = "DB";
      throw err;
    }
  },

  findUnassignedBuses: async ({ runner }: Runner) => {
    const repo = runner.manager.getRepository(Bus);
    try {
      const unassignedBuses = await repo.find({
        where: { isAssigned: false },
      });
      return unassignedBuses;
    } catch (err: any) {
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
        relations: ["routeAssignment"],
      });
      return response;
    } catch (err: any) {
      err.level = "DB";
      throw err;
    }
  },

  delete: async ({ runner, id }: Runner & { id: number }) => {
    const busRouteRepo = runner.manager.getRepository(BusRoute);

    try {
      // Delete bus route
      await busRouteRepo.delete(id);

      return { success: true };
    } catch (err: any) {
      err.level = "DB";
      throw err;
    }
  },

  // Existing methods...

  // update: async ({
  //   runner,
  //   id,
  //   data,
  // }: Runner & {
  //   id: string;
  //   data: Partial<CreateBusRouteSchemaType> & {
  //     busId?: string;
  //     driverId?: string;
  //     studentIds?: string[];
  //     assignedDate?: string;
  //     endDate?: string | null;
  //     assignmentStatus?: "ACTIVE" | "COMPLETED" | "CANCELLED";
  //   };
  // }) => {
  //   const busRouteRepo = runner.manager.getRepository(BusRoute);
  //   const routeAssignmentRepo = runner.manager.getRepository(RouteAssignment);

  //   try {
  //     await runner.startTransaction();

  //     // Find existing BusRoute
  //     const busRoute = await busRouteRepo.findOne({ where: { id } });
  //     if (!busRoute) throw new Error("BusRoute not found");

  //     // Update BusRoute fields if present
  //     if (data.routeName !== undefined) busRoute.routeName = data.routeName;
  //     if (data.startLat !== undefined) busRoute.startLat = data.startLat;
  //     if (data.startLng !== undefined) busRoute.startLng = data.startLng;
  //     if (data.endLat !== undefined) busRoute.endLat = data.endLat;
  //     if (data.endLng !== undefined) busRoute.endLng = data.endLng;
  //     if (data.startingPointName !== undefined)
  //       busRoute.startingPointName = data.startingPointName;
  //     if (data.destinationPointName !== undefined)
  //       busRoute.destinationPointName = data.destinationPointName;
  //     if (data.status !== undefined) busRoute.status = data.status;

  //     await busRouteRepo.save(busRoute);

  //     // If busId, driverId, or studentIds provided, update assignments
  //     if (
  //       data.busId !== undefined &&
  //       data.driverId !== undefined &&
  //       data.studentIds !== undefined &&
  //       data.assignedDate !== undefined
  //     ) {
  //       // Delete existing assignments for this routeId
  //       await routeAssignmentRepo.update(
  //         { busRoute: { id } },
  //         { status: "CANCELLED" }
  //       );

  //       // Create new assignments
  //       const assignments = data.studentIds.map((studentId) =>
  //         routeAssignmentRepo.create({
  //           busId: data.busId,
  //           driverId: data.driverId,
  //           studentId,
  //           assignedDate: data.assignedDate,
  //           endDate: data.endDate ?? null,
  //           status: data.assignmentStatus ?? "ACTIVE",
  //           busRoute: busRoute,
  //         })
  //       );
  //       await routeAssignmentRepo.save(assignments);
  //     }

  //     await runner.commitTransaction();

  //     return busRoute;
  //   } catch (err: any) {
  //     await runner.rollbackTransaction();
  //     err.level = "DB";
  //     throw err;
  //   } finally {
  //     await runner.release();
  //   }
  // },

  findAllBusRoute: async ({ runner }: Runner) => {
    const repo = await runner.manager.getRepository(BusRoute);
    try {
      const response = await repo.find({
        relations: ["routeAssignment"],
      });
      return response;
    } catch (err: any) {
      err.level = "DB";
      throw err;
    }
  },
};
