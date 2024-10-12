const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtPublicKey = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n');

async function decodeJwt(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtPublicKey, function(error, decoded) {
            if (error) reject({message : error.message});
            resolve(decoded);
        });
    })
}

async function decodeJwtFlexible(token){
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtPublicKey, function(error, decoded) {
            if (error) {
                if (error.name === 'TokenExpiredError') {
                    const decodedData = jwt.decode(token); // Decode without verification
                    resolve(decodedData);
                } else {
                    reject({message : error.message});
                }
            } else {
                resolve(decoded);
            }
        })
    })
}

module.exports = { decodeJwt, decodeJwtFlexible };