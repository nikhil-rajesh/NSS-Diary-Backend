import { Router, Response, NextFunction } from 'express';
import AdminService from '../../services/admin';
import { celebrate, Joi } from 'celebrate';
import logger from '../../loaders/logger';
import middlewares from '../middlewares';
import { IGetUserInfoRequest } from '../../interfaces/Users';

const route = Router();

export default (app: Router) => {
  app.use('/admin', route);

  route.post(
    '/user/add',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    middlewares.requiredRole('SUPER_ADMIN'),
    celebrate({
      body: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        password: Joi.string().required(),
        user_type: Joi.string().valid('SUPER_ADMIN', 'CLASSROOM_ADMIN').required(),
      }),
    }),
    async (req: IGetUserInfoRequest, res: Response, next: NextFunction) => {
      logger.debug('Calling User add endpoint with body: %o', req.body);
      try {
        const adminServiceInstance = new AdminService();
        const result = await adminServiceInstance.CreateUser(req.body);
        return res.json(result).status(200);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
