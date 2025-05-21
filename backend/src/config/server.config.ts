import express, { Express } from 'express';
import helmet from 'helmet';
import path from 'path';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { env } from './env.config';
// import morgan from 'morgan'; // optional

dotenv.config();

export const initializeExpressServer = (app: Express) => {
  // app.use(
  //   '/static/',
  //   express.static(path.join(process.env.PUBLIC_PATH as string, '/public/'))
  // );

   app.use(morgan('dev')); // Optional
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.disable('x-powered-by');
  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const PORT = env.SERVER_PORT;
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
};
