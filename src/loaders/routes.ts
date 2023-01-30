import { Application } from 'express';

import usersApi from '../users/users.api';
import { errorHandler } from '../shared/error-handler';

export default (app: Application) => {
    app.use('/v2/users', usersApi);

    app.use(errorHandler);
};
