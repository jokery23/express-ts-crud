require('ts-node/register');
const { migrator } = require('./umzug');

start();

async function start() {
    try {
        await migrator.runAsCLI();
    } catch (e) {
        console.log(e);
    }
}
