const twitter = require('twitter-lite');
const config = require('config');

const define = (name, value) => {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: false,
        writable: false,
        configurable: false
    });
}

// App Setting
define('mode', config.mode);
define('coreUrl', 'http://localhost:3000/core/');
define('weburl', 'http://localhost:3000/web/');
define('blacklist', ['1052365035895283712']);
define('blacklistSource', ['PEING']);

// Lisk Setting
define('lisk', config.lisk);

// MongoDB Setting
define('mongo', config.mongo);
define('mongoClientParams', {auth:{user: config.mongo.user, password: config.mongo.password},
                             authSource: config.mongo.db, useNewUrlParser: true});

// Twitter Setting
define('twitter', config.twitter);
define('TwitterClient', new twitter({consumer_key: config.twitter.apiKey,
                                     consumer_secret: config.twitter.apiSecret,
                                     access_token_key: config.twitter.accessToken,
                                     access_token_secret: config.twitter.accessTokenSecret}));

const regexp = {
    "tip": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(tip:e|tip|send|チップ)\s+(@|＠)[0-9a-zA-Z_]{5,15}\s+([1-9][0-9]{0,4}|0)(\.\d{1,5})?($|\s)/i),
    "tip_s": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(tip:e|tip|send|チップ)\s+([1-9][0-9]{0,4}|0)(\.\d{1,5})?($|\s)/i),
    "balance": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(balance:e|balance|残高|所持金)($|\s)/i),
    "deposit": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(deposit:e|deposit|入金)($|\s)/i),
    "withdraw": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(withdraw:e|withdraw|出金|送金)\s+[0-9]{1,}L\s+([1-9][0-9]{0,4}|0)(\.\d{1,8})?($|\s)/i),
    "followme": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(followme|フォローして)($|\s)/i),
    "history": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(history:e|history|履歴)($|\s)/i),
    "webaccess": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(webaccess:e|webaccess)($|\s)/i),
    "resetpw": new RegExp(/(^|\s+)(@|＠)tiplsk\s+(resetpw:e|resetpw)($|\s)/i)
}
define('regexp', regexp);
define('filter', {track: "@tiplsk,＠tiplsk"});

const liskExplorer = config.mode === 'test'? "https://testnet-explorer.lisk.io/tx/": "https://explorer.lisk.io/tx/";
const message = {
    "tip"       : ["{0} さんへ\n\n{1} さんから {2} チップが届きました！",
                   "{0} さんへ\n\n{1} さんから {2} だーよー！",
                   "{0} さんへ\n\n{1} さんから {2} 届いていますよ？",
                   "{0} さんへ\n\n{1} さんからチップだよ！\n( ・ω・)つ【{2}】",
                   "{0} さんへ\n\n{1} さんからです！\n( ・ω・)つ【{2}】",
                   "{0} さんへ\n\n{1} さんが {2} チップをくれたみたい。",
                   "{0} さんへ\n\n{1} さんが {2} チップをくれたよ！",
                   "{0} さんへ\n\n{1} さんが {2} くれましたよ！",
                   "{0} さんへ\n\n{1} さんが {2} くれるみたいですよ！",
                   "{0} さんへ\n\n{1} さんが {2} くれましたー！",
                   "{0} さんへ\n\n{1} さんが {2} くれましたー！\nでも、なんででしょうね？",
                   "{0} さんへ\n\n{1} さんが {2} くれたよ？\nやったね！",
                   "{0} さんへ\n\n{1} さんがあなたにって {2} くれましたよ？\n今日は何かのお祝いですか？",
                   "{0} さんへ\n\n{2} {1}さんがくれたみたい。\nやったね！",
                   "{0} さんへ\n\n{2} が {1} さんから届きました！",
                   "{0} さんへ\n\nなんと {1} さんが {2} くれましたよ！",
                   "{0} さんへ\n\nやったやん！ {1} さんから {2} 届いたで！",
                   "{0} さんへ\n\nやったね！ {1} さんから {2} 届いたよ！",
                   "{0} さんへ\n\nやったね！ {1} さんが {2} くれるんだって！",
                   "{0} さんへ\n\n( ・ω・)つ【{2}】\nどうぞ！ {1} さんからです。",
                   "{0} さんへ\n\n{1} さんからだよ！\n( ・ω・)つ【{2}】",
                   "{0} さんへ\n\nおぉ！？ {1} さんが {2} くれたよ！",
                   "{0} さんへ\n\nおぉ！？ {1} さんから {2} 届いたよ！"],
    "tip_e"     : ["Hi {0}!\n\n{1} sent you {2}!",
                   "Hi {0}!\n\n{1} sent you {2}!\nIs today your anniversary?",
                   "Hi {0}!\n\n{1} sent you {2}!\ngood for you!",
                   "Hi {0}!\n\nYou got {2}!\nfrom {1}.",
                   "Hi {0}!\n\nWow!\nYou got {2} from {1}.",
                   "Hello {0}!\n\n{1} sent you {2}!",
                   "Hello {0}!\n\n{1} sent you {2}!\nIs today your anniversary?",
                   "Hello {0}!\n\n{1} sent you {2}!\ngood for you!",
                   "Hello {0}!\n\nYou got {2}!\nfrom {1}."],
    "withdraw"  : ["{0}LSK を {1} へ送金しました。(手数料:{2}LSK)\n\n" +
                   "承認状況はLisk Explorer等で確認してください。\n" + liskExplorer + "{3}"],
    "withdraw_e": ["Sent {0}LSK to {1}.(fee:{2}LSK)\n\n" +
                   "Please confirm the approval status with Lisk Explorer etc.\n" + liskExplorer + "{2}"],
    "balance"   : ["残高は {0} です。\n出金時はLiskの送金手数料がかかるのでご注意ください。",
                   "残高は {0} だよ！\n出金するときはLiskの送金手数料がかかるから注意してね？"],
    "balance_e" : ["You have {0}!\nIf you transfer LSK to your Lisk address, a fee will be charged."],
    "deposit"   : ["入金の際は発行されたKEYをトランザクションのメモ欄に入力してください。\n" +
                   "入力のし忘れ、間違いは対応できない可能性があるのでご注意ください。\n" +
                   "・KEY：{0}\n・入金先：{1}"],
    "deposit_e" : ["When depositing LSK, please enter the issued KEY in the reference field of the transaction.\n" +
                   "・KEY：{0}\n・ADDRESS：{1}\n\n" +
                   "[Notes]\nIf you forget to enter the KEY or wrong it, I may not be able to cope."],
    "receive"   : ["Confirmed your deposit of {0}LSK.\nPlease confirm the approval status with Lisk Explorer etc.\n" + liskExplorer + "{1}"],
    "web"       : ["WEBサイトにアクセスする為の情報をお知らせします。\n[ID]\n{0}\n[PW]\n{1}\n[URL]\n{2}"],
    "web_e"     : ["The information to access the website.\n[ID]\n{0}\n[PW]\n{1}\n[URL]\n{2}"],
    "resetpw"   : ["パスワードをリセットしました。\n[PW]\n{0}"],
    "resetpw_e" : ["Reset your password.\n[PW]\n{0}"],
    "howto"     : ["\n",
                   "\n\nhow to: https://lisknonanika.github.io/tiplisk/howto.html"]
}
define('message', message);

const errorMessage = {
    "tip"       : ["残高不足のためチップを渡せませんでした。",
                   "残高が不足しているみたいですよ？",
                   "残高不足です〜。",
                   "残高が足りないよ～。",
                   "ごめんなさい！\n残高が足りない時はチップを渡せないんです！",
                   "残高不足みたいですけど、間違っちゃいましたか？",
                   "残高不足なので、チップを渡せません。",
                   "残高が足りない時はチップ渡せないんです。",
                   "チップむーりー。\n残高足りないよ～。",
                   "ちょいちょい！\n残高より多く渡せへんで！",
                   "ごめんなぁ。。\n残高不足みたいやわぁ。。"],
    "tip_e"     : ["You do not have enough LSK..",
                   "Oops!Can not send LSK.\nBecause You do not have enough LSK..",
                   "Oops!\nYou do not have enough LSK..",
                   "Sorry.\nCan not send LSK.\nBecause You do not have enough LSK..",
                   "Sorry.\nYou do not have enough LSK..",
                   "You do not seem to have enough LSK to send it..",
                   "Could not do it!\nPlease check your balance.",
                   "Did you enter a wrong value?\nIt seems to be more than your LSK."],
    "withdraw"  : ["残高不足のため出金できませんでした。",
                   "残高不足です〜。",
                   "残高が足りないよ～。",
                   "出金できないみたい。\nLiskの手数料もあるから注意してね？",
                   "出金できないみたい。\n出金時はLiskの手数料がかかるから注意してね？",
                   "ごめんなさい！\n残高より多い枚数は出金できないんです！",
                   "ん？間違っちゃいましたか？\n残高が足りないみたいですよ？",
                   "出金したい枚数、持ってないみたいだよ？",
                   "出金？\nムリムリ",
                   "出金するにはちょーっと足りひんみたいやわぁ。。",
                   "ごめんなぁ。。\n残高たりひんみたいやわぁ。。"],
    "withdraw_e": ["You do not have enough LSK..",
                   "Oops!Can not send LSK.\nBecause You do not have enough LSK..",
                   "Oops!\nYou do not have enough LSK..",
                   "Sorry.\nCan not send LSK.\nBecause You do not have enough LSK..",
                   "Sorry.\nYou do not have enough LSK..",
                   "You do not seem to have enough LSK to send it..",
                   "Could not do it!\nPlease check your balance.",
                   "Did you enter a wrong value?\nIt seems to be more than your LSK."]
}
define('errorMessage', errorMessage);