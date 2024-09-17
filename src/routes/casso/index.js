
const express = require('express');
const router = express.Router()
const { asyncHandle } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtil');
const CassoBankController = require('../../controllers/casso/bank.controller');
// const EmailController = require('../../controllers/verify_email/verify.controller');
router.use(authentication) //require login
router.post('/link-bank', asyncHandle(CassoBankController.addBankAccount));
router.get('/get-transactions', asyncHandle(CassoBankController.getTransactions)); 
router.get('/get-info-bank', asyncHandle(CassoBankController.getInfo)); 
router.post('/get-transactions-details', asyncHandle(CassoBankController.getTransactionDetail)); 
router.get('/get-bank-connected', asyncHandle(CassoBankController.getInfoConnected)); 


module.exports = router;