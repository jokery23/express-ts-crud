import { routes, initialize, afterRoutes } from './loaders';
import express, { Application } from 'express';

const app: Application = express();

initialize(app);

routes(app);

afterRoutes(app);

export default app;
