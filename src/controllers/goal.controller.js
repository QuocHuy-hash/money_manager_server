'use strict'

const { CreatedResponse, SuccessResponse } = require("../core/success.response");
const { createFinancialGoal, getUserFinancialGoals, getFinancialGoalById, updateFinancialGoal } = require("../services/goal.service");

const HEADER = {
    CLIENT_ID: 'x-client-id',
};
class GoalsController {
    userId = null;
    setUserId(req) {
        this.userId = req.headers[HEADER.CLIENT_ID];
    }

    addGoal = async (req, res, next) => {
        this.setUserId(req);
        new CreatedResponse({
            message: 'addGoal Success',
            metadata: await createFinancialGoal(req.body, this.userId),
        }).send(res)

    }
    updateGoal = async (req, res, next) => {
        this.setUserId(req);
        new CreatedResponse({
            message: 'updateGoal Success',
            metadata: await updateFinancialGoal(this.userId, req.body),
        }).send(res)

    }
    getDetail = async (req, res, next) => {
        this.setUserId(req);
        new SuccessResponse({
            message: 'getDetail FinancialGoals successfully',
            metadata: await getUserFinancialGoals( this.userId),
        }).send(res)
    }
    getFinancialGoalById = async (req, res, next) => {
        const id = req.query.id;
        this.setUserId(req);
        new SuccessResponse({
            message: 'getFinancialGoalById successfully',
            metadata: await getFinancialGoalById(id, this.userId),
        }).send(res)
    }

} 

module.exports = new GoalsController();