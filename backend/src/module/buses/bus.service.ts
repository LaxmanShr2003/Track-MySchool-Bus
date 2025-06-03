import { Exception } from "../../libs/exceptionHandler";
import ORMHelper from "../../libs/ORMHelper";
import { busRepository } from "./bus.repository";
import {
  BusIdSchemaType,
  BusNameSchemaType,
  createBusSchemaType,
} from "./bus.schema";

export const busService = {
  addBus: async (data: createBusSchemaType) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      const isNumberPlateExists = await busRepository.findByBusNumber({
        runner,
        plateNumber: data.plateNumber,
      });
      if (isNumberPlateExists)
        throw new Exception("Number plate already exists!", 400);
      const isBusNameExists = await busRepository.findByBusName({
        runner,
        busName: data.busName,
      });
      if (isBusNameExists) throw new Exception("Bus name already exists!", 400);

      const response = await busRepository.insertBus({ runner, data });
      if (!response) throw new Exception("Unable to save bus data", 400);
      return response;
    } catch (error) {
      throw error;
    }
  },

  findAllBus: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await busRepository.findAllBus({ runner });
      if (response.length < 1) throw new Exception("No any bus found", 404);
      return response;
    } catch (error) {
      throw error;
    }
  },

  findBusById: async (id: BusIdSchemaType) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await busRepository.findById({ runner, id });
      if (!response) throw new Exception("Unable to find user data", 400);

      return response;
    } catch (error) {
      throw error;
    }
  },

  findByBusName: async (busName: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await busRepository.findByBusName({ runner, busName });
      if (!response) throw new Exception("Unable to find bus data", 400);

      return response;
    } catch (error) {
      throw error;
    }
  },

  findByBusNumber: async (busNumber: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await busRepository.findByBusNumber({
        runner,
        plateNumber: busNumber,
      });
      if (!response) throw new Exception("Unable to find user data", 400);

      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteBus: async (id: BusIdSchemaType) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const isBusExists = await busRepository.findById({ runner, id });
      if (!isBusExists) throw new Exception("Bus donot exists!", 404);
      const response = await busRepository.delete({ runner, id });
      if (response.affected === 0)
        throw new Exception("Unable to delete bus data", 400);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateBus: async (id: BusIdSchemaType, data: createBusSchemaType) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const isIdExists = await busRepository.findById({ runner, id });
      if (!isIdExists) throw new Exception("Bus doesnot exists", 400);

      const response = await busRepository.update({ runner, id, data });
      if (!response) throw new Exception("Unable to update bus data", 400);

      return response;
    } catch (error) {
      throw error;
    }
  },
};
