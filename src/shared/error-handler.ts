import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';

import { AppResponseInterface } from './types/interfaces/app-response.interface';
import { HttpStatusCode } from './types/enums/http-status-code.enum';
import { AppErrorInterface } from './types/interfaces/app-error.interface';

export const errorHandler = (
    err: Error | ValidationError | any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        let error: string;
        const errors: AppErrorInterface[] = [];
        let statusCode = res.statusCode || HttpStatusCode.InternalServerError;

        if (err instanceof Error) {
            error = err?.message;
            errors.push({ message: error || 'Something went wrong!' });
        } else {
            const validationError = err.error as ValidationError;
            errors.push(...getParsedValidationErrors(validationError));
            if (errors.length) {
                statusCode = HttpStatusCode.BadRequest;
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
