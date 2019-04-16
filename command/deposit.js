const config = require('../config');
const utils = require('../utils');
const dm = require('../twitter/dm');

module.exports = async(tweetInfo) => {
    const twitterId = tweetInfo.user.id_str;
    const commands = tweetInfo.text.match(config.regexp.deposit)[0].trim().split(/\s+/);

    // ユーザー情報取得
    const data = await request({
        method: 'GET',
        url: `${config.coreUrl}user?twitterId=${twitterId}`,
        json: true
    });
    if (!data || !data.result) return;

    // メッセージ取得
    const params = [data.userId, config.lisk.address];
    var text = '';
    if (commands[1].endsWith(':e')) text = utils.getMessage('deposit_e', params);
    else text = utils.getMessage('deposit', params);

    // DM送信
    dm(twitterId, text);
}