import { Runner } from "../../global/global";
import { generateCodePassword, uniqueKey } from "../../libs/hash";
import { generateUniqueUsername } from "../../libs/usernameGenerator";
import { Driver } from "../../models/Driver";
import { CreateDriverSchemaType } from "./driver.schema";

export const driverRepository = {
  insertDriver: async ({
    runner,
    data,
    imgUrl,
  }: Runner & { data: CreateDriverSchemaType; imgUrl: string }) => {
    const repo = await runner.manager.getRepository(Driver);

    try {
      const response = await repo.save({
        id: uniqueKey(),
        userName: await generateUniqueUsername(
          data.firstName,
          data.mobileNumber
        ),
        password: generateCodePassword("DRIVER", data.mobileNumber),
        profileImageUrl: imgUrl,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      });
      return response;
    } catch (error: any) {
      error.level == "DB";
      throw error;
    }
  },

  findById: async ({ runner, id }: Runner & Pick<Driver, "id">) => {
    const repo = runner.manager.getRepository(Driver);
    try {
      const response = await repo.findOne({
        where: {
          id: id,
        },
        relations:{
          routeAssignment:{
            bus:true,
            busRoute:true,
            students:true
          }
        }
      });
      return response;
    } catch (error: any) {
      throw error;
    }
  },
  findByEmail: async ({ runner, email }: Runner & Pick<Driver, "email">) => {
    const repo = runner.manager.getRepository(Driver);
    try {
      const response = await repo.findOne({
        where: {
          email: email,
        },
      });
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  findByUserName: async ({
    runner,
    userName,
  }: Runner & Pick<Driver, "userName">) => {
    const repo = runner.manager.getRepository(Driver);
    try {
      const response = await repo.findOne({
        where: {
          userName: userName,
        },
      });
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  findByMobileNumber: async ({
    runner,
    mobileNumber,
  }: Runner & Pick<Driver, "mobileNumber">) => {
    const repo = runner.manager.getRepository(Driver);
    try {
      const response = await repo.findOne({
        where: {
          mobileNumber: mobileNumber,
        },
      });
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  findAllDrivers: async ({ runner }: Runner) => {
    const repo = runner.manager.getRepository(Driver);
    try {
      const response = await repo.find({
        where: {
          role: "DRIVER",
        },
      });
      return response;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  deleteDriver: async ({ runner, id }: Runner & Pick<Driver, "id">) => {
    const repo = runner.manager.getRepository(Driver);
    try {
      const response = await repo.delete({
        id: id,
      });
      return response;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  updateDriver: async ({
    runner,
    id,
    data,
  }: Runner & Pick<Driver, "id"> & { data: any }) => {
    const repo = runner.manager.getRepository(Driver);
    try {
      const response = await repo.update(id, data);

      const result = await repo.findOne({
        where: {
          id: id,
        },
      });
      return result;
    } catch (error: any) {
      error.level == "DB";
      throw error;
    }
  },
};
