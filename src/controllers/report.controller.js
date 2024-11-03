'use strict'

const {  SuccessResponse } = require("../core/success.response");
const ReportService = require("../services/report.service");
const FinancialGoalService = require("../services/goal.service");
const HEADER = {
    CLIENT_ID: 'x-client-id',
};
class ReportController {
    userId = null;
    setUserId(req) {
        this.userId = req.headers[HEADER.CLIENT_ID];
    }
    GenerateReport = async (req, res, next) => {
        this.setUserId(req);
        const { startDate, endDate,type } = req.query;
        new SuccessResponse({
            message: 'generateExpenseSummaryReport successfully',
            metadata: await ReportService.generateExpenseSummaryReport(this.userId, startDate, endDate, type),
        }).send(res)
    }
    DailyExpenseReport = async (req, res, next) => {
        this.setUserId(req);
        const { startDate, endDate, type } = req.query;
        new SuccessResponse({
            message: 'generateDailyExpenseReport successfully',
            metadata: await ReportService.generateDailyExpenseReport(this.userId, startDate, endDate, type),
        }).send(res)
    }
    DailyGoalReport = async (req, res, next) => {
        this.setUserId(req);
        const { goalId } = req.query;
        new SuccessResponse({
            message: 'generateDailyExpenseReport successfully',
            metadata: await FinancialGoalService.generateGoalReport(goalId, this.userId),
        }).send(res)
    }
}

module.exports = new ReportController();