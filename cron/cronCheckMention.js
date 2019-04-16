const cron = require('node-cron');
const mention = require('../checkMention');

cron.schedule('00 */3 * * * *', () => {
    mention();
});