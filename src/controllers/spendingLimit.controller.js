'use strict'

const { SuccessResponse, CreatedResponse } = require("../core/success.response");
const SpendingLimitService = require("../services/spendingLimit.service");
const HEADER = {
    CLIENT_ID: 'x-client-id',
};
class SpendingLimitController {
     userId = null;
    setUserId(req) {
        this.userId = req.headers[HEADER.CLIENT_ID];
    }
    create = async (req, res, next) => {
        this.setUserId(req);
        new CreatedResponse({
            message: 'create Spending Limit Success',
            metadata: await SpendingLimitService.createSpendingLimit(this.userId, req.body),
        }).send(res)

    }
     update = async (req, res, next) => {
        this.setUserId(req);
        new CreatedResponse({
            message: 'update Spending Limit Success',
            metadata: await SpendingLimitService.updateSpendingLimit(this.userId, req.body),
        }).send(res)

    }
    getUser = async (req, res, next) => {
        this.setUserId(req);
        new SuccessResponse({
            message: 'Get Spending Limit Success',
            metadata: await SpendingLimitService.getSpendingLimits(this.userId),
       }).send(res)
    }
    getById = async (req, res, next) => {
        this.setUserId(req);
        const spendingLimitId = req.query.spendingLimitId;
        new SuccessResponse({
            message: 'Get Spending Limit Success',
            metadata: await SpendingLimitService.getSpendingLimitById(this.userId,spendingLimitId),
       }).send(res)
    }
    delete = async (req, res, next) => {
            this.setUserId(req);
            const spendingLimitId = req.body.spendingLimitId;
            new SuccessResponse({
                message: 'Delete Spending Limit Success',
                metadata: await SpendingLimitService.deleteSpendingLimit(this.userId,spendingLimitId),
           }).send(res)
        }
    getSpendingLimitStatus = async (req, res, next) => {
        this.setUserId(req);
        new SuccessResponse({
            message: 'Get Spending Limit Status Success',
            metadata: await SpendingLimitService.getSpendingLimitStatus(this.userId),
       }).send(res)
    }
}

module.exports = new SpendingLimitController();