const { Keytoken } = require('../models');

const KeyTokenService = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
        console.log(" userId", userId);
        let token = await Keytoken.findOne({ where: { userId } });

        if (token) {
            // Cập nhật bản ghi nếu nó đã tồn tại
            token.publicKey = publicKey;
            token.privateKey = privateKey;
            token.refreshToken = refreshToken;
            token.refreshTokenUsed = []; // Đặt lại mảng này nếu cần
            await token.save();
        } else {
            // Tạo bản ghi mới nếu không tìm thấy
            token = await Keytoken.create({
                userId,
                publicKey,
                privateKey,
                refreshToken,
            });
        }

        return token ? token.publicKey : null;
    } catch (error) {
        console.error('Lỗi:', error);
        throw error;
    }
};
const findByUserId = async (userId) => {
    return await Keytoken.findOne({ where: { userId } });
}
const removeKeyById = async (id) => {
    return await Keytoken.destroy({ where: { id } });
}
const findByRefreshTokenUsed = async (refreshToken) => {
    return await Keytoken.findOne({ where: { refreshTokensUsed: refreshToken } });
}

const findByRefreshToken = async (refreshToken) => {
    return await Keytoken.findOne({ where: { refreshToken } });
}

const updateRefreshToken = async (refreshToken, refreshTokenUsed) => {
    const token = await Keytoken.findOne({ where: { refreshToken: refreshTokenUsed } });
    console.log("totken", token);
    if (token) {
        await token.update({
            refreshToken,
            $addToSet: {
                refreshTokensUsed: refreshTokenUsed // Already used to obtain a new token
            }
        });
    }

    console.log('check token result', token, refreshTokenUsed);
}
module.exports = {
    KeyTokenService,
    findByUserId,
    removeKeyById,
    findByRefreshTokenUsed,
    findByRefreshToken,
    updateRefreshToken

};