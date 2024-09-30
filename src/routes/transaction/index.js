
const express = require('express');
const router = express.Router();

const { asyncHandle } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtil');
const TransactionController = require('../../controllers/transactions.controller');

router.use(authentication) //require login
router.post('/transaction/add', asyncHandle(TransactionController.addTransaction));
router.post('/transaction/update', asyncHandle(TransactionController.updateTransaction));
router.get('/transaction/get-detail', asyncHandle(TransactionController.getDetail));
router.get('/transaction/get-list', asyncHandle(TransactionController.getList));
router.get('/transaction/get-categorys', asyncHandle(TransactionController.getCategorys));
router.get('/transaction/get-list-summary', asyncHandle(TransactionController.getListSummary)); 


module.exports = router; 