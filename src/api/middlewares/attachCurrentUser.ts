import db from '../../loaders/db';
import User from '../../models/Users';
import Logger from '../../loaders/logger';

/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (req, res, next) => {
  try {
    const res = await db.query('SELECT * FROM Users WHERE Users.username = ?', [
      req.token.username,
    ]);
    if (res[0].length === 0) {
      return res.sendStatus(401);
    }

    const currentUser = JSON.parse(JSON.stringify(res[0][0]));
    Reflect.deleteProperty(currentUser, 'password');
    req.currentUser = currentUser;
    return next();
  } catch (e) {
    Logger.error('🔥 Error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachCurrentUser;
