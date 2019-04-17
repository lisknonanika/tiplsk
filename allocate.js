const config = require('./config');
const utils = require('./utils');
const request = require('./request');
const mentionIdCollection = require('./db/mentionId');
const tip = require('./command/tip');
const balance = require('./command/balance');
const deposit = require('./command/deposit');
const withdraw = require('./command/withdraw');
const followme = require('./command/followme');
const history = require('./command/history');
const webaccess = require('./command/webaccess');
const resetpw = require('./command/resetpw');

module.exports = async(tweetInfo) => {
    // リツイートかブラックリスト登録されていたら終了
    if (tweetInfo.retweeted_status ||
        config.blacklist.indexOf(tweetInfo.user.id_str) >= 0 ||
        config.blacklistSource.indexOf(tweetInfo.source.toUpperCase()) >= 0) {
        return;
    }

    // 既に実行していたら終了
    const mentionHistory = await mentionIdCollection.find({flg:0, mentionId: tweetInfo.id_str});
    if (!utils.isEmpty(mentionHistory)) return;

    // ユーザーがいなければ作成
    const createUserResult = await request({
        method: 'PUT',
        url: `${config.coreUrl}user`,
        headers: {'content-type': 'application/json'},
        body: {twitterId: tweetInfo.id_str},
        json: true
    });
    if (!createUserResult.result) return;

    // ツイート内容で処理を振り分け
    if (config.regexp.tip.test(tweetInfo.text)) tip(tweetInfo, false);
    else if (config.regexp.tip_s.test(tweetInfo.text)) tip(tweetInfo, true);
    else if (config.regexp.balance.test(tweetInfo.text)) balance(tweetInfo);
    else if (config.regexp.deposit.test(tweetInfo.text)) deposit(tweetInfo);
    else if (config.regexp.withdraw.test(tweetInfo.text)) withdraw(tweetInfo);
    else if (config.regexp.followme.test(tweetInfo.text)) followme(tweetInfo);
    else if (config.regexp.history.test(tweetInfo.text)) history(tweetInfo);
    else if (config.regexp.webaccess.test(tweetInfo.text)) webaccess(tweetInfo);
    else if (config.regexp.resetpw.test(tweetInfo.text)) resetpw(tweetInfo);
}