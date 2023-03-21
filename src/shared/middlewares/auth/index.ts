import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { Forbidden, Unauthorized } from 'http-errors';
import { Container } from 'typedi';
import logger from '../../../logger';
import { GetUserDto } from '../../../modules/users/types/dto/get-user.dto';
import AuthService, { AUTH_SERVICE_INJECT_TOKEN } from '../../../modules/auth/auth.service';
import { getJWTSecret, isSkipAuth } from '../../config.helper';

const authService = Container.get<AuthService>(AUTH_SERVICE_INJECT_TOKEN);

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    if (req.url.includes('/auth/token') || isSkipAuth()) {
        return next();
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        throw new Unauthorized();
    }

    jwt.verify(token, getJWTSecret(), async (err: any, payload: { sub: string }) => {
        let user: GetUserDto | null;

        try {
            if (err) {
                throw new Forbidden();
            }

            user = await authService.getUserById(payload.sub);
            if (!user) {
                throw new Forbidden();
            }
        } catch (e) {
            logger.error(e.message);
            return next(e);
        }

        req.user = user;

        next();
    });
}
