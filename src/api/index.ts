import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import admin from './routes/admin';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  user(app);
  admin(app);

  return app;
};
