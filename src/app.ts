import express from 'express';
import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Controller from './interfaces/controller.interface';
import cors from 'cors';
import mongoose from 'mongoose';
import errorMiddleware from './middleware/error. middleware';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import { expressjwt } from "express-jwt";
import { buildSchema } from 'type-graphql';
import { customAuthChecker } from './graphql/auth-checkers/custom-auth-checker';
import { resolvers, context } from './graphql/schemas/graphql.schema';
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
    this.initializeApolloServer();
  }

  private initializeMiddewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        credentials: true,
        origin: [`${process.env.LOCAL_HOST}`, `${process.env.CLIENT_HOST}`, `${process.env.CLIENT_HOST}/graphql`, `${process.env.APOLLO_URL}`],
      })
    );
    this.app.use(

      expressjwt({
        secret: process.env.JWT_SECRET as string,
        algorithms: ['HS256'],
        credentialsRequired: false,
      })

    );

  }

  private async initializeApolloServer() {
    const schema = await buildSchema({
      resolvers,
      authChecker: customAuthChecker,
    })

    const apolloServer = new ApolloServer({
      schema,
      context
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app: this.app, cors: false, path: '/graphql' });
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
        // log graphQL playground url
        console.log(`🚀 Server ready at http://localhost:${this.port}/graphql`);

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
