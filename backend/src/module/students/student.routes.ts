import { Router } from "express";
import { MulterHelper } from "../../middlewares/multer";
import { env } from "../../config/env.config";
import {
  createStudentSchema,
  loginSchema,
  studentEmailSchema,
  studentIdSchema,
  studentMobileNumberSchema,
} from "./student.schema";
import ZOD from "../../middlewares/schemaValidator";
import { StudentController } from "./student.controller";
import { validateToken } from "../../auth/validateToken";
import { authenticateUser } from "../../auth/authenticateUser";

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

  router.get("/students", StudentController.findAllStudents);
  router.get("/student/:id", StudentController.findById);
  router.get(
    "/student/mobile/:mobileNumber",
    ZOD.requestParser({
      schema: studentMobileNumberSchema,
      type: "Params",
    }),
    StudentController.findByMobileNumber
  );

  router.get(
    "/student/email/:email",
    ZOD.requestParser({
      schema: studentEmailSchema,
      type: "Params",
    }),
    StudentController.findByEmail
  );

  router.delete(
    "/student/delete/:id",
    ZOD.requestParser({
      schema: studentIdSchema,
      type: "Params",
    }),
    StudentController.deleteStudent
  );

  router.patch(
    "/student/update/:id",
    MulterHelper.getStorage(env.ACCESS_PATH!, {
      moduleName: "studentProfileImg",
      isFile: false,
    }).single("studentProfileImg"),

    ZOD.requestParser(
      {
        schema: studentIdSchema,
        type: "Params",
      },
      {
        schema: createStudentSchema,
        type: "Body",
      }
    ),
    StudentController.updateStudent
  );

  router.post(
    '/login',
    ZOD.requestParser({
      schema:loginSchema,
      type:"Body"
    }),
    authenticateUser.login
  )
};
