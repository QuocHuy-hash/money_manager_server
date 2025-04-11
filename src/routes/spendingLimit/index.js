const express = require('express');
const router = express.Router();

const { asyncHandle } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtil');
const spendingLimitController = require('../../controllers/spendingLimit.controller');

router.use(authentication) //require login

router.post('/spending-limit/create', asyncHandle(spendingLimitController.create));
router.post('/spending-limit/update', asyncHandle(spendingLimitController.update));
router.get('/spending-limit/get-user', asyncHandle(spendingLimitController.getUser));
router.get('/spending-limit/get-user-status', asyncHandle(spendingLimitController.getSpendingLimitStatus));
router.get('/spending-limit/get-by-id', asyncHandle(spendingLimitController.getById));
router.post('/spending-limit/delete', asyncHandle(spendingLimitController.delete));

module.exports = router; 