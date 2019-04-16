const config = require('./config');
const utils = require('./utils');
const dm = require('./twitter/dm');

module.exports = async() => {
    const data = await request({
        method: 'PUT',
        url: `${config.coreUrl}deposit`,
        json: true
    });
    if (!data || !data.result) return;
    
    for (item of data.data) {
        const text = utils.getMessage('receive', [item.amount, item.trxId]);
        await dm(item.twitterId, text);
    }
}
