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

async function validateAuth(bearer){
    const token = bearer && bearer.startsWith("Bearer ") ? bearer.slice(7) : bearer;
    if (token) {
        try {
            await decodeJwt(token);
        }catch (error){
            const e =  new Error(error.message)
            e.code = 401
            throw e;
        }
    }else {
        const e =  new Error('No token provided.')
        e.code = 400
        throw e;
    }
}

module.exports = { decodeJwt, decodeJwtFlexible, validateAuth };