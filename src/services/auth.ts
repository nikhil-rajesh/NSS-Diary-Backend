import jwt from 'jsonwebtoken';
import config from '../config';
import argon2 from 'argon2';
import logger from '../loaders/logger';
import db from '../loaders/db';
import { IGetUserInfo, ISignUpUser } from '../interfaces/Users';

export default class AuthService {
  public async SignIn(
    username: string,
    password: string,
  ): Promise<{ user: IGetUserInfo; token: string }> {
    try {
      const results = await db.query('SELECT * FROM Users WHERE Users.username = ?', [username]);
      const res = JSON.parse(JSON.stringify(results[0]));

      if (res.length === 0) {
        throw new Error('User not registered');
      }

      const userRecord = res[0];

      /**
       * We use verify from argon2 to prevent 'timing based' attacks
       */
      logger.silly('Checking password');
      const validPassword = await argon2.verify(userRecord.password, password);
      if (validPassword) {
        logger.silly('Password is valid!');
        logger.silly('Generating JWT');
        const token = this.generateToken(userRecord);

        Reflect.deleteProperty(userRecord, 'password');
        return { user: userRecord, token };
      } else {
        throw new Error('Invalid Password');
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  public async SignUp(user: ISignUpUser): Promise<{ user: IGetUserInfo; token: string }> {
    let conn = null;
    try {
      conn = await db.getConnection();
      logger.silly('Transaction Begin');
      await conn.beginTransaction();

      // Check if classroom_code is valid
      logger.silly('Validating classroom_code');
      const classInfo = await conn.query(
        'SELECT * FROM Classroom WHERE Classroom.classroom_code = ?',
        [user.classroom_code],
      );
      if (classInfo[0].length === 0) {
        throw new Error('Invalid Classroom Code');
      }

      // Add user db record
      logger.silly('Hashing password');
      user.password = await argon2.hash(user.password);

      logger.silly('Creating user db record');
      const resUser = await conn.query('INSERT INTO Users VALUES (?, ?, ?, ?, ?)', [
        user.username,
        user.email,
        user.name,
        user.password,
        'STUDENT',
      ]);

      // Add Student Metadata
      logger.silly('Creating student_metadata db record');
      const resMetadata = await conn.query(
        'INSERT INTO Student_Metadata VALUES (?, 0, 0, ?, null)',
        [user.username, user.classroom_code],
      );

      // Generating Token
      const userRecord: IGetUserInfo = {
        username: user.username,
        name: user.name,
        email: user.email,
        user_type: 'STUDENT',
      };
      logger.silly('Generating JWT');
      const token = this.generateToken(userRecord);

      await conn.commit();
      return { user: userRecord, token };
    } catch (error) {
      logger.error(error);
      if (conn) await conn.rollback();
      throw error;
    } finally {
      if (conn) await conn.release();
    }
  }

  private generateToken(user: IGetUserInfo) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    logger.silly(`Sign JWT for userId: ${user.username}`);
    return jwt.sign(
      {
        username: user.username,
        user_type: user.user_type,
        name: user.name,
        email: user.email,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    );
  }

  public roleValue(role: string) {
    if (role === 'SUPER_ADMIN') {
      return 100;
    } else if (role === 'CLASSROOM_ADMIN') {
      return 10;
    } else if (role === 'STUDENT') {
      return 1;
    } else {
      return 0;
    }
  }
}
