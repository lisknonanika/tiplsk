const utils = require('../utils');
const follow = require('../twitter/follow');
const friendsCollection = require('../db/friends');

module.exports = async(tweetInfo) => {
    const twitterId = tweetInfo.user.id_str;
    const data = await friendsCollection.find({twitterId: twitterId});
    if (utils.isEmpty(data) || data[0].friend === 0) {
        await follow(twitterId);
        await friendsCollection.update({twitterId: twitterId}, {$set:{twitterId: twitterId, friend: 1}});
    }
}