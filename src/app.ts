import 'reflect-metadata';
import process from 'node:process';
import * as dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';

import { connection } from './database';
import { routes, initialize } from './loaders';

const port: number = Number(process.env.SERVER_PORT ?? 8080);
const app: Application = express();

initialize(app);
routes(app);

bootstrap(app);

async function bootstrap(application: Application) {
    try {
        await connection.authenticate();
        await connection.sync();
        // start the express server
        application.listen(port, async () => {
            console.log(`server started at http://localhost:${port}`);
        });
    } catch (e) {
        console.error(`[Database error] ${e.toString()}`);
        await connection.close();
    }
}
