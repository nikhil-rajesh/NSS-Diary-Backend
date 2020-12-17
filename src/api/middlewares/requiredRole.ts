import logger from '../../loaders/logger';
import AuthService from '../../services/auth';
import { Response, NextFunction } from 'express';
import { IAuth } from '../../interfaces/Middleware';

export default (requiredRole: string) => {
  return (req: IAuth, res: Response, next: NextFunction) => {
    const authServiceInstance = new AuthService();
    if (
      authServiceInstance.roleValue(req.token.user_type) >=
      authServiceInstance.roleValue(requiredRole)
    ) {
      logger.info('🔥 Welcome ' + requiredRole);
      return next();
    } else {
      return res.status(401).send('Insufficient Permissions');
    }
  };
};
