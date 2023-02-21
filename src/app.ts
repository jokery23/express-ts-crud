import 'reflect-metadata';
import process from 'node:process';
import * as dotenv from 'dotenv';
dotenv.config({ path: './config/.env' });

import { connection } from './database';
import logger from './logger';
import { routes, initialize, afterRoutes } from './loaders';
import express, { Application } from 'express';

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

process.on('uncaughtException', (error) => {
    logger.error('[UncaughtException Error Handler]: ', error);
    process.exit(1);
});
