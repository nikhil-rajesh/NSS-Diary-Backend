import argon2 from 'argon2';
import logger from '../loaders/logger';
import db from '../loaders/db';
import { ICreateUser } from '../interfaces/Users';
import { IDefaultResponse } from '../interfaces/Response';

export default class UserService {
  public async CreateUser(user: ICreateUser): Promise<IDefaultResponse> {
    try {
      logger.silly('Hashing password');
      user.password = await argon2.hash(user.password);

      logger.silly('Creating user db record');
      const results = await db.query('INSERT INTO Users VALUES (?, ?, ?, ?, ?)', [
        user.username,
        user.email,
        user.name,
        user.password,
        user.user_type,
      ]);
      console.log(results);
      return { success: true, message: 'User created' };
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}
