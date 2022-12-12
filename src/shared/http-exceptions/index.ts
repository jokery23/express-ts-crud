import { Response } from "express";

import { HttpStatusCode } from "../domain/enums/http-status-code.enum";

export const httpException = (res: Response, message = '', statusCode: HttpStatusCode = HttpStatusCode.Ok) => {
  res.status(statusCode);
  throw new Error(message);
}

export const notFoundHttpException = (res: Response, message = 'Resource not found') => {
  httpException(res, message, HttpStatusCode.NotFound);
}

export const badRequestHttpException = (res: Response, message = 'Bad request') => {
  httpException(res, message, HttpStatusCode.BadRequest);
}

export const internalServerErrorHttpException = (res: Response, message = 'Something went wrong!') => {
  httpException(res, message, HttpStatusCode.InternalServerError);
}
