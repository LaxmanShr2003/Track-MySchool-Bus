import { Router } from "express";
import { MulterHelper } from "../../middlewares/multer";
import { env } from "../../config/env.config";
import { createStudentSchema } from "./student.schema";
import ZOD from "../../middlewares/schemaValidator";
import { StudentController } from "./student.controller";


export const studentRoutes = (router: Router) => {
  router.post(
    "/student",
    // validateToken({ checkAdmin: true }),

    MulterHelper.getStorage(env.ACCESS_PATH!, {
      moduleName: "studentProfileImg",
      isFile: false,
    }).single("studentProfileImg"),

    ZOD.requestParser({
      schema: createStudentSchema,
      type: "Body",
    }),
    // (req) => console.log(req),
    StudentController.addStudent
  );
}