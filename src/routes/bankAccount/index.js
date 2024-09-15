
/**
 * @swagger
 * tags:
 *   name: Shop
 *   description: APIs related to shop operations
 */
const express = require('express');
const router = express.Router();
const BankAccountController = require('../../controllers/bankAccount.controller');
const { asyncHandle } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtil');
// const EmailController = require('../../controllers/verify_email/verify.controller');
router.use(authentication) //require login
router.post('/bankAccount/add', asyncHandle(BankAccountController.addBankAccount));


module.exports = router;