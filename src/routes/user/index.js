
/**
 * @swagger
 * tags:
 *   name: Shop
 *   description: APIs related to shop operations
 */
const express = require('express');
const router = express.Router();
const AccessController = require('../../controllers/user.controller');
const EmailController = require('../../controllers/verifyUser.controller');
const { asyncHandle } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtil');

router.post('/user/signup', asyncHandle(AccessController.signUp));
router.post('/user/login', asyncHandle(AccessController.login));
router.post('/user/resend-email', asyncHandle(EmailController.reSendMail));
router.post('/user/verify-email', asyncHandle(EmailController.verifyOtp));

router.use(authentication) //require login
router.get('/user/get-info', asyncHandle(AccessController.getUser));



module.exports = router;