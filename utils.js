const shuffle = require('shuffle-array');
const BigNumber = require('bignumber.js');
const dateformat = require('dateformat');
const config = require('./config');

/**
 * Check Empty
 */
module.exports.isEmpty = (val) => {
  return val == null || val.length === 0 || JSON.stringify(val) === "{}";
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
    msg = msg.replace(`{${i}}`, params[i]);
  }
  return msg;
}

/**
 * Get Message
 */
module.exports.getMessage = (type, params, isError) => {
  const messages = !isError? config.message[type]: config.errorMessage[type];
  let text = this.formatString(shuffle(messages, {'copy': true})[0], params);
  text = text + shuffle(config.message.howto, {'copy': true})[0];
  if (type.endsWith('_e')) text = text + `\nTime: ${this.getTimeString()}(UTC+9)`;
  else text = text + `\n受付時刻: ${this.getTimeString()}`;
  if (config.mode === 'test') text = `${text}\n\n※Running on Testnet`;
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
module.exports.num2str = (val, fix) => {
  if (!fix) return new BigNumber(val).toFixed();
  else return new BigNumber(val).toFixed(fix);
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
