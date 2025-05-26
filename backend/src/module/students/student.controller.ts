import { Response, Request, NextFunction } from "express";
import {
  CreateStudentSchemaType,
  StudentEmailSchemaType,
  StudentIdSchemaType,
} from "./student.schema";
import { studentService } from "./student.service";
import { messageFormater } from "../../libs/messageFormater";
import { Exception } from "../../libs/exceptionHandler";
import { MulterHelper } from "../../middlewares/multer";

export const StudentController = {
  addStudent: async (
    req: Request<{}, {}, CreateStudentSchemaType>,
    res: Response,
    next: NextFunction
  ) => {
    try {


       if (!req.file) {
  console.log("Image validation failed");
  throw new Exception("Image is required", 400);
}

const profileImg = req.file.filename;
      if (!profileImg) {
        console.log("profile extraction failed");
        throw new Exception("Please insert image", 400);
      }


      const studentData = req.body;
    const imageUrl = `${req.protocol}://${req.get("host")}/public/${req.file.filename}`;


   
    
      const response = await studentService.addStudent(studentData, imageUrl);
      res
        .status(201)
        .json(
          messageFormater(
            true,
            response,
            "Successfully added student data",
            200
          )
        );
    } catch (error) {
      next(error);
    }
  },

  findAllStudents: async (
    req: Request<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await studentService.findAllStudents();
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully fetched all user", 200)
        );
    } catch (error) {
      next(error);
    }
  },

  findById: async (
    req: Request<StudentIdSchemaType, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const response = await studentService.findStudentById({ id });
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully fetched the user", 200)
        );
    } catch (error) {
      next(error);
    }
  },

  findByEmail: async (
    req: Request<StudentEmailSchemaType, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = req.params;
      const response = await studentService.findStudentByEmail(email);
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully fetched the user", 200)
        );
    } catch (error) {
      next(error);
    }
  },

  updateStudent: async (
    req: Request<StudentIdSchemaType, {}, CreateStudentSchemaType>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const data = req.body;

      const response = await studentService.updateUser({ id }, data);
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully updated user data", 200)
        );
    } catch (error) {
      next(error);
    }
  },
  deleteStudent: async (
    req: Request<StudentIdSchemaType, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const response = await studentService.deleteUser(id);
      res
        .status(201)
        .json(
          messageFormater(true, response, "Successfully updated user data", 200)
        );
    } catch (error) {
      next(error);
    }
  },
};
