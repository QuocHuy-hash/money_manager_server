'use strict'

const { CreatedResponse, SuccessResponse } = require("../core/success.response");
const CategoryClass = require("../services/category.service");
const TransactionService = require("../services/transactions.service");
const HEADER = {
    CLIENT_ID: 'x-client-id',
};
class TransactionController {
    userId = null;
    setUserId(req) {
        this.userId = req.headers[HEADER.CLIENT_ID];
    }
    addTransaction = async (req, res, next) => {
        this.setUserId(req);
        new CreatedResponse({
            message: 'Add Transaction successfully',
            metadata: await TransactionService.addTransaction(req.body, this.userId),
        }).send(res)

    }
    updateTransaction = async (req, res, next) => {

        new CreatedResponse({
            message: 'update Transaction successfully',
            metadata: await TransactionService.updateTransaction(req.body, this.userId),
        }).send(res)

    }
    getDetail = async (req, res, next) => {
        const id = req.query.id;

        new SuccessResponse({
            message: 'getDetail Transaction successfully',
            metadata: await TransactionService.getTransactionById(id, this.userId),
        }).send(res)
    }
    getList = async (req, res, next) => {
        this.setUserId(req);
        new SuccessResponse({
            message: 'getList Transaction successfully',
            metadata: await TransactionService.getTransactions(this.userId),
        }).send(res)
    }
    getListSummary = async (req, res, next) => {
        this.setUserId(req);
        new SuccessResponse({
            message: 'getListSummary successfully',
            metadata: await TransactionService.getTransactionSummary(this.userId),
        }).send(res)
    }
    getCategorys = async (req, res, next) => {
        new SuccessResponse({
            message: 'getListCategories successfully',
            metadata: await CategoryClass.getListCategories(),
        }).send(res)
    }

}

module.exports = new TransactionController();