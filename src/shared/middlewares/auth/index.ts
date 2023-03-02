import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import process from 'node:process';
import { Forbidden, Unauthorized } from 'http-errors';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    if (req.url.includes('/auth/token')) {
        return next();
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        throw new Unauthorized();
    }

    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err: any, user: any) => {
        if (err) {
            throw new Forbidden();
        }

        req.user = user;

        return next();
    });
}
