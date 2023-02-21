import { NextFunction, Request, Response } from 'express';
import { logger } from './logger';

export function middlewareLogging(req: Request, res: Response, next: NextFunction) {
    logger.info(`[Route Logging] route: ${req.url}; query params:`, req.query);
    next();
}

export default logger;
