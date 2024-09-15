'use strict'

const { CreatedResponse, SuccessResponse } = require("../core/success.response");
const { addBankAccount } = require("../services/bankAccount.service");
const HEADER = {
    CLIENT_ID: 'x-client-id',
};
class BankAccountController {
    userId = null;
    setUserId(req) {
        this.userId = req.headers[HEADER.CLIENT_ID];
    }
    addBankAccount = async (req, res, next) => {

        new CreatedResponse({
            message: 'addBankAccount successfully',
            metadata: await addBankAccount(req.body, this.userId),
        }).send(res)

    }
    
}

module.exports = new BankAccountController();