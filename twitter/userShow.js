const config = require('../config');

module.exports = async(twitterId) => {
    const data = await config.TwitterClient.get('application/rate_limit_status', {resources: "users"});
    if (!data || data.resources.users['/users/show/:id'].remaining < 100) return {};

    // User Show
    try {
        return await config.TwitterClient.get('users/show/:id', {user_id: twitterId});
    } catch (err) {
        return {};
    }
}
