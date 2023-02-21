import { Application } from 'express';
import { errorHandler } from '../shared/error-handler';

export default function afterRoutes(app: Application) {
    app.use(errorHandler);
}
