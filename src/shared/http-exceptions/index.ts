import { Response } from 'express';

import { HttpStatusCode } from '../types/enums/http-status-code.enum';

export const httpException = (res: Response, message = '', statusCode: HttpStatusCode = HttpStatusCode.Ok) => {
    res.status(statusCode);
    throw new Error(message);
};

export const notFoundHttpException = (res: Response, message = 'Resource not found') => {
    httpException(res, message, HttpStatusCode.NotFound);
};
