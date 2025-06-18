import { initializeDataSource } from "./config/orm.config";
import express, { Express } from "express";
import { initializeExpressServer } from "./config/server.config";
import path from "path";

(function main() {
  initializeDataSource();
  const app: Express = express();
  initializeExpressServer(app);
 console.log("hello")
})();
