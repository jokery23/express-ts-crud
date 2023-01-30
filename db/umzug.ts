import { Umzug, SequelizeStorage } from 'umzug';
import * as dotenv from 'dotenv';
import { env } from 'node:process';
import { Sequelize, Dialect } from 'sequelize';

dotenv.config();

const DIALECT: Dialect = (env['DB_DIALECT'] as Dialect) || 'postgres';

export const connection = new Sequelize({
    database: env['DB_NAME'],
    username: env['DB_USERNAME'],
    password: env['DB_PASSWORD'],
    port: +env['DB_PORT'],
    dialect: DIALECT,
    host: env['DB_HOST']
});

export const migrator = new Umzug({
    migrations: {
        glob: ['migrations/*.ts', { cwd: __dirname }]
    },
    storage: new SequelizeStorage({ sequelize: connection }),
    context: connection,
    logger: console
});

export type Migration = typeof migrator._types.migration;

export const seeder = new Umzug({
    migrations: {
        glob: ['seeders/*.ts', { cwd: __dirname }]
    },
    storage: new SequelizeStorage({ sequelize: connection }),
    context: connection,
    logger: console
});

export type Seeder = typeof seeder._types.migration;
