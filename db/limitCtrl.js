const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const utils = require('../utils');

module.exports.update = async(target) => {
    const con = await MongoClient.connect(config.mongo.url, config.mongoClientParams);
    try {
        const db = await con.db(config.mongo.db);
        const tbl = await db.collection(config.mongo.collectionLimitCtrl);
        await tbl.deleteMany({name: target, execDate:{$lte: utils.getDateTime(config.twitter[target].interval * -1)}});
        const data = await tbl.find({name: target}).toArray();
        const remain = config.twitter[target].max - data.length;
        if (remain <= 0) return {result: true, remain: 0};
        await tbl.insertOne({name: target, execDate: utils.getDateTime()});
        return {result: true, remain: remain + 1};
    } finally {
        con.close();
    }
}
