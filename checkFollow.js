const config = require('./config');
const follow = require('./twitter/follow');
const userShow = require('./twitter/userShow');
const friendsCollection = require('./db/friends');

let friends = [];
const getFriends = async() => {
    const result = await config.TwitterClient.get('friends/ids', {stringify_ids: true, count: 5000});
    if (!result) friends = [];
    else friends = result.ids;
}

let followers = [];
const getFollower = async() => {
    const result = await config.TwitterClient.get('followers/ids', {stringify_ids: true, count: 5000});
    if (!result) followers = [];
    else followers = result.ids;
}

let twitterIds = [];
const refleshFriendsCtrl = async() => {
    const friendsCtrl = await friendsCollection.find({});
    for (let item of friendsCtrl) {
        twitterIds.push(item.twitterId);
        if (item.friend === 1 && friends.indexOf(item.twitterId) < 0) {
            await friendsCollection.delete({twitterId: item.twitterId});
            twitterIds.pop();
        } else if (item.friend === 0 && friends.indexOf(item.twitterId) >= 0) {
            await friendsCollection.update({twitterId: item.twitterId}, {$set:{twitterId: item.twitterId, friend: 1}});
        }
    }
}

const updateFriendsCtrl = async() => {
    for (let twitterId of followers) {
        if (twitterIds.indexOf(twitterId)) return;
        const user = await userShow(twitterId);
        if (user && user.protected && !user.following && !user.follow_request_sent) {
            await friendsCollection.update({twitterId: twitterId}, {$set:{twitterId: twitterId, friend: 1}});
            await follow(twitterId);
        } else {
            await friendsCollection.update({twitterId: twitterId}, {$set:{twitterId: twitterId, friend: 0}});
        }
    }
}

module.exports = async() => {
    // 残回数チェック
    const friendsRate = await config.TwitterClient.get('application/rate_limit_status', {resources: "friends"});
    if (!friendsRate || friendsRate.resources.friends['/friends/ids'].remaining <= 0) return;
    const followersRate = await config.TwitterClient.get('application/rate_limit_status', {resources: "followers"});
    if (!followersRate || followersRate.resources.followers['/followers/ids'].remaining <= 0) return;

    // 各種情報取得
    await getFriends();
    await getFollower();

    // Friends Ctrl を更新
    await refleshFriendsCtrl();
    await updateFriendsCtrl();
}
