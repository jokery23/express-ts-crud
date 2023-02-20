import { NextFunction, Request, Response } from 'express';
import { logger } from './logger';

export function middlewareLogging(err: Error, req: Request, res: Response, next: NextFunction) {
    logger.info(`route: ${req.url}; args:`, req.params, req.query);
    next();
}

export default logger;
