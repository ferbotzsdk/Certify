const jwt = require("jsonwebtoken");
require("dotenv").config();
const expiryTime = process.env.AUTH_BUNDLE_JWT_EXPIRY || 2 * 60 * 60

async function encodeData(data,bundlePrivateKey) {
    return new Promise((resolve, reject) => {
        jwt.sign(data, bundlePrivateKey, { algorithm: 'RS256' , expiresIn: parseInt(expiryTime) }, function(error, token) {
            if(error){
                reject({message : error.message});
            }else {
                resolve(token);
            }
        });
    })
}

async function decodeData(token,bundlePublicKey) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, bundlePublicKey, function(error, decoded) {
            if (error) reject({message : error.message});
            resolve(decoded);
        });
    })
}

module.exports = { encodeData,decodeData }
