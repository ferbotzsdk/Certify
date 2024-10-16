const JwtDecoder = require('./src/JwtDecoder');
const commonData = require('./src/CommonData');

module.exports = {
    ...JwtDecoder,
    ...commonData,
};