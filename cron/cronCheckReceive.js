const cron = require('node-cron');
const receive = require('../checkReceive');

cron.schedule('00 */5 * * * *', () => {
    receive();
});