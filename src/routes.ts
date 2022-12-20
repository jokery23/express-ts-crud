import { Application } from 'express';

import usersRouter from './modules/users';
import { errorHandler } from './shared/error-handler';

export default (app: Application) => {
    app.use('/users', usersRouter);

    app.use(errorHandler);
};
