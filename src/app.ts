import 'reflect-metadata';
import process from 'node:process';
import * as dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });

import { connection } from './database';
import logger from './logger';
import { routes, initialize, afterRoutes } from './loaders';
import express, { Application } from 'express';
import { isUncaughtExceptionEnabled } from './config/logger';

const port: number = Number(process.env.SERVER_PORT ?? 8080);
const app: Application = express();

initialize(app);

routes(app);

afterRoutes(app);

bootstrap(app);

async function bootstrap(application: Application) {
    try {
        await connection.authenticate();
        await connection.sync();

        application.listen(port, async () => {
            logger.info(`server started at http://localhost:${port}`);
        });
    } catch (e) {
        logger.error(`[Database error] ${e.toString()}`);
        await connection.close();
    }
}

if (isUncaughtExceptionEnabled) {
    process.on('uncaughtException', (error) => {
        logger.error('[UncaughtException]: ', error);
        process.exit(1);
    });
}
