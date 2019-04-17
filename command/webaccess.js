const config = require('../config');
const utils = require('../utils');
const request = require('../request');
const dm = require('../twitter/dm');

module.exports = async(tweetInfo) => {
    const twitterId = tweetInfo.user.id_str;
    const commands = tweetInfo.text.match(config.regexp.webaccess)[0].trim().split(/\s+/);

    // WEBアクセス情報取得
    const data = await request({
        method: 'GET',
        url: `${config.coreUrl}webaccess?twitterId=${twitterId}`,
        json: true
    });
    if (!data || !data.result) return;

    // メッセージ取得
    const password = !data.password? '********': data.password;
    const params = [data.userId, password, config.weburl];
    let text = '';
    if (commands[1].endsWith(':e')) text = utils.getMessage('web_e', params);
    else text = utils.getMessage('web', params);

    // DM送信
    dm(twitterId, text);
}