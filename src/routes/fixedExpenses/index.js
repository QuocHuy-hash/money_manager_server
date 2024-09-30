
const express = require('express');
const router = express.Router();

const { asyncHandle } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtil');
const fixedExpensesController = require('../../controllers/fixedExpenses.controller');


router.use(authentication) //require login
router.post('/fixed-expense/add', asyncHandle(fixedExpensesController.addFixedExpenses));
router.post('/fixed-expense/update', asyncHandle(fixedExpensesController.updateFixedExpenses));
router.get('/fixed-expense/get-detail', asyncHandle(fixedExpensesController.getDetail));
router.get('/fixed-expense/get-list', asyncHandle(fixedExpensesController.getList));
router.post('/fixed-expense/delete', asyncHandle(fixedExpensesController.deleteFixedExpenses));

module.exports = router; 