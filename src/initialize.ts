import express, { Application } from 'express';

export default (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};