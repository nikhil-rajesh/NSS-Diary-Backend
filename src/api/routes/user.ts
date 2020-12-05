import { Router, Response } from 'express';
import { IGetUserInfoRequest } from '../../interfaces/Users';
import middlewares from '../middlewares';
const route = Router();

export default (app: Router) => {
  app.use('/user', route);

  route.get(
    '/me',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    (req: IGetUserInfoRequest, res: Response) => {
      return res.json({ user: req.currentUser }).status(200);
    },
  );
};
