require('ts-node/register');
const { seeder } = require('./umzug');

start();

async function start() {
    try {
        await seeder.runAsCLI();
    } catch (e) {
        console.log(e);
    }
}
