import { Router, Request, Response, NextFunction } from 'express';
import AuthService from '../../services/auth';
import { celebrate, Joi } from 'celebrate';
import logger from '../../loaders/logger';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post(
    '/signin',
    celebrate({
      body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug('Calling Sign-In endpoint with body: %o', req.body);
      try {
        const { username, password } = req.body;
        const authServiceInstance = new AuthService();
        const { user, token } = await authServiceInstance.SignIn(username, password);
        return res.json({ user, token }).status(200);
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
