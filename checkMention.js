const config = require('./config');
const utils = require('./utils');
const allocate = require('./allocate');
const mentionIdCollection = require('./db/mentionId');

module.exports = async() => {
    // mention制御情報から実行済のmentionIdを取得
    const mentionCtrl = await mentionIdCollection.find({flg: 1});
    let sinceId = !mentionCtrl? '': mentionCtrl.mentionId;

    // 最大5回繰り返す
    for (i = 0; i < 5; i++) {
        // 残回数が残っていなければ終了
        const rate = await config.TwitterClient.get('application/rate_limit_status', {resources: "statuses"});
        if (rate.resources.statuses['/statuses/mentions_timeline'].remaining === 0) break;

        // mention 取得
        let params = {count: config.twitter.mention.count}
        if (!utils.isEmpty(sinceId)) params.since_id = sinceId;
        const mentions = await config.TwitterClient.get('statuses/mentions_timeline', params);
        if (!mentions) break;

        // 逆順にまわして古いものから処理をする
        for (i = mentions.length - 1; 0 <= i; i--) {
            if (sinceId === mentions[i].id_str) continue;
            sinceId = mentions[i].id_str;
            await mentionIdCollection.update({flg: 1}, {$set: {mentionId: sinceId, flg: 1}});
            if (mentions[i].user.protected) await allocate(mentionData[i]);
        }

        // 指定件数より取得件数が少ない場合は終了
        if (mentions.length < config.twitter.mention.count) break;
    }
}
