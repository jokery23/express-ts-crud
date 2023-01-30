import { Sequelize } from 'sequelize-typescript';
import { env } from 'node:process';
import { Dialect } from 'sequelize';

const DIALECT: Dialect = (env['DB_DIALECT'] as Dialect) || 'postgres';

export const connection = new Sequelize({
    database: env['DB_NAME'],
    port: +env['DB_PORT'],
    dialect: DIALECT,
    username: env['DB_USERNAME'],
    password: env['DB_PASSWORD'],
    host: env['DB_HOST'],
    models: ['/models/**/*.ts']
});
