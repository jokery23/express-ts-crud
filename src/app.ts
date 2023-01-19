import 'reflect-metadata';
import process from 'node:process';
import * as dotenv from 'dotenv';
dotenv.config();

import express, { Application } from 'express';

import { connection } from './database';
import routes from './routes';
import initialize from './initialize';

const port: number = +(process.env.SERVER_PORT ?? 8080);
const syncForce = false;
const app: Application = express();

initialize(app);
routes(app);

bootstrap();

async function bootstrap() {
    try {
        await connection.authenticate();
        await connection.sync({ force: syncForce });
        // start the express server
        app.listen(port, async () => {
            console.log(`server started at http://localhost:${port}`);
        });
    } catch (e) {
        console.error(`[Database error] ${e.toString()}`);
        await connection.close();
    }
}
