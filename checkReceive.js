const config = require('./config');
const utils = require('./utils');
const request = require('./request');
const dm = require('./twitter/dm');

module.exports = async() => {
    if (new Date().getTime() >= new Date(2020,0,1).getTime()) return;
    
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
