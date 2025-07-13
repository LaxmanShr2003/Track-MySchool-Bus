import { Driver } from "typeorm";
import { Exception } from "../../libs/exceptionHandler";
import ORMHelper from "../../libs/ORMHelper";
import { driverRepository } from "./driver.repository";
import { CreateDriverSchemaType } from "./driver.schema";
import { unsyncFromPublic } from "../../libs/unsync";
import {
  checkUserUniqueness,
  CheckUserUniquenessOptions,
} from "../../libs/checkUnique";

export const driverService = {
  addDriver: async (data: CreateDriverSchemaType, img: string) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      await checkUserUniqueness(runner, {
        email: data.email,
        mobileNumber: data.mobileNumber,
      } as CheckUserUniquenessOptions);

      const response = await driverRepository.insertDriver({
        runner,
        data,
        imgUrl: img,
      });
      if (!response) throw new Exception("Unable to save driver data", 400);
      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  findUnassignedDriver: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await driverRepository.findUnassignedDriver({
        runner,
      });
      return response;
    } catch (err) {
      throw err;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  findAllDrivers: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await driverRepository.findAllDrivers({ runner });
      if (response.length < 1) throw new Exception("No any drivers found", 404);
      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  deleteDriver: async (id: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const existingDriver = await driverRepository.findById({ runner, id });

      if (existingDriver.profileImageUrl) {
        const imageUrlParts = existingDriver.profileImageUrl.split("/");
        const filename = imageUrlParts[imageUrlParts.length - 1];
        unsyncFromPublic(filename);
      } else {
        throw new Exception("Unable to delete driver profile image", 400);
      }
      const response = await driverRepository.deleteDriver({ runner, id });
      if (response.affected === 0)
        throw new Exception("Unable to delete driver data", 400);

      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  findDriverById: async (id: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await driverRepository.findById({ runner, id });
      if (!response)
        throw new Exception("Unable to find driver dataaaaaa", 400);

      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  findDriverByEmail: async (email: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await driverRepository.findByEmail({ runner, email });
      if (!response)
        throw new Exception("Unable to find driver datasssss", 400);

      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },
  findDriverByUserName: async (userName: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await driverRepository.findByUserName({
        runner,
        userName,
      });
      if (!response)
        throw new Exception("Unable to find driver datadddddd", 400);

      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },
  findDriverByMobileNumber: async (mobileNumber: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await driverRepository.findByMobileNumber({
        runner,
        mobileNumber,
      });
      if (!response)
        throw new Exception("Unable to find driver dataffffff", 400);

      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  updateDriver: async (id: string, data: any, imagePath?: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const isIdExists = await driverRepository.findById({ runner, id });
      if (!isIdExists) throw new Exception("driver doesnot exists", 400);

      const isMobileNumberExists = await driverRepository.findByMobileNumber({
        runner,
        mobileNumber: data.mobileNumber,
      });
      if (isMobileNumberExists)
        throw new Exception("Mobile number already exists", 400);

      const isEmailExists = await driverRepository.findByEmail({
        runner,
        email: data.email,
      });
      if (isEmailExists) throw new Exception("Email already exists", 400);

      const existingDriver = await driverRepository.findById({ runner, id });

      if (!existingDriver) {
        throw new Exception("Driver not found", 404);
      }

      if (imagePath && existingDriver.profileImageUrl) {
        const imageUrlParts = existingDriver.profileImageUrl.split("/");
        const filename = imageUrlParts[imageUrlParts.length - 1];
        unsyncFromPublic(filename);
      }

      const updatedData = {
        ...data,
        updateAt: new Date(),
      };
      const response = await driverRepository.updateDriver({
        runner,
        id,
        data: updatedData,
      });
      if (!response) throw new Exception("Unable to update driver data", 400);

      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },
};
