'use strict'

const { CreatedResponse, SuccessResponse } = require("../core/success.response");
const FixedExpensesService = require("../services/fixedExpenses.service");

const HEADER = {
    CLIENT_ID: 'x-client-id',
};
class FixedExpensesController {
    userId = null;
    setUserId(req) {
        this.userId = req.headers[HEADER.CLIENT_ID];
    }
    addFixedExpenses = async (req, res, next) => {
        this.setUserId(req);
        new CreatedResponse({
            message: 'Add FixedExpenses successfully',
            metadata: await FixedExpensesService.addFixedExpenses(req.body, this.userId),
        }).send(res)

    }
    updateFixedExpenses = async (req, res, next) => {
        this.setUserId(req);
        new CreatedResponse({
            message: 'update FixedExpenses successfully',
            metadata: await FixedExpensesService.updateFixedExpenses(req.body, this.userId),
        }).send(res)

    }
    getDetail = async (req, res, next) => {
        const id = req.query.id;
        this.setUserId(req);
        new SuccessResponse({
            message: 'getDetail FixedExpenses successfully',
            metadata: await FixedExpensesService.getFixedExpensesById(id, this.userId),
        }).send(res)
    }
    getList = async (req, res, next) => {
        this.setUserId(req);
        const { startDate, endDate } = req.query;
        new SuccessResponse({
            message: 'getList FixedExpenses successfully',
            metadata: await FixedExpensesService.getFixedExpenses(this.userId, startDate, endDate),
        }).send(res)
    }
    deleteFixedExpenses = async (req, res, next) => {
        this.setUserId(req);
        const id = req.body.id;
        new SuccessResponse({
            message: 'delete FixedExpenses successfully',
            metadata: await FixedExpensesService.deleteFixedExpenses(id , this.userId),
        }).send(res)
    }
    


}

module.exports = new FixedExpensesController();