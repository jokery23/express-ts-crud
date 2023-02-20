import { Application } from 'express';
import { errorHandler } from '../shared/error-handler';
import { isMiddlewareEnabled } from '../config/logger';

export default function afterRoutes(app: Application) {
    if (isMiddlewareEnabled) {
        app.use(errorHandler);
    }
}
