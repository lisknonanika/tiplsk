const limitCtrlCollection = require('../mongo/limitCtrl');
const config = require('../config');

module.exports = async(twitterId) => {
    const data = await limitCtrlCollection.update(config.twitter.follow.name);
    if (!data.result || data.remain <= 0) return;
    
    // Follow
    await config.TwitterClient.post('friendships/create', {user_id: twitterId, follow: false});
}
