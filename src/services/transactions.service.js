const { Op } = require('sequelize');
const { BadRequestError } = require('../core/error.response');
const { Transaction, Category } = require('../models');

class TransactionService {
    static async addTransaction(body, userId) {
        const user_id = userId;
        try {
            const transactionData = this._prepareTransactionData(body.data, user_id);
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
    static async getTransactions(userId, startDate, endDate) {
        if (!startDate || !endDate) {
            throw new BadRequestError('Start date and end date are required');
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            throw new BadRequestError('End date cannot be earlier than start date');
        }

        try {
            const whereClause = {
                user_id: userId,
                transaction_date: {
                    [Op.gte]: start,
                    [Op.lte]: end
                }
            };

            return await Transaction.findAll({
                where: whereClause,
                include: [{
                    model: Category,
                    as: 'category',
                    attributes: ['name']
                }]
            });
        } catch (error) {
            console.error('Error getting transactions:', error);
            throw new BadRequestError('Error getting transactions');
        }
    }
    static async getTransactionSummary(userId, startDate, endDate) {
        if (!startDate || !endDate) {
            throw new BadRequestError('Start date and end date are required');
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            throw new BadRequestError('End date cannot be earlier than start date');
        }

        try {
            const whereClause = {
                user_id: userId,
                transaction_date: { [Op.gte]: start, [Op.lte]: end }
            };

            const transactions = await Transaction.findAll({
                where: whereClause,
                include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
                order: [['transaction_date', 'DESC']]
            });

            const categoryTotals = {};
            let totalAmount = 0, salaryTotal = 0, bonusTotal = 0, expenseTotal = 0;

            transactions.forEach(transaction => {
                const categoryId = transaction.category.id;
                const categoryName = transaction.category.name;
                const amount = parseFloat(transaction.amount);

                if (!categoryTotals[categoryId]) {
                    categoryTotals[categoryId] = {
                        categoryName,
                        categoryId,
                        totalAmount: 0,
                        representativeDate: new Date(transaction.transaction_date)
                    };
                }
                categoryTotals[categoryId].totalAmount += amount;

                // Phân loại thu nhập và chi tiêu
                if (categoryId === 8) salaryTotal += amount; // Lương
                else if (categoryId === 11) bonusTotal += amount; // Thưởng
                else expenseTotal += amount; // Chi tiêu (các category khác)

                totalAmount += amount;
            });

            Object.keys(categoryTotals).forEach(categoryId => {
                const category = categoryTotals[categoryId];
                category.percentage = totalAmount > 0 ? ((category.totalAmount / totalAmount) * 100).toFixed(2) : '0.00';
            });

            return {
                totalAmount,
                categoryTotals,
                salaryTotal,
                bonusTotal,
                expenseTotal, // Thêm expenseTotal để frontend dễ tính toán số dư
                salaryPercentage: totalAmount > 0 ? (salaryTotal / totalAmount * 100).toFixed(2) : '0.00',
                bonusPercentage: totalAmount > 0 ? (bonusTotal / totalAmount * 100).toFixed(2) : '0.00'
            };
        } catch (error) {
            console.error('Error getting transaction summary:', error);
            throw new BadRequestError(`Error getting transaction summary: ${error.message}`);
        }
    }
    static async getTransactionsByCategory(userId, categoryId, startDate = null, endDate = null) {
        const whereClause = {
            user_id: userId,
            category_id: categoryId
        };

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end < start) {
                throw new BadRequestError('End date cannot be earlier than start date');
            }

            whereClause.transaction_date = {
                [Op.gte]: start,
                [Op.lte]: end,
            };
        }

        try {
            return await Transaction.findAll({
                where: whereClause,
                include: [{
                    model: Category,
                    as: 'category',
                    attributes: ['name'] // Hiển thị tên category
                }],
                order: [['transaction_date', 'DESC']] // Sắp xếp theo ngày giao dịch từ mới nhất đến cũ nhất
            });
        } catch (error) {
            console.error('Error getting transactions by category:', error);
            throw new BadRequestError('Error getting transactions by category');
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