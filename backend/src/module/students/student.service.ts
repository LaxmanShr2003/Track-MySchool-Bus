import { Exception } from "../../libs/exceptionHandler";
import ORMHelper from "../../libs/ORMHelper";
import { StudentRepository } from "./student.repository";
import { CreateStudentSchemaType, StudentIdSchemaType } from "./student.schema";

export const studentService = {
  addStudent: async (data: CreateStudentSchemaType, img:string) => {
    const runner = await ORMHelper.createQueryRunner();

    try {
      const isMobileNumberExists = await StudentRepository.findByMobileNumber({
        runner,
        mobileNumber: data.mobileNumber,
      });
      if (isMobileNumberExists)
        throw new Exception("Mobile number already exixts", 400);
      const response = await StudentRepository.insert({ runner, data, imgUrl:img });
      if (!response) throw new Exception("Unable to save student data", 400);
      return response;
    } catch (error) {
      throw error;
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
    }
  },

  deleteUser: async (id: string) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await StudentRepository.deleteStudent({ runner, id });
      if (response.affected === 0)
        throw new Exception("Unable to delete user data", 400);

      return response;
    } catch (error) {
      throw error;
    }
  },

  findStudentById: async (id: StudentIdSchemaType) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const response = await StudentRepository.findById({ runner, id });
      if (!response) throw new Exception("Unable to find student data", 400);

      return response;
    } catch (error) {
      throw error;
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
    }
  },

  findUserByMobileNumber: async (mobileNumber: string) => {
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
    }
  },

  updateUser: async (
    id: StudentIdSchemaType,
    data: CreateStudentSchemaType
  ) => {
    const runner = await ORMHelper.createQueryRunner();
    try {
      const isIdExists = await StudentRepository.findById({ runner, id });
      if (!isIdExists) throw new Exception("User doesnot exists", 400);

      const isMobileNumberExists = await StudentRepository.findByMobileNumber({
        runner,
        mobileNumber: data.mobileNumber,
      });
      if (isMobileNumberExists)
        throw new Exception("Mobile number already exists", 400);

      const isEmailExists = await StudentRepository.findByEmail({
        runner,
        email: data.email,
      });
      if (isEmailExists) throw new Exception("Email already exists", 400);

      const response = await StudentRepository.updateUser({ runner, id, data });
      if (!response) throw new Exception("Unable to update user data", 400);

      return response;
    } catch (error) {
      throw error;
    }
  },
};
