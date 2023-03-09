import { Application } from 'express';

import usersApi from '../modules/users/users.api';
import groupsApi from '../modules/groups/groups.api';
import authApi from '../modules/auth/auth.api';

export enum ROUTES {
    USERS = '/users',
    GROUPS = '/groups',
    AUTH = '/auth'
}

export default function routes(app: Application) {
    app.use(ROUTES.USERS, usersApi);
    app.use(ROUTES.GROUPS, groupsApi);
    app.use(ROUTES.AUTH, authApi);
}
