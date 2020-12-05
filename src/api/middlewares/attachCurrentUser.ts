import db from '../../loaders/db';
import { User } from '../../models/Users';
import Logger from '../../loaders/logger';

/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (req, res, next) => {
  try {
    const results = await db.query('SELECT * FROM Users WHERE Users.username = ?', [
      req.token.username,
    ]);
    const res = JSON.parse(JSON.stringify(results[0]));

    if (res.length === 0) {
      return res.sendStatus(401);
    }

    const currentUser = res[0];
    Reflect.deleteProperty(currentUser, 'password');
    req.currentUser = currentUser;
    return next();
  } catch (e) {
    Logger.error('🔥 Error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachCurrentUser;
