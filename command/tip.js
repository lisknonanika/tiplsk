const tweet = require('../twitter/tweet');
const config = require('../config');
const request = require('../request');
const lisk2jpy = require('../api/lisk2jpy');
const utils = require('../utils');
const cst = require('../const');

module.exports = async(tweetInfo, isReply) => {
    const twitterId = tweetInfo.user.id_str;
    const replyId = tweetInfo.id_str;
    const screenName = tweetInfo.user.screen_name;
    let recipientId = '';
    let targetNm = '';
    let amount = '0';
    let command = '';
    if (isReply) {
        const commands = tweetInfo.text.match(config.regexp.tip_s)[0].trim().split(/\s+/);
        recipientId = tweetInfo.in_reply_to_user_id_str;
        targetNm = tweetInfo.in_reply_to_screen_name;
        amount = commands[2];
        command = commands[1];

    } else {
        const commands = tweetInfo.text.match(config.regexp.tip)[0].trim().split(/\s+/);
        for (let mention of tweetInfo.entities.user_mentions) {
            if (mention.screen_name.toUpperCase() !== commands[2].substring(1).toUpperCase()) continue;
            recipientId = mention.id_str;
            break;
        }
        targetNm = commands[2].substring(1);
        amount = commands[3];
        command = commands[1];
    }

    // 処理キャンセル判定
    if (!recipientId) {
        // 送信先が自分
        if (recipientId == twitterId) return;
        // ブラックリストに登録
        if (config.blacklist.indexOf(recipientId) >= 0) return;
    }

    // 2020/1/1以降はチップ機能停止
    if (new Date().getTime() >= new Date(2020,0,1).getTime()) {
        let text = '';
        if(command.endsWith(":e")) text = utils.getMessage('tip_exp_e', [], true);
        else text = utils.getMessage('tip_exp', [], true);
        tweet(text, replyId, [screenName]);
        return;
    }
    
    // チップ処理
    const data = await request({
        method: 'PUT',
        url: `${config.coreUrl}tip`,
        headers: {'content-type': 'application/json'},
        body: {senderId: twitterId, senderNm: screenName, receiptId: recipientId, receiptNm: targetNm, amount: amount},
        json: true
    });
    if (!data || !data.result) return;

    // 枚数が足りなかったらエラーメッセージをツイートして終了
    if (!utils.isEmpty(data.resultType) && data.resultType === cst.RETURN_TYPE_NOT_ENOUGH) {
        let text = '';
        if(command.endsWith(":e")) text = utils.getMessage('tip_e', [], true);
        else text = utils.getMessage('tip', [], true);
        tweet(text, replyId, [screenName]);
        return;
    }

    // 日本円換算
    let jpy = '';
    if (command === 'チップ') {
        jpy = await lisk2jpy(amount);
        jpy = `(約${jpy}円)`;
    }

    // ツイート
    let params = [targetNm, screenName, `${amount}LSK${jpy}`];
    let text = '';
    if(command.endsWith(":e")) text = utils.getMessage('tip_e', params);
    else text = utils.getMessage('tip', params);
    tweet(text, replyId, [screenName, targetNm]);
}
