'use strict'
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const crypto = require('node:crypto');
const { KeyTokenService, removeKeyById, findByRefreshTokenUsed, updateRefreshToken } = require('./key.token.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtil');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail, updateverifyUsers } = require('../models/repositoris/user.repo');
const { sendMail } = require('./sendMailer/send.mail.service');

/*
       1 - check username in dbs
       2 - match password
       3 - create AT vs RT and save
       4 - generate tokens
       5 - get data return login
   */
const login = async ({ userName, password, refreshToken = null }) => {
    //1.
    console.log(userName, password);
    const foundUser = await findByEmail({ user_name: userName });

    if (!foundUser) {
        throw new BadRequestError('User not registed');
    }
    console.log("foundUser", foundUser);
    if (!foundUser.verify) throw new BadRequestError('User is not verify account')
    //2.
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
        throw new AuthFailureError('Authentication error');
    }
    console.log("match", match);

    //3.
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    //4.
    const tokens = await createTokenPair({ userId: foundUser.id, userName }, publicKey, privateKey);

    await KeyTokenService({
        userId: foundUser.id,
        refreshToken: tokens.refreshToken,
        privateKey, publicKey
    });
    //Send Mail

    return {
        user: {
            id: foundUser.id, firstName: foundUser.firstName, lastName: foundUser.lastName, email: foundUser.email,
            user_name: foundUser.user_name, phone_number: foundUser.phone_number
        },
        tokens
    }
}
const AccessService = async (user) => {
    const { email, password, firstName, lastName, phoneNumber, userName } = user;

    const passwordHash = await bcrypt.hash(password, 10);

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ where: { email: email, user_name: userName } });

    // If the email already exists, return an error
    if (existingUser) {
        throw new BadRequestError('Error : User already register');
    }
    const newUser = await User.create({
        email, password: passwordHash, firstName, lastName, phone_number: phoneNumber, user_name: userName
    });
    if (newUser) {

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const keyStore = await KeyTokenService({
            userId: newUser.id,
            publicKey,
            privateKey,
            refreshToken: '111'
        });
        if (!keyStore) {
            return;
        }
        const tokens = await createTokenPair({ userId: newUser.id, email }, publicKey, privateKey);
        const subject = 'Verify Your Account'
        sendMail({ to: email, subject, text: email })
        return {
            code: '201',
            metadata: {
                shop: getInfoData({ fileds: ['id', 'email'], object: newUser }),
                tokens
            }
        }
    }

};

const logout = async (keyStore) => {
    console.log("keyStore", keyStore);
    const id = keyStore.id;
    const deleteKey = await removeKeyById(id);
    return deleteKey;
}

const handleRefreshToken = async (refreshToken) => {

    /* 
        check this token used
    */
    console.log("refreshToken", refreshToken);

    const foundToken = await findByRefreshTokenUsed(refreshToken);
    console.log("foundToken", foundToken);
    //neu co
    if (foundToken) {
        // decode xem may la thang nao?
        const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
        console.log({ userId, email });
        // xoa tat ca token trong keyStore
        await KeyTokenService.removeKeyById(userId);
        throw new ForbidenError('Something wrong happend !! please relogin');
    }

    // NO
    const holderToken = await findByRefreshTokenUsed(refreshToken);
    if (!holderToken) {
        throw new AuthFailureError('Shop not registed ');
    }

    // verify token
    const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey);
    // check user id
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
        throw new AuthFailureError('Shop not registed 2');
    }

    //create 1 cap token moi
    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);
    await updateRefreshToken(tokens.refreshToken, refreshToken);
    return {
        user: { userId, email },
        tokens
    }
}

const verifyUser = async ({ email, verify }) => {
    try {
        return await updateverifyUsers({ email, verify });
    } catch (error) {
        console.log("error :: ", error);
    }
}

const getUser = async (id) => { 
    const user = await User.findOne({ where: { id } });

    if (!user) {
        throw new BadRequestError('User not found');
    }
    return user;
}
module.exports = {
    AccessService,
    login,
    logout,
    handleRefreshToken,
    verifyUser,
    getUser
}