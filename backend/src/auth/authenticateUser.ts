import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppDataSource } from "../config/orm.config";
import { Driver } from "../models/Driver";
import { Student } from "../models/Student";
import { RouteAssignment } from "../models/RouteAssignment";
import { env } from "../config/env.config";
import { Exception } from "../libs/exceptionHandler";

const {
  JWT_ACCESS_SECRET_KEY: JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET_KEY: JWT_REFRESH_SECRET,
} = env;

export const authenticateUser = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    const runner = AppDataSource.createQueryRunner();

    try {
      const { userName, password } = req.body;
      if (!userName || !password) {
        throw new Exception("Username and password are required", 400);
      }

      await runner.connect();

      /* 1. ──────────────────────────────
       * Find user in Driver or Student
       * ────────────────────────────── */
      const entitiesToCheck = [
        { repo: runner.manager.getRepository(Driver), role: "DRIVER" },
        { repo: runner.manager.getRepository(Student), role: "STUDENT" },
      ];

      let foundUser: Driver | Student | null = null;
      let role: "DRIVER" | "STUDENT" = "STUDENT";

      for (const { repo, role: currentRole } of entitiesToCheck) {
        const user = await repo.findOne({ where: { userName } });
        if (user) {
          foundUser = user as any;
          role = currentRole as any;
          break;
        }
      }

      if (!foundUser) {
        throw new Exception("Invalid credentials", 401);
      }

      /* 2. ──────────────────────────────
       * Validate password (hashed)
       * ────────────────────────────── */
      const pwOk = await bcrypt.compare(password, foundUser.password);
      if (!pwOk) {
        throw new Exception("Invalid credentials", 401);
      }

      /* 3. ──────────────────────────────
       * Check ACTIVE route assignment
       * ────────────────────────────── */
      const raRepo = runner.manager.getRepository(RouteAssignment);

      const activeAssignment = await raRepo.findOne({
        where:
          role === "DRIVER"
            ? { driverId: foundUser.id, status: "ACTIVE" }
            : { studentId: foundUser.id, status: "ACTIVE" },
        relations: ["busRoute"],
      });

      if (!activeAssignment) {
        throw new Exception(
          "No active route assignment found for this user",
          403
        );
      }

      const routeId = activeAssignment.busRoute?.id;

      /* 4. ──────────────────────────────
       * Generate tokens
       * ────────────────────────────── */
      const payload = {
        id: foundUser.id,
        userName: foundUser.userName,
        role,
        routeId,
      };

      const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET!, {
        expiresIn: "7d",
      });
      const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET!, {
        expiresIn: "7d",
      });

      /* 5. ──────────────────────────────
       * Success response
       * ────────────────────────────── */
      res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          id: foundUser.id,
          userName: foundUser.userName,
          email: foundUser.email,
          role,
          routeId,
        },
      });
    } catch (err) {
      next(err); // central error middleware decides status & body
    } finally {
      await runner.release();
    }
  },
};
