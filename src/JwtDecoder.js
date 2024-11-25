const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtPublicKey = process.env.AUTH_JWT_PUBLIC_KEY.replace(/\\n/g, '\n');

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
            return await decodeJwt(token);
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

async function validateAuthWithRoles(bearer, grantedRoles){
    const token = bearer && bearer.startsWith("Bearer ") ? bearer.slice(7) : bearer;
    if (token) {
        try {
            const tokenData =  await decodeJwt(token);
            if (!grantedRoles.includes(tokenData.role)) {
                const e =  new Error('Unauthorized. You do not have the required role.')
                e.code = 403
                throw e;
            }else{
                return tokenData;
            }
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