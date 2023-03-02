import express, { Application } from 'express';
import cors from 'cors';
import { middlewareLogging } from '../logger';
import { authenticateToken } from '../shared/middlewares/auth';

export default function initialize(app: Application) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(middlewareLogging);
    app.use(authenticateToken);

    app.set('x-powered-by', false);
}
