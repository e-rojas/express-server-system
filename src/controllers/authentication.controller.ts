import * as bcrypt from 'bcrypt';
import express from 'express';
import UserWithThatEmailAlreadyExistsException from '..//exceptions/UserWithThatEmailAlreadyExistsException.exception';
import WrongCredentialsException from '../exceptions/UserWithThatEmailAlreadyExistsException.exception';
import CreateUserDTO from '../DTO/createUser.dto';
import userModel from '../models/user.model';
import LogInDTO from '..//DTO//logIn.dto';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import User from '../interfaces/user.interface';
import DataStoredInToken from '../interfaces/dataStoredIntoken.interface';
import TokenData from '../interfaces/token.interface';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private user = userModel;
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDTO),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDTO),
      this.loggingIn
    );
  }
  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDTO = request.body;

    if (await this.user.findOne({ email: userData.email })) {
      next(new UserWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
      const tokenData = this.createToken(user);
      response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
      response.send({
        name: user.name,
        email: user.email,
      });
    }
  };
  private loggingIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const logInData: LogInDTO = request.body;
    const user = await this.user.findOne({ email: logInData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        logInData.password,
        user.password
      );
      if (isPasswordMatching) {
        response.send({
          email: user.email,
          name: user.name,
        });
      } else {
        next(new WrongCredentialsException(logInData.email));
      }
    } else {
      next(new WrongCredentialsException(logInData.email));
    }
  };
  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60;
    const secret = process.env.JWT_SECRET as string;
    const dataStoredInToke: DataStoredInToken = {
      _id: user._id!,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToke, secret, { expiresIn }),
    };
  }
  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn} Path=/`;
  }
}

export default AuthenticationController;
