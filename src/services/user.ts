import argon2 from 'argon2';
import logger from '../loaders/logger';
import db from '../loaders/db';
import { ICreateUser, IStudentMetadata } from '../interfaces/Users';
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
      return { success: true, message: 'User created' };
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  public async GetStudentMetadata(username: string): Promise<IStudentMetadata> {
    try {
      logger.silly('Fetching Metadata');
      const metadata = await db.query(
        'SELECT * FROM Student_Metadata Where Student_Metadata.student = ?',
        [username],
      );
      const res = JSON.parse(JSON.stringify(metadata[0]));

      if (res.length === 0) {
        throw new Error('Invalid Student');
      }

      return res;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}
