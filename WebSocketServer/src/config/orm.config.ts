import { DataSource } from "typeorm";
import { env } from "./env.config";
import { GpsData } from "../models/GpsData";


export const AppDataSource: DataSource = new DataSource({
  type: "mysql",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  //dropSchema: true,
  entities: [GpsData]
});

export const initializeDataSource = async () => {
  try {
    (await AppDataSource.initialize());
   //await AppDataSource.synchronize(true)
    console.log(`Datasource initialized successfully hello`);
  } catch (error) {
    console.log("Unable to connect datasource", error);
    throw error;
  }
};