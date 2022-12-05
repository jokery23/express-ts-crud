import { Application } from 'express';

import usersRouter from './modules/users';

export default (app: Application) => {
  app.use('/users', usersRouter);
};
