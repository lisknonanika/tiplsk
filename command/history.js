const dateformat = require('dateformat');
const dm = require('../twitter/dm');
const config = require('../config');
const utils = require('../utils');
const cst = require('../const');

module.exports = async(tweetInfo) => {
    const twitterId = tweetInfo.user.id_str;
    const commands = tweetInfo.text.match(config.regexp.history)[0].trim().split(/\s+/);

    // 履歴取得
    const data = await request({
        method: 'GET',
        url: `${config.coreUrl}history?twitterId=${twitterId}`,
        json: true
    });
    if (!data || !data.result) return;

    // メッセージ編集
    let text = '';
    if (utils.isEmpty(data.datas)) {
        text = commands[1].endsWith(':e')? '-Histories-\n\nnone.\n': '入出金履歴がありません。\n';
    } else {
        text = commands[1].endsWith(':e')? '-Histories-\n\n': '入出金履歴をお知らせします。\n\n';

        for(let item of data.datas) {
            // 入出金日時を取得
            let ymd = '';
            if (commands[1].endsWith(':e')) ymd = dateformat(item.execDate, 'mm/dd/yyyy HH:MM:ss') + '(UTC+9)';
            else ymd = dateformat(item.execDate, 'yyyy/mm/dd HH:MM:ss');

            // 入出金タイプを取得
            let io = 'Unknown';
            if (item.type === cst.TYPE_SEND) io = 'To';
            else if (item.type === cst.TYPE_RECEIVE) io = 'From';
            else if (item.type === cst.TYPE_FEE) io = 'Fee';

            // メッセージ設定
            text = `${text}[${ymd}]\n${item.amount}LSK (${io}:${item.targetNm})\n\n`;
        }
    }
    dm(twitterId, text);
}