const config = require('../config');
const utils = require('../utils');
const request = require('../request');
const dm = require('../twitter/dm');
const lisk2jpy = require('../api/lisk2jpy');

module.exports = async(tweetInfo) => {
    const twitterId = tweetInfo.user.id_str;
    const commands = tweetInfo.text.match(config.regexp.balance)[0].trim().split(/\s+/);

    // ユーザー情報取得
    const data = await request({
        method: 'GET',
        url: `${config.coreUrl}user?twitterId=${twitterId}`,
        json: true
    });
    if (!data || !data.result) return;

    // 日本円換算
    let jpy = '';
    if (commands[1] === '残高' || commands[1] === '所持金') {
        jpy = await lisk2jpy(data.amount);
        jpy = `(約${jpy}円)`;
    }

    // メッセージ取得
    const params = [`${data.amount}LSK${jpy}`];
    let text = '';
    if (commands[1].endsWith(':e')) text = utils.getMessage('balance_e', params);
    else text = utils.getMessage('balance', params);

    // DM送信
    dm(twitterId, text);
}