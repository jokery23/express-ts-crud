import 'reflect-metadata';

import './loaders/config';

import { Application } from 'express';
import { connection } from './database';
import logger from './logger';
import process from 'node:process';

import app from './app';
import { getPort } from './shared/config.helper';

const port = getPort();

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
