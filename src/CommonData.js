const jwt = require("jsonwebtoken");
require("dotenv").config();
const bundlePrivateKey = process.env.BUNDLE_JWT_PRIVATE_KEY.replace(/\\n/g, '\n');
const bundlePublicKey = process.env.BUNDLE_JWT_PUBLIC_KEY.replace(/\\n/g, '\n');
const expiryTime = process.env.BUNDLE_JWT_EXPIRY || 2 * 60 * 60

async function encodeData(data) {
    return new Promise((resolve, reject) => {
        jwt.sign(data, bundlePrivateKey, { algorithm: 'RS256' , expiresIn: expiryTime }, function(error, token) {
            if(error){
                reject({message : error.message});
            }else {
                resolve(token);
            }
        });
    })
}

async function decodeData(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, bundlePublicKey, function(error, decoded) {
            if (error) reject({message : error.message});
            resolve(decoded);
        });
    })
}

module.exports = { encodeData,decodeData }