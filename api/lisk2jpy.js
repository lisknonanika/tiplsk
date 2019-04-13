const utils = require('../utils');
const request = require('../request');

module.exports = async(amount) => {
    const data = await request({
        method: 'GET',
        url: 'https://coincheck.com/api/rate/lsk_jpy',
        json: true
    });
    return utils.multiply(amount, data.rate);
}