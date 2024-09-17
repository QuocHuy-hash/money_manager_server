'use strict'

const { CreatedResponse, SuccessResponse } = require("../../core/success.response");
const { cassoLinkBank, getTransaction, getInfoBank, getTransactionDetail, getInfoConnected } = require("../../services/casso/bank.service");

class CassoBankController {
    addBankAccount = async (req, res, next) => {

        new CreatedResponse({
            message: 'link bank successfully',
            metadata: await cassoLinkBank(req.body),
        }).send(res)
    }
    getTransactions = async (req, res, next) => {
        new SuccessResponse({
            message: 'getTransactions Success',
            metadata: await getTransaction(req.body),
        }).send(res)
    }
    getInfo = async (req, res, next) => {
        new SuccessResponse({
            message: 'getInfoBank Success',
            metadata: await getInfoBank(),
        }).send(res)
    }
    getTransactionDetail = async (req, res, next) => {
        new SuccessResponse({
            message: 'getTransactionDetail Success',
            metadata: await getTransactionDetail(req.body),
        }).send(res)
    }
    getInfoConnected = async (req, res, next) => {
        new SuccessResponse({
            message: 'getInfoConnected Success',
            metadata: await getInfoConnected(),
        }).send(res)
    }
}

module.exports = new CassoBankController();