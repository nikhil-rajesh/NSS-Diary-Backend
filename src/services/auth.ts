import jwt from 'jsonwebtoken';
import config from '../config';
import argon2 from 'argon2';
import logger from '../loaders/logger';
import db from '../loaders/db';
import { User } from '../models/Users';

export default class AuthService {
  public async SignIn(username: string, password: string): Promise<{ user: User; token: string }> {
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

  private generateToken(user) {
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
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    );
  }
}
