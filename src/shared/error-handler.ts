import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';
import { isHttpError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';

import { AppResponseInterface } from './types/interfaces/app-response.interface';
import { AppErrorInterface } from './types/interfaces/app-error.interface';
import logger from '../logger';

export const errorHandler = (
    err: Error | ValidationError | any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const errors: AppErrorInterface[] = [];
        let statusCode = res.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

        if (isHttpError(err)) {
            statusCode = err.status;
            errors.push(err);
        } else if (err instanceof Error) {
            errors.push({ message: err.message || 'Internal Server Error' });
            statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
            logger.error(`[Middleware Error Handler] ${errors[0].message}`);
        } else {
            const validationError = err.error as ValidationError;
            errors.push(...getParsedValidationErrors(validationError));
            if (errors.length) {
                statusCode = StatusCodes.BAD_REQUEST;
            }
        }

        const response: AppResponseInterface<null> = {
            data: null,
            errors
        };

        res.status(statusCode).json(response);
    } catch (e) {
        next(e);
        return;
    }
};

function getParsedValidationErrors(error: ValidationError): AppErrorInterface[] {
    const { details } = error;

    const errors: AppErrorInterface[] = details.map(({ message, path }) => {
        return {
            message,
            field: `${path[0]}`
        };
    });

    return errors;
}
