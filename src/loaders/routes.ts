import { Application } from 'express';

import usersApi from '../modules/users/users.api';
import groupsApi from '../modules/groups/groups.api';

import { errorHandler } from '../shared/error-handler';

export default (app: Application) => {
    app.use('/v2/users', usersApi);
    app.use('/v2/groups', groupsApi);

    app.use(errorHandler);
};
