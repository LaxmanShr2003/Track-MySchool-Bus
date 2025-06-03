import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.config";
import { JWT, TokenPayload } from "../libs/token";
import { Exception } from "../libs/exceptionHandler";

const accessType = {
  ACCESS: env.SECRET_KEY,
};

interface ValidationOptions {
  checkAdmin?: boolean;
  checkDriver?: boolean;
  checkStudent?: boolean;
}

export const validateToken = (options: ValidationOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from header
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new Exception("Authorization header missing", 401);

      const token = authHeader.replace("Bearer ", "");
      if (!token) throw new Exception("Token missing", 401);

      // Verify token
      const decoded = JWT.verify<TokenPayload>(
        token,
        accessType["ACCESS"] as string
      );
      if (!decoded) throw new Exception("Invalid token", 401);

      // Attach decoded payload to request
      req.tokenPayload = decoded;

      // Role-based validation
      const { role } = decoded;
      const { checkAdmin, checkDriver, checkStudent } = options;

      if (checkAdmin && role !== "ADMIN") {
        throw new Exception("Not authorized as admin", 403);
      }

      if (checkDriver && role !== "DRIVER") {
        throw new Exception("Not authorized as driver", 403);
      }

      if (checkStudent && role !== "STUDENT") {
        throw new Exception("Not authorized as student", 403);
      }

      next();
    } catch (error) {
      // Pass the error to the global error handler
      next(error);
    }
  };
};
