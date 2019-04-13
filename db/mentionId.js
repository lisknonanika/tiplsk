const MongoClient = require('mongodb').MongoClient;
const config = require('../config');
const utils = require('../utils');

module.exports.find = async(condition) => {
    const con = await MongoClient.connect(config.mongo.url, config.mongoClientParams);
    try {
        const db = await con.db(config.mongo.db);
        const tbl = await db.collection(config.mongo.collectionMentionId);
        const data = await tbl.findOne(condition);
        return !data? {}: data;
    } finally {
        con.close();
    }
}

module.exports.insert = async(mentionId) => {
    const con = await MongoClient.connect(config.mongo.url, config.mongoClientParams);
    try {
        const db = await con.db(config.mongo.db);
        const tbl = await db.collection(config.mongo.collectionMentionId);
        await tbl.deleteMany({execDate:{$lte: utils.getDateTime(-1440)}});
        await tbl.insertOne({mentionId: mentionId, execDate: new Date(), flg: 0});
        return {result: true};
    } finally {
        con.close();
    }
}

module.exports.update = async(condition, data) => {
    const con = await MongoClient.connect(config.mongo.url, config.mongoClientParams);
    try {
        const db = await con.db(config.mongo.db);
        const tbl = await db.collection(config.mongo.collectionMentionId);
        await tbl.updateOne(condition, data, {upsert: true});
        return {result: true};
    } finally {
        con.close();
    }
}
