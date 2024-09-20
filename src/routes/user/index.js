
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

router.post('/user/signup', asyncHandle(AccessController.signUp));
router.post('/user/login', asyncHandle(AccessController.login));
router.post('/user/resend-email', asyncHandle(EmailController.reSendMail));
router.post('/user/verify-email', asyncHandle(EmailController.verifyOtp));



module.exports = router;