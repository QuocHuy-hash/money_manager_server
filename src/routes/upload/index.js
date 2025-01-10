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
