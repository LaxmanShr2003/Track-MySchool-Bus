import { Runner } from "../../global/global";
import { uniqueKey } from "../../libs/hash";
import { Bus } from "../../models/Bus";
import { BusRoute } from "../../models/BusRoute";
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
        },
        relations: {
          busRoute: true,
        },
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
      const response = await repo.find()
      return response;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findByBusName: async ({ runner, busName }: Runner & Pick<Bus, "busName">) => {
    const repo = runner.manager.getRepository(Bus);
    try {
      const response = await repo.findOne({
        where: {
          busName: busName,
        },
        relations: {
          busRoute: true,
        },
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
        },
        relations: {
          busRoute: true,
        },
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
};
