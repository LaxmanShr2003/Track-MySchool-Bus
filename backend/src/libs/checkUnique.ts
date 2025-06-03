import { Admin, Not, QueryRunner, Repository } from "typeorm";
import { Student } from "../models/Student";
import { Driver } from "../models/Driver";

export interface CheckUserUniquenessOptions {
  email: string;
  mobileNumber: string;
}
export interface CheckUserUniquenessOptionsForUpdate {
  id: string;
  email: string;

  mobileNumber: string;
}

export const checkUserUniqueness = async (
  runner: QueryRunner,
  { email, mobileNumber }: CheckUserUniquenessOptions
) => {
  const studentRepo = runner.manager.getRepository(Student);
  const driverRepo = runner.manager.getRepository(Driver);
  // const adminRepo = runner.manager.getRepository(Admin);

  const check = async (repo: Repository<any>, role: string) => {
    const existing = await repo.findOne({
      where: [{ email }, { mobileNumber }],
    });
    if (existing) {
      throw new Error(`${role} with same email or mobileNumber already exists`);
    }
  };

  await check(studentRepo, "Student");
  await check(driverRepo, "Driver");
  // await check(adminRepo, "Admin");
};

export const checkUserUniquenessForUpdate = async (
  runner: QueryRunner,
  { id, email, mobileNumber }: CheckUserUniquenessOptionsForUpdate
) => {
  const studentRepo = runner.manager.getRepository(Student);
  const driverRepo = runner.manager.getRepository(Driver);
  // const adminRepo = runner.manager.getRepository(Admin);

  const check = async (repo: Repository<any>, role: string) => {
    const existing = await repo.findOne({
      where: [
        { email, id: Not(id) },

        { mobileNumber, id: Not(id) },
      ],
    });

    if (existing) {
      throw new Error(`${role} with same email or mobileNumber already exists`);
    }
  };

  await check(studentRepo, "Student");
  await check(driverRepo, "Driver");
  // await check(adminRepo, "Admin");
};
