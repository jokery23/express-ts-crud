import { NextFunction, Request, Response } from "express";
import { AppResponseInterface } from "./domain/app-response.interface";


export const errorHandler = (err: Error, req: Request , res: Response, next: NextFunction) => {

  const error: string = err?.message;

  const response: AppResponseInterface<null> = {
    data: null,
    errors: [error || 'Something went wrong!']
  };

  res.status(res.statusCode).json(response);
}