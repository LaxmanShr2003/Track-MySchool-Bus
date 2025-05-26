import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

export default class ZOD {
  static requestParser =
    (
      ...args: {
        schema: ZodTypeAny;
        type: "Params" | "Body" | "Query";
        isFile?: boolean;
      }[]
    ) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        for (const item of args) {
          let response;

          if (item.type === "Body") {
            response = await item.schema.safeParseAsync(req.body);
          } else if (item.type === "Params") {
            response = await item.schema.safeParseAsync(req.params);
          } else if (item.type === "Query") {
            response = await item.schema.safeParseAsync(req.query);
          }

          if (response && response.success) {
            // Update the request with validated data
            if (item.type === "Body") req.body = response.data;
            if (item.type === "Params") req.params = response.data;
            if (item.type === "Query") req.query = response.data;
          } else {
            // If validation fails, return a 400 error response
             res.status(400).json({
              success: false,
              errors: response?.error?.issues || "Validation error",
            });
          }
        }

        next();
      } catch (error) {
        next(error); // Pass unexpected errors to the error handler
      }
    };
}
