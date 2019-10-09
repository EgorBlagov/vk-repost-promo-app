const qs = require('querystring');
const crypto = require('crypto');

const urlParams = qs.parse(URL_PARAMS);
const ordered = {};
Object.keys(urlParams).sort().forEach((key) => {
    if (key.slice(0, 3) === 'vk_') {
        ordered[key] = urlParams[key];
    }
});

const stringParams = qs.stringify(ordered);
const paramsHash = crypto
    .createHmac('sha256', secretKey)
    .update(stringParams)
    .digest()
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=$/, '');

console.log(paramsHash === urlParams.sign);