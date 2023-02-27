import { Application } from 'express';

import usersApi from '../modules/users/users.api';
import groupsApi from '../modules/groups/groups.api';
import authApi from '../modules/auth/auth.api';

export default function routes(app: Application) {
    app.use('/v2/users', usersApi);
    app.use('/v2/groups', groupsApi);
    app.use('/v2/auth', authApi);
}
