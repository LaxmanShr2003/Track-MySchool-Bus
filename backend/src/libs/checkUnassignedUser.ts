import { In, QueryRunner } from "typeorm";
import { Exception } from "../libs/exceptionHandler";
import { Bus } from "../models/Bus";
import { Driver } from "../models/Driver";
import { Student } from "../models/Student";

/**
 * Validate that bus, driver and all students are UN‑assigned.
 * Throws Exception(400) with a clear cause when any rule fails.
 */
export const validateUnassigned = async (
  runner: QueryRunner,
  {
    busId,
    driverId,
    studentIds,
  }: { busId: string; driverId: string; studentIds: string[] }
) => {
  const busRepo = runner.manager.getRepository(Bus);
  const driverRepo = runner.manager.getRepository(Driver);
  const studentRepo = runner.manager.getRepository(Student);

  /* 🚍 1. Bus ---------------------------------------------------- */
  const bus = await busRepo.findOne({
    where: { id: busId },
    select: ["id", "isAssigned"],
    lock: { mode: "pessimistic_write" }, // optional row‑lock
  });
  if (!bus) throw new Exception(`Bus ${busId} not found`, 400);
  if (bus.isAssigned)
    throw new Exception(`Bus ${busId} is already assigned`, 400);

  /* 👨‍✈️ 2. Driver ---------------------------------------------- */
  const driver = await driverRepo.findOne({
    where: { id: driverId },
    select: ["id", "isAssigned"],
    lock: { mode: "pessimistic_write" },
  });
  if (!driver) throw new Exception(`Driver ${driverId} not found`, 400);
  if (driver.isAssigned)
    throw new Exception(`Driver ${driverId} is already assigned`, 400);

  /* 👩‍🎓 3. Students -------------------------------------------- */
  const students = await studentRepo.find({
    where: { id: In(studentIds) },
    select: ["id", "isAssigned"],
    lock: { mode: "pessimistic_write" },
  });

  // a) Every ID must exist
  if (students.length !== studentIds.length) {
    const foundIds = students.map((s) => s.id);
    const missing = studentIds.filter((id) => !foundIds.includes(id));
    throw new Exception(`Student(s) not found: ${missing.join(", ")}`, 400);
  }

  // b) No student already assigned
  const alreadyAssigned = students.filter((s) => s.isAssigned);
  if (alreadyAssigned.length) {
    throw new Exception(
      `Student(s) already assigned: ${alreadyAssigned
        .map((s) => s.id)
        .join(", ")}`,
      400
    );
  }
};
