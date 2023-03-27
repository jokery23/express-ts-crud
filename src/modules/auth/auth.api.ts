import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import UsersService, { USERS_SERVICE_INJECT_TOKEN } from '../users/users.service';
import { BadRequest } from 'http-errors';
import { AppResponseInterface } from '../../shared/types/interfaces/app-response.interface';
import AuthService, { AUTH_SERVICE_INJECT_TOKEN } from './auth.service';
import { validator } from '../../shared/validators/main.validator';
import { createTokenPayloadSchema } from './types/auth.schemas';

const authApi: Router = Router();
const usersService = Container.get<UsersService>(USERS_SERVICE_INJECT_TOKEN);
const authService = Container.get<AuthService>(AUTH_SERVICE_INJECT_TOKEN);

authApi.post(
    '/token',
    validator.body(createTokenPayloadSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        const { username, password } = req.body;
        let token: string | null = null;

        try {
            const user = await usersService.findOneByField('login', username);

            if (!user || !password) {
                throw new BadRequest('Invalid email or password.');
            }

            token = await authService.createToken({ sub: user.id });
        } catch (err) {
            return next(err);
        }

        const response: AppResponseInterface<string | null> = {
            data: token
        };

        res.json(response);
    }
);

export default authApi;
