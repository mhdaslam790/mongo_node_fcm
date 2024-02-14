import { Inject, Service } from 'typedi';
import { IUserInput, IUserService } from '../types/user';
import mongoose from 'mongoose';
import { IUser } from '../types/user';
import { Logger } from 'winston';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import { config } from '../config';
import jwt from 'jsonwebtoken';
import { AppEvents } from '../subcribers/event';

@Service()
export class UserService implements IUserService {
  constructor(
    @Inject('userModel')
    private userModel: mongoose.Model<IUser & mongoose.Document>,
    @Inject('logger') private logger: Logger,
    @EventDispatcher()
    private eventDispatcher: EventDispatcherInterface,
  ) {

  }
  public async getUser(id: string): Promise<IUser> {
    try {
      const user = await this.userModel.findById(id).select('-password');
      return user;
    } catch (error) {
      throw createError(httpStatus.NOT_FOUND, `User ${id} doesn't exist`);
    }
  }
  public async loginUser(userInput: IUserInput): Promise<any> {
    try {
      const userCheck = await this.userModel.findOne({ username: userInput.username });
      
      if (!userCheck) {

        throw createError(httpStatus.NOT_FOUND, `Invalid credentials`);
      }
      this.logger.info(`loginUser: ${userCheck.username}`);
      const isMatch = await bcrypt.compare(
        userInput.password,
        userCheck.password
      );

      this.logger.debug(`isMatch: ${isMatch}`);
      if (!isMatch) {
        this.logger.debug('loginUser: failed to verify password');
        throw createError(httpStatus.NOT_FOUND, `Invalid  credentials`);
      }
      const payload = {
        user: {
          id: userCheck.id,
        }
      };
      const jwtSecret = config.jwtSecret;
      try {
        const token = jwt.sign(payload, jwtSecret, { expiresIn: "24h" });
        await this.userModel.updateOne({ username: userInput.username },{$set: {fcmToken:userInput.fcmToken}});
        this.eventDispatcher.dispatch(AppEvents.user.signIn, userCheck);
        return token;
      } catch (error) {
        throw createError(
          httpStatus.FORBIDDEN,
          `loginUser: Error jsonwebtoken`,
        );
      }
    } catch (error) {
      this.logger.error(`Error loginUser: ${error}`);
      throw error;
    }
  }
  /* Register user */
  public async registerUser(userInput: IUserInput) {
    const { username, email, password } = userInput;
    try {
      let user = await this.userModel.findOne({ username });

      if (user) {
        throw createError(
          httpStatus.CONFLICT,
          `A user with username ${username} already exists`,
        );
      }
      user = await this.userModel.findOne({ email });
      if (user) {
        throw createError(
          httpStatus.CONFLICT,
          `A user with email ${email} already exists`,
        );
      }
      // Encrypting password
      const salt = await bcrypt.genSalt(10);
      const encryptPass = await bcrypt.hash(password, salt);
      const userRecord = await this.userModel.create({
        username: username,
        email: email,
        password: encryptPass,
      });

      // Return password
      const payload = {
        user: {
          id: userRecord.id,
        },
      };
      const jwtSecret = config.jwtSecret;
      try {
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '2h' });

        this.eventDispatcher.dispatch(AppEvents.user.signUp, userRecord);
        this.logger.info('Success registerUser');
        return token;
      } catch (error) {
        this.logger.error(`Error registerUser: ${error}`);
        throw createError(
          httpStatus.FORBIDDEN,
          `RegisterUser: Error jsonwebtoken`,
        );
      }
    } catch (error) {
      this.logger.error(`Error registerUser: ${error}`);
      throw error;
    }
  }
}