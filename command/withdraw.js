const tweet = require('../twitter/tweet');
const dm = require('../twitter/dm');
const config = require('../config');
const utils = require('../utils');
const request = require('../request');
const cst = require('../const');

module.exports = async(tweetInfo) =>{
    const commands = tweetInfo.text.match(config.regexp.withdraw)[0].trim().split(/\s+/);
    const twitterId = tweetInfo.user.id_str;
    const amount = commands[3];
    const liskAddress = commands[2];
    const replyId = tweetInfo.id_str;
    const screenName = tweetInfo.user.screen_name;

    // 送金処理
    const data = await request({
        method: 'PUT',
        url: `${config.coreUrl}withdraw`,
        headers: {'content-type': 'application/json'},
        body: {senderId: twitterId, liskAddress: liskAddress, amount: amount},
        json: true
    });
    if (!data || !data.result) return;
    if (!utils.isEmpty(data.resultType) && data.resultType === cst.RETURN_TYPE_LISK_TRX_ERROR) return;


    // 枚数が足りなかったらエラーメッセージをツイートして終了
    if (!utils.isEmpty(data.resultType) && data.resultType === cst.RETURN_TYPE_NOT_ENOUGH) {
        let text = '';
        if((commands[1]).endsWith(":e")) text = utils.getMessage('withdraw_e', [], true);
        else text = utils.getMessage('withdraw', [], true);
        tweet(text, replyId, [screenName]);
        return;
    }

    // DM送信
    const params = [amount, liskAddress, data.fee, data.id];
    let text = "";
    if(commands[1].endsWith(":e")) text = utils.getMessage('withdraw_e', params);
    else text = utils.getMessage('withdraw', params);
    dm(twitterId, text);
}