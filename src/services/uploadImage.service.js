const fs = require('fs').promises;
const crypto = require('crypto');
const cloudinary = require('../config/cloudinary.config');
const { Avatar } = require("../models");

// Function to generate a random ID
const generateRandomId = () => crypto.randomBytes(8).toString('hex');

// Upload image from local path to Cloudinary
const uploadFromLocal = async (path, userId) => {
    const randomId = generateRandomId();

    try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(path, {
            folder: `money_manager`,
            public_id: `avatar-${randomId}`,
            resource_type: 'image',
        });

        // Find existing avatar and delete it
        const existingAvatar = await Avatar.findOne({ where: { userId } });
        if (existingAvatar?.public_id) {
            await cloudinary.uploader.destroy(existingAvatar.public_id, { resource_type: 'image' });
        }

        // Save new avatar to database
        const avatarData = { url: result.secure_url, public_id: result.public_id, userId };
        if (existingAvatar) {
            await Avatar.update(avatarData, { where: { userId } });
        } else {
            await Avatar.create(avatarData);
        }

        // Delete temporary file
        await fs.unlink(path);

        return {
            image_url: result.secure_url,
            shopId: userId,
            publicID: result.public_id,
        };
    } catch (error) {
        // Cleanup file if upload fails
        await fs.unlink(path).catch(() => null);
        throw error;
    }
};

// Show user's avatar URL
const showAvatar = async (userId) => {
    const avatar = await Avatar.findOne({ where: { userId } });
    return avatar?.url || null;
};

// Delete user's avatar
const deleteImage = async (userId) => {
    const avatar = await Avatar.findOne({ where: { userId }, attributes: ['public_id'] });
    if (!avatar?.public_id) return null;
    return await cloudinary.uploader.destroy(avatar.public_id, { resource_type: 'image' });
};

module.exports = { uploadFromLocal, deleteImage, showAvatar };
