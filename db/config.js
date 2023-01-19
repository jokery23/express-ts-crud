export const config = {
    development: {
        username: 'database_dev',
        password: 'database_dev',
        database: 'database_dev',
        host: '127.0.0.1',
        port: 5432,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true
        }
    }
};
