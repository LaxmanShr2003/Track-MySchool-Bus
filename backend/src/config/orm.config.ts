import { DataSource } from "typeorm";
import { env } from "./env.config";



export const AppDataSource: DataSource = new DataSource({
  type: "mysql",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [],
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