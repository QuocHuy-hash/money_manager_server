const fs = require('fs');
const crypto = require('crypto');
const cloudinary = require('../config/cloudinary.config');
const { Avatar } = require("../models");
// Function to generate a random ID
const generateRandomId = () => {
    return crypto.randomBytes(8).toString('hex');
};

//upload images
const uploadFromLocal = async (path, userId) => {
    const randomId = generateRandomId();
    const result = await cloudinary.uploader.upload(path, {
        folder: `money_manager`,
        public_id: `avartar-${randomId}`,
        resource_type: 'image',
    });
    // Xóa file tạm sau khi upload lên Cloudinary
    await uploadAvatar(result.secure_url, userId);
    fs.unlinkSync(path);
    return {
        image_url: result.secure_url,
        shopId: userId,
        thumb_url: await cloudinary.url(result.public_id, {
            height: 500,
            width: 500,
            crop: 'fill',
            quality: 'auto',
            format: 'jpg',
        })
    }
}
const showAvatar = async (userId) => {
    const avatar = await Avatar.findOne({
        where: { userId }
    });
    if (avatar) {
        return avatar.url;
    }
}
// delete image
const deleteImage = async (body, userId) => {
    const { publicId } = body;
    const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
    });
    return result;

}
const uploadAvatar = async (url, userId) => {
    const checkExist = await Avatar.findOne({
        where: { userId }
    });
    if (checkExist) {
        return await Avatar.update({ url }, { where: { userId } });
    }
    return await Avatar.create({ url, userId });
}
module.exports = { uploadFromLocal, deleteImage, showAvatar };