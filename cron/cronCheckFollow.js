const cron = require('node-cron');
const follow = require('../checkFollow');

cron.schedule('00 */10 * * * *', () => {
    follow();
});