import { Router, Response, NextFunction } from 'express';
import UserService from '../../services/user';
import { celebrate, Joi } from 'celebrate';
import logger from '../../loaders/logger';
import middlewares from '../middlewares';
import { IAuth } from '../../interfaces/Middleware';
import { IGetUserInfo } from '../../interfaces/Users';
const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  route.get('/me', middlewares.isAuth, (req: IAuth, res: Response) => {
    const user = { ...req.token };
    Reflect.deleteProperty(user, 'exp');
    Reflect.deleteProperty(user, 'iat');
    return res.json(user as IGetUserInfo).status(200);
  });

  route.post(
    '/add',
    middlewares.isAuth,
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
    async (req: IAuth, res: Response, next: NextFunction) => {
      logger.debug('Calling User add endpoint with body: %o', req.body);
      try {
        const userServiceInstance = new UserService();
        const result = await userServiceInstance.CreateUser(req.body);
        return res.json(result).status(200);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
