const { BadRequestError } = require('../core/error.response');
const { Transaction } = require('../models');

class TransactionService {
    static async addTransaction(data, userId) {
        try {
            const transactionData = this._prepareTransactionData(data, userId);
            return await Transaction.create(transactionData);
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw new BadRequestError('Error adding transaction');
        }
    }

    static async updateTransaction(id, data, userId) {
        try {
            const transaction = await Transaction.findOne({ where: { id, user_id: userId } });
            if (!transaction) {
                throw new BadRequestError('Transaction not found');
            }
            const updatedData = this._prepareTransactionData(data);
            await transaction.update(updatedData);
            return transaction;
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw new BadRequestError('Error updating transaction');
        }
    }
    static async getTransactionById(id, userId) {
        try {
            return await Transaction.findOne({ where: { id, user_id: userId } });
        } catch (error) {
            console.error('Error getting transaction:', error);
            throw new BadRequestError('Error getting transaction');
        }
    }
    static async getTransactions(userId) {
        try {
            return await Transaction.findAll({ where: { user_id: userId } });
        } catch (error) {
            console.error('Error getting transactions:', error);
            throw new BadRequestError('Error getting transactions');
        }
    }
    static _prepareTransactionData(data, userId = null) {
        return {
            account_id: data.account_id,
            amount: data.amount,
            tid: data.tid || null,
            title: data.title,
            cusum_balance: data.cusum_balance || null,
            bookingDate: data.bookingDate || null,
            transaction_type: data.transaction_type,
            category_id: data.category_id,
            description: data.description,
            transaction_date: new Date(data.transaction_date),
            ...(userId && { user_id: userId })
        };
    }
}

module.exports = TransactionService;