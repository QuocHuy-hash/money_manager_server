
const express = require('express');
const router = express.Router();

const { asyncHandle } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtil');
const ReportController = require('../../controllers/report.controller');

router.use(authentication) //require login

router.get('/report/expense-summary', asyncHandle(ReportController.GenerateReport));
router.get('/report/summary', asyncHandle(ReportController.GenerateSummaryReport));
router.get('/report/expense-daily', asyncHandle(ReportController.DailyExpenseReport));
router.get('/report/goal', asyncHandle(ReportController.DailyGoalReport));



module.exports = router; 