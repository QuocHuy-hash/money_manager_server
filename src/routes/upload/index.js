/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: User avatar upload and management
 */

/**
 * @swagger
 * /api/avartar/user/upload:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: string
 *                 format: binary
 *                 description: Image file for avatar
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Avatar uploaded successfully
 *                 imageUrl:
 *                   type: string
 *                   example: /uploads/user-123-avatar.jpg
 *       400:
 *         description: Invalid file format or size
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/avartar/user/show-avatar:
 *   get:
 *     summary: Get user's avatar
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User avatar details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatarUrl:
 *                   type: string
 *                   example: /uploads/user-123-avatar.jpg
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Avatar not found
 */

const express = require('express');
const { uploadDisk } = require('../../config/multer.config');
const { asyncHandle } = require('../../auth/checkAuth');
const uploadController = require('../../controllers/upload.controller');
const { authentication } = require('../../auth/authUtil');
const router = express.Router();


//authenticationr
router.use(authentication) //require login
router.post('/avartar/user/upload', uploadDisk.single('images'), asyncHandle(uploadController.uploadFromLocal)); 
router.get('/avartar/user/show-avatar', asyncHandle(uploadController.showAvatar)); 
// router.post('/products/delete', asyncHandle(uploadController.deleteImage));
// router.post('/products/multiple', uploadDisk.array('files', 3), asyncHandle(uploadController.uploadFromLocal));


module.exports = router;
