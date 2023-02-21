const dotenv = require('dotenv');
dotenv.config({ path: './../config/.env' });
const env = process.env;

const DIALECT = env['DB_DIALECT'] || 'postgres';

module.exports = {
    development: {
        username: env['DB_USERNAME'],
        password: env['DB_PASSWORD'],
        database: env['DB_NAME'],
        host: env['DB_HOST'],
        port: +env['DB_PORT'],
        dialect: DIALECT
    }
};
