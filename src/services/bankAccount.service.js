const { BadRequestError } = require('../core/error.response');
const { BankAccount } = require('../models');

const addBankAccount = async (data , userId) => { 
    const { account_number, account_name, bank_name, balance, last_sync } = data;
    const foundBankAccount = await BankAccount.findOne({ where: { account_number: account_number, bank_name: bank_name } });
    if(foundBankAccount) {
        throw new BadRequestError('Bank Account already exists');
    }
    return await BankAccount.create({
        user_id: userId, account_number, account_name, bank_name, balance, last_sync
    });

}


module.exports = { addBankAccount }