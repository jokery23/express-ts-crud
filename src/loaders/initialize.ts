import express, { Application } from 'express';
import { middlewareLogging } from '../logger';

export default function initialize(app: Application) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(middlewareLogging);

    app.set('x-powered-by', false);
}
