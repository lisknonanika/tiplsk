const shuffle = require('shuffle-array');
const dateformat = require('dateformat');
const config = require('./config');

module.exports.isNumber = function(val){
  var regex = new RegExp(/^[0-9]+(\.[0-9]+)?$/);
  return regex.test(val);
}

module.exports.formatString = function(msg, params) {
    for (i = 0; i < params.length; i++) {
      msg = msg.replace("{" + i + "}", params[i]);
    }
    return msg;
}

module.exports.getMessage = function(messages, params) {
  let text = shuffle(messages, {'copy': true})[0];
  text = this.formatString(text, params);
  text = text + shuffle(config.message.random, {'copy': true})[0];
  text = text + "\n受付時刻：" + this.getTimeString()
  if (config.mode === "test") text = text + "\n\n※Testnetで実行中です。ご注意ください。";
  return text;
}

module.exports.getMessageEng = function(messages, params) {
  let text = shuffle(messages, {'copy': true})[0];
  text = this.formatString(text, params);
  text = text + shuffle(config.message.random_e, {'copy': true})[0];
  text = text + "\nTime：" + this.getTimeString() + "(UTC+9)"
  if (config.mode === "test") text = text + "\n\n※Running on Testnet";
  return text;
}

module.exports.getDateTime = function(addminutes) {
  let d = new Date();
  if (addminutes) d.setMinutes(d.getMinutes() + addminutes);
  return d;
}

module.exports.getTimeString = function() {
  return dateformat(new Date(), 'HH:MM:ss.l');
}

module.exports.getDateTimeString = function() {
  return dateformat(new Date(), 'yyyy/mm/dd HH:MM:ss.l');
}
