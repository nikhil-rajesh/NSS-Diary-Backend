import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import project from './routes/project';
import classroom from './routes/classroom/index';
import classroomActivities from './routes/classroom/activities';
import classroomNotification from './routes/classroom/notification';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  user(app);
  project(app);
  classroom(app);
  classroomNotification(app);
  classroomActivities(app);

  return app;
};
