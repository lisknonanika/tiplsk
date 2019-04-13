const shuffle = require('shuffle-array');
const BigNumber = require('bignumber.js');
const dateformat = require('dateformat');
const config = require('./config');

/**
 * Check Empty
 */
module.exports.isEmpty = (val) => {
  return !val || Object.keys(val).length === 0;
}

/**
 * Check Decimal
 */
module.exports.isDecimal = (val) => {
  const regex = new RegExp(/^(0|[1-9]\d*)(\.\d+)?$/);
  return regex.test(val); 
}

/**
 * Message Format
 */
module.exports.formatString = (msg, params) => {
    for (i = 0; i < params.length; i++) {
      msg = msg.replace("{" + i + "}", params[i]);
    }
    return msg;
}

/**
 * Get Message
 */
module.exports.getMessage = (type, params) => {
  let text = shuffle(config.message[type], {'copy': true})[0];
  text = this.formatString(text, params);

  text = text + shuffle(config.message.howto, {'copy': true})[0];
  text = text + "\nTime: " + this.getTimeString() + "(UTC+9)"
  if (config.mode === "test") text = text + "\n\n※Running on Testnet";
  return text;
}

/**
 * Get DateTime
 */
module.exports.getDateTime = (addminutes) => {
  let d = new Date();
  if (addminutes) d.setMinutes(d.getMinutes() + addminutes);
  return d;
}

/**
 * Date Formated Time
 */
module.exports.getTimeString = () => {
  return dateformat(new Date(), 'HH:MM:ss.l');
}

/**
 * Get Formated DateTime
 */
module.exports.getDateTimeString = () => {
  return dateformat(new Date(), 'yyyy/mm/dd HH:MM:ss.l');
}

/**
 * Number -> String
 */
module.exports.num2str = (val) => {
    return new BigNumber(val).toFixed();
}

/**
 * val1 + val2
 */
module.exports.plus = (val1, val2) => {
    const d1 = new BigNumber(val1);
    const d2 = new BigNumber(val2);
    return d1.plus(d2).toFixed();
}

/**
 * val1 - val2
 */
module.exports.minus = (val1, val2) => {
    const d1 = new BigNumber(val1);
    const d2 = new BigNumber(val2);
    return d1.minus(d2).toFixed();
}

/**
 * val1 / val2
 */
module.exports.divide = (val1, val2) => {
    const d1 = new BigNumber(val1);
    const d2 = new BigNumber(val2);
    return d1.dividedBy(d2).toFixed();
}

/**
 * val1 * val2
 */
module.exports.multiply = (val1, val2) => {
    const d1 = new BigNumber(val1);
    const d2 = new BigNumber(val2);
    return d1.multipliedBy(d2).toFixed();
}
