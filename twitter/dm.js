const limitCtrlCollection = require('../db/limitCtrl');
const config = require('../config');

module.exports = async(twitterId, text) => {
    const data = await limitCtrlCollection.update(config.twitter.dm.name);
    if (!data.result || data.remain <= 0) return;

    // DM
    const params = {event: {type: "message_create",
                            message_create: {target: {recipient_id: twitterId},
                                             message_data: {text: text}}}};
    await config.TwitterClient.post('direct_messages/events/new', params);
}
