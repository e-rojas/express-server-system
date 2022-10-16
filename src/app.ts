import express from 'express';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Controller from './interfaces/controller.interface';
import cors from 'cors';
import mongoose from 'mongoose';
import errorMiddleware from './middleware/error. middleware';
import dotenv from 'dotenv';
dotenv.config();
class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;
    this.connectToDatabase();
    this.initializeMiddewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        credentials: true,
        origin: [`${process.env.LOCAL_HOST}`, `${process.env.CLIENT_HOST}`],
      })
    );
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private connectToDatabase() {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
    mongoose
      .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`)
      .then(() => {
        console.log('⚡️[db connection]: success!! ヽ(ヅ)ノ');
      })
      .catch((err) => console.log('Error during connection! (✖╭╮✖)', err));
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Application is listening on port: ${this.port}`);
    });
  }
}

export default App;
