import { NextFunction, Request, Response } from 'express';
import { AppResponseInterface } from './domain/interfaces/app-response.interface';
import { HttpStatusCode } from './domain/enums/http-status-code.enum';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    try {
        const error: string = err?.message;

        const response: AppResponseInterface<null> = {
            data: null,
            errors: [{ message: error || 'Something went wrong!' }]
        };

        res.status(res.statusCode || HttpStatusCode.InternalServerError).json(response);
    } catch (e) {
        next(e);
        return;
    }
};
