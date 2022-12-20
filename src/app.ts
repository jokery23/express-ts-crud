import express, { Application } from 'express';
import process from 'node:process';

import routes from './routes';
import initialize from './initialize';

const port: number = +(process.env.SERVER_PORT ?? 8080);

const app: Application = express();

initialize(app);
routes(app);

// start the express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
