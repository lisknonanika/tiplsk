const config = require('./config');
const utils = require('./utils');
const allocate = require('./allocate');

module.exports = () => {
    config.TwitterClient.stream('statuses/filter', config.filter)
    .on("start", _response => {
        console.log(`[${utils.getDateTimeString()}] [tweetFilter] start`);
    })
    .on("data", data => {
        allocate(data)
        .catch((err) => {
            console.log(`[${utils.getDateTimeString()}] [tweetFilter] data`);
            console.log(err);
        });
    })
    .on("error", error => {
        console.log(`[${utils.getDateTimeString()}] [tweetFilter] data`);
        console.log(error);
    })
    .on("end", _response => {
        console.log(`[${utils.getDateTimeString()}] [tweetFilter] end`);
    })
}