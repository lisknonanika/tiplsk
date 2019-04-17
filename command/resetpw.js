const config = require('../config');
const utils = require('../utils');
const request = require('../request');
const dm = require('../twitter/dm');

module.exports = async(tweetInfo) => {
    const twitterId = tweetInfo.user.id_str;
    const commands = tweetInfo.text.match(config.regexp.resetpw)[0].trim().split(/\s+/);

    // WEBアクセス情報取得
    const data = await request({
        method: 'PUT',
        url: `${config.coreUrl}resetpw`,
        body: {twitterId: twitterId},
        json: true
    });
    if (!data || !data.result) return;

    // メッセージ取得
    const params = [data.password];
    let text = '';
    if (commands[1].endsWith(':e')) text = utils.getMessage('resetpw_e', params);
    else text = utils.getMessage('resetpw', params);

    // DM送信
    dm(twitterId, text);
}