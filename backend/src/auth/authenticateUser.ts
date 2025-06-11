import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppDataSource } from "../config/orm.config";
import { Driver } from "../models/Driver";
import { Student } from "../models/Student";
import { env } from "../config/env.config";
 // if applicable

const JWT_ACCESS_SECRET = env.JWT_ACCESS_SECRET_KEY;
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET_KEY;

export const authenticateUser = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userName, password } = req.body;

      if (!userName || !password) {
         res.status(400).json({ message: "Username and password are required" });
      }

      const runner = AppDataSource.createQueryRunner();
      await runner.connect();

      const entitiesToCheck = [
        { repo: runner.manager.getRepository(Driver), role: "DRIVER" },
        { repo: runner.manager.getRepository(Student), role: "STUDENT" },
        // { repo: runner.manager.getRepository(Admin), role: "ADMIN" }
      ];

      let foundUser: any = null;
      let role = "";

      for (const { repo, role: currentRole } of entitiesToCheck) {
        const user = await repo.findOne({ where: { userName } });
        if (user) {
          foundUser = user;
          role = currentRole;
          break;
        }
      }

      await runner.release();

      if (!foundUser) {
         res.status(401).json({ message: "Invalid credentials" });
      }

    //   const isMatch = await bcrypt.compare(password, foundUser.password);
    //   if (!isMatch) {
    //      res.status(401).json({ message: "Invalid credentials" });
    //   }

      // Generate tokens
      const payload = {
        id: foundUser.id,
        userName: foundUser.userName,
        role: foundUser.role
      };

      const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET!, { expiresIn: "15m" });
      const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET!, { expiresIn: "7d" });

       res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          id: foundUser.id,
          userName: foundUser.userName,
          email: foundUser.email,
          role
        }
      });

    } catch (error) {
      next(error);
    }
  }
};
