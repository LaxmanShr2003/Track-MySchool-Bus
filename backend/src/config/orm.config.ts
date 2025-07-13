import { DataSource } from "typeorm";
import { env } from "./env.config";
import { Student } from "../models/Student";
import { BusRoute } from "../models/BusRoute";
import { Bus } from "../models/Bus";
import { Driver } from "../models/Driver";
import { RouteAssignment } from "../models/RouteAssignment";
import { Checkpoint } from "../models/CheckPoint";

export const AppDataSource: DataSource = new DataSource({
  type: "mysql",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  dropSchema: false,
  entities: [Student, BusRoute, Bus, Driver, RouteAssignment,Checkpoint],
});

export const initializeDataSource = async () => {
  try {
    (await AppDataSource.initialize()).runMigrations();
    
    console.log(`Datasource initialized successfully`);
  } catch (error) {
    console.log("Unable to connect datasource", error);
    throw error;
  }
};
