import { date } from "zod";
import { Runner } from "../../global/global";
import { generateCodePassword, uniqueKey } from "../../libs/hash";
import { generateUniqueUsername } from "../../libs/usernameGenerator";
import { Student } from "../../models/Student";
import { CreateStudentSchemaType } from "./student.schema";
import { In } from "typeorm";

export const StudentRepository = {
  insert: async ({
    runner,
    data,
    imgUrl,
  }: Runner & { data: CreateStudentSchemaType; imgUrl: string }) => {
    const repo = runner.manager.getRepository(Student);
    const uniqueName = await generateUniqueUsername(
      data.firstName,
      data.mobileNumber
    );

    try {
      const response = await repo.save({
        id: uniqueKey(),
        userName: uniqueName,
        profileImageUrl: imgUrl,
        password: generateCodePassword("STUDENT", data.mobileNumber),
        isAssigned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      });

      return response;
    } catch (error: any) {
      throw error;
    }
  },

  findById: async ({ runner, id }: Runner & Pick<Student, "id">) => {
    const repo = runner.manager.getRepository(Student);
    try {
      const response = await repo.findOne({
        where: {
          id: id,
        },
      });
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  findByEmail: async ({ runner, email }: Runner & Pick<Student, "email">) => {
    const repo = runner.manager.getRepository(Student);
    try {
      const response = await repo.findOne({
        where: {
          email: email,
        },
      });
      return response;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findByMobileNumber: async ({
    runner,
    mobileNumber,
  }: Runner & Pick<Student, "mobileNumber">) => {
    const repo = runner.manager.getRepository(Student);
    try {
      const response = await repo.findOne({
        where: {
          mobileNumber: mobileNumber,
        },
      });
      return response;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findByUserName: async ({
    runner,
    userName,
  }: Runner & Pick<Student, "userName">) => {
    const repo = runner.manager.getRepository(Student);
    try {
      const response = await repo.findOne({
        where: {
          userName: userName,
        },
      });
      return response;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  findAllStudents: async ({ runner }: Runner) => {
    const repo = runner.manager.getRepository(Student);
    try {
      const response = await repo.find({
        where: {
          role: "STUDENT",
        },
      });
      return response;
    } catch (error: any) {
      error.level = "DB";
      throw error;
    }
  },

  deleteStudent: async ({ runner, id }: Runner & Pick<Student, "id">) => {
    const repo = runner.manager.getRepository(Student);
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

  updateUser: async ({
    runner,
    id,
    data,
  }: Runner & { id: string; data: any }) => {
    const repo = runner.manager.getRepository(Student);
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
  setAssignedTrue: async ({
    runner,
    studentIds,
  }: Runner & { studentIds: string[] }) => {
    const repo = runner.manager.getRepository(Student);
    await repo.update({ id: In(studentIds) }, { isAssigned: true });
  },

  setAssignedFalse: async ({
    runner,
    studentIds,
  }: Runner & { studentIds: string[] }) => {
    const repo = runner.manager.getRepository(Student);
    await repo.update({ id: In(studentIds) }, { isAssigned: false });
  },


};
