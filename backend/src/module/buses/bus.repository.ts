import { Runner } from "../../global/global";
import { Exception } from "../../libs/exceptionHandler";
import { uniqueKey } from "../../libs/hash";
import { Bus } from "../../models/Bus";
import {
  BusIdSchemaType,
  BusNameSchemaType,
  BusNumberPlateSchemaType,
  createBusSchemaType,
} from "./bus.schema";

export const busRepository = {
  insertBus: async ({
    runner,
    data,
  }: Runner & { data: createBusSchemaType }) => {
    const repo = runner.manager.getRepository(Bus);

    try {
      const response = await repo.save({
        id: uniqueKey(),
        isAssigned: false,
        ...data,
      });
      return response;
    } catch (error: any) {
      error.level == "DB";
      throw error;
    }
  },

  findById: async ({ runner, id }: Runner & { id: BusIdSchemaType }) => {
    const repo = runner.manager.getRepository(Bus);
    try {
      const response = await repo.findOne({
        where: {
          id: id.id,
        }
      });
      return response;
    } catch (error: any) {
      error.level == "DB";
      throw error;
    }
  },

  findAllBus: async ({ runner }: Runner) => {
    const repo = runner.manager.getRepository(Bus);
    try {
      const response = await repo.find();
      return response;
    } catch (error: any) {
      error.level = "DB";
      throw error;
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

  findByBusName: async ({ runner, busName }: Runner & Pick<Bus, "busName">) => {
    const repo = runner.manager.getRepository(Bus);
    try {
      const response = await repo.findOne({
        where: {
          busName: busName,
        }
      });
      return response;
    } catch (error: any) {
      error.level == "DB";
      throw error;
    }
  },

  findByBusNumber: async ({
    runner,
    plateNumber,
  }: Runner & Pick<Bus, "plateNumber">) => {
    const repo = runner.manager.getRepository(Bus);
    try {
      const response = await repo.findOne({
        where: {
          plateNumber: plateNumber,
        }
      });
      return response;
    } catch (error: any) {
      error.level == "DB";
      throw error;
    }
  },

  delete: async ({ runner, id }: Runner & { id: BusIdSchemaType }) => {
    const repo = runner.manager.getRepository(Bus);
    try {
      const deleteResponse = await repo.delete(id);
      return deleteResponse;
    } catch (error: any) {
      error.level == "DB";
      throw error;
    }
  },

  update: async ({
    runner,
    id,
    data,
  }: Runner & { id: BusIdSchemaType; data: createBusSchemaType }) => {
    const repo = runner.manager.getRepository(Bus);
    try {
      const updatedResult = await repo.update({ id: id.id }, { ...data });
      const response = await repo.findOne({ where: { id: id.id } });

      return response;
    } catch (error: any) {
      error.level == "DB";
      throw error;
    }
  },

  setAssignedTrue: async ({ runner, busId }: Runner & { busId: string }) => {
    const repo = runner.manager.getRepository(Bus);
    try {
      const response = await repo.update({ id: busId }, { isAssigned: true });
      return response;
    } catch (err: any) {
      err.level = "DB";
      throw err;
    }
  },

  setAssignedFalse: async ({ runner, busId }: Runner & { busId: string }) => {
    const repo = runner.manager.getRepository(Bus);
    try {
      const response = await repo.update({ id: busId }, { isAssigned: false });
      return response;
    } catch (err: any) {
      err.level = "DB";
      throw err;
    }
  },
};
