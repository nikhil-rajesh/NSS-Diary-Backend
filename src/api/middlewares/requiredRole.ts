import logger from '../../loaders/logger';
import AuthService from '../../services/auth';
import { IGetUserInfoRequest } from '../../interfaces/Users';
import { Response, NextFunction } from 'express';

export default (requiredRole: string) => {
  return (req: IGetUserInfoRequest, res: Response, next: NextFunction) => {
    const authServiceInstance = new AuthService();
    if (
      authServiceInstance.roleValue(req.currentUser.user_type) >=
      authServiceInstance.roleValue(requiredRole)
    ) {
      logger.info('🔥 Welcome ' + requiredRole);
      return next();
    } else {
      return res.status(401).send('Action not allowed');
    }
  };
};
