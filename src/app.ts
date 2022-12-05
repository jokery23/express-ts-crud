import express, { Application } from 'express';
import process from 'node:process';

import routes from './routes';

const port: string = process.env.SERVER_PORT;

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);


// start the express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});