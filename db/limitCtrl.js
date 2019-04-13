const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const utils = require('../utils');

module.exports.update = async(target) => {
    const con = await MongoClient.connect(config.mongo.url, config.mongoClientParams);
    try {
        const db = await con.db(config.mongo.db);
        const tbl = await db.collection(config.mongo.collectionLimitCtrl);

        // 指定時間経過したものは削除
        await tbl.deleteMany({name: target, execDate:{$lte: utils.getDateTime(config.twitter[target].interval * -1)}});
        
        // 残数が残っていなければ終了
        const data = await tbl.find({name: target}).toArray();
        if (config.twitter[target].max - data.length <= 0) return {result: false};

        // 登録
        await tbl.insertOne({name: target, execDate: utils.getDateTime()});
        return {result: true};
    } finally {
        con.close();
    }
}
