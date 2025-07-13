import {
  checkUserUniqueness,
  checkUserUniquenessForUpdate,
  CheckUserUniquenessOptions,
  CheckUserUniquenessOptionsForUpdate,
} from "../../libs/checkUnique";
import { Exception } from "../../libs/exceptionHandler";
import ORMHelper from "../../libs/ORMHelper";
import { unsyncFromPublic } from "../../libs/unsync";
import { StudentRepository } from "./student.repository";
import { CreateStudentSchemaType, StudentIdSchemaType } from "./student.schema";

export const studentService = {
  addStudent: async (data: CreateStudentSchemaType, img: string) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      await checkUserUniqueness(runner, {
        email: data.email,
        mobileNumber: data.mobileNumber,
      } as CheckUserUniquenessOptions);
      const isMobileNumberExists = await StudentRepository.findByMobileNumber({
        runner,
        mobileNumber: data.mobileNumber,
      });
      if (isMobileNumberExists)
        throw new Exception("Mobile number already exixts", 400);
      const response = await StudentRepository.insert({
        runner,
        data,
        imgUrl: img,
      });
      if (!response) throw new Exception("Unable to save student data", 400);
      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },
  findUnassignedStuents: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await StudentRepository.findUnassignedStudents({
        runner,
      });
      return response;
    } catch (err) {
      throw err;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  findAllStudents: async () => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await StudentRepository.findAllStudents({ runner });
      if (response.length < 1)
        throw new Exception("No any students found", 404);
      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  deleteUser: async (id: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const existingStudent = await StudentRepository.findById({ runner, id });
      if (existingStudent.profileImageUrl) {
        const imageUrlParts = existingStudent.profileImageUrl.split("/");
        const filename = imageUrlParts[imageUrlParts.length - 1];
        unsyncFromPublic(filename);
      } else {
        throw new Exception("Unable to delete student profile image", 400);
      }

      const response = await StudentRepository.deleteStudent({ runner, id });
      if (response.affected === 0)
        throw new Exception("Unable to delete user data", 400);

      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  findStudentById: async (id: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await StudentRepository.findById({ runner, id });
      if (!response) throw new Exception("Unable to find student data", 400);

      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  findStudentByEmail: async (email: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await StudentRepository.findByEmail({ runner, email });
      if (!response) throw new Exception("Unable to find student data", 400);

      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  findStudentByMobileNumber: async (mobileNumber: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await StudentRepository.findByMobileNumber({
        runner,
        mobileNumber,
      });
      if (!response) throw new Exception("Unable to find user data", 400);

      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },

  updateUser: async (id: string, data: any, imagePath?: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const isIdExists = await StudentRepository.findById({ runner, id });
      if (!isIdExists) throw new Exception("Student doesnot exists", 400);

      await checkUserUniquenessForUpdate(runner, {
        id: id,
        email: data.email,
        mobileNumber: data.mobileNumber,
        userName: data.userName,
      } as CheckUserUniquenessOptionsForUpdate);

      // const isMobileNumberExists = await StudentRepository.findByMobileNumber({
      //   runner,
      //   mobileNumber: data.mobileNumber,
      // });
      // if (isMobileNumberExists)
      //   throw new Exception("Mobile number already exists", 400);

      // const isEmailExists = await StudentRepository.findByEmail({
      //   runner,
      //   email: data.email,
      // });
      // if (isEmailExists) throw new Exception("Email already exists", 400);

      if (imagePath && isIdExists.profileImageUrl) {
        const imageUrlParts = isIdExists.profileImageUrl.split("/");
        const filename = imageUrlParts[imageUrlParts.length - 1];
        unsyncFromPublic(filename);
      }

      const updatedData = {
        ...data,

        updateAt: new Date(),
      };
      const response = await StudentRepository.updateUser({
        runner,
        id,
        data: updatedData,
      });
      if (!response) throw new Exception("Unable to update user data", 400);

      return response;
    } catch (error) {
      throw error;
    } finally {
      await ORMHelper.release(runner);
    }
  },
};
