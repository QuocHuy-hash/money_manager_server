'use strict'
const JWT = require('jsonwebtoken');
const { asyncHandle } = require('./checkAuth');
const { findByUserId } = require('../services/key.token.service');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
};
const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        });
        console.log("accessToken ", accessToken);
        console.log("refreshToken ", refreshToken);
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log("looix", err);
            } else {
                console.log("decode ", decode);
            }
        });
        return { accessToken, refreshToken }
    } catch (error) {
        console.error("error ", error);
    }
}

const authentication = asyncHandle(async (req, res, next) => {
    /**
     * 1: check missing userID 
     * 2: get access token 
     * 3: vefify token 
     * 4: check usser in dbs 
     * 5: check keyStore with this userID
     * 6: ok all next
     */

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new AuthFailureError('Invalid Request_1');

    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError('not found keyStore');
    const accessToken = req.headers[HEADER.AUTHORIZATION];

    if (!accessToken) throw new AuthFailureError('Invalid Request_2');

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId != decodeUser.userId) throw new AuthFailureError('Invalid Request_2');
        res.keyStore = keyStore;

        return next()
    } catch (error) {
        throw error
    }
})
const verifyJWT = async (token, keySecret) => {
    return JWT.verify(token, keySecret);
}
module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}