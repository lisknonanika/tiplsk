const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

module.exports.find = async(condition) => {
    const con = await MongoClient.connect(config.mongo.url, config.mongoClientParams);
    try {
        const db = await con.db(config.mongo.db);
        const tbl = await db.collection(config.mongo.collectionFriends);
        const data = await tbl.find(condition).toArray();
        return !data? []: data;
    } finally {
        con.close();
    }
}

module.exports.update = async(condition, data) => {
    const con = await MongoClient.connect(config.mongo.url, config.mongoClientParams);
    try {
        const db = await con.db(config.mongo.db);
        const tbl = await db.collection(config.mongo.collectionFriends);
        await tbl.updateOne(condition, data, {upsert: true});
        return {result: true};
    } finally {
        con.close();
    }
}

module.exports.delete = async(condition) => {
    const con = await MongoClient.connect(config.mongo.url, config.mongoClientParams);
    try {
        const db = await con.db(config.mongo.db);
        const tbl = await db.collection(config.mongo.collectionFriends);
        await tbl.deleteOne(condition);
        return {result: true};
    } finally {
        con.close();
    }
}
