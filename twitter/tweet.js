const limitCtrlCollection = require('../mongo/limitCtrl');
const config = require('../config');

module.exports = async(text, replyId, replyUsers) => {
    const data = await limitCtrlCollection.update(config.twitter.tweet.name);
    if (!data.result || data.remain <= 0) return;

    // Tweet
    let status = text;
    replyUsers.forEach((userNm) => {status = `@${userNm} ${status}`;});
    await config.TwitterClient.post('statuses/update', {in_reply_to_status_id: replyId, status: status});
}
