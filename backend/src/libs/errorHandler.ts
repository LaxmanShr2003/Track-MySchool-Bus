import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";

import { ZodError } from "zod";
import unsync from "./unsync";

export const errorHandler = () => {
  return async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      unsync(req.file.path);
    }
    if (req.files) {
      const files = req.files;

      if (Array.isArray(files)) {
        files.forEach(async (item) => {
          unsync(item.path);
        });
      } else {
        for (const key in files) {
          if (Object.prototype.hasOwnProperty.call(files, key)) {
            const elements = files[key];
            if (Array.isArray(elements)) {
              elements.forEach(async (item) => {
                unsync(item.path);
              });
            }
          }
        }
      }
    }

    if (err instanceof MulterError) {
      // Handle Multer errors
      let message;
      switch (err.code) {
        case "LIMIT_FILE_SIZE":
          message = "File size exceeds the allowed limit.";
          break;
        case "LIMIT_UNEXPECTED_FILE":
          message = "Too many files uploaded or unexpected file field.";
          break;
        case "LIMIT_PART_COUNT":
          message = "Too many parts in the multipart request.";
          break;
        case "LIMIT_FIELD_KEY":
          message = "Field name too long.";
          break;
        default:
          message = "Multer error occurred.";
      }
      return res.status(400).json({ error: message });
    }

    if (err instanceof ZodError) {
      return res
        .status(400)
        .json({ error: "Validation error", details: err.issues });
    }

    if (err.level === "DB") {
      return res.status(500).send({ error: "Internal Server Error" });
    }

    res.status(400).send({ error: err.message ? err.message : err });
  };
};
