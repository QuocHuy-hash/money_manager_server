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
                transaction_date: {
                    [Op.gte]: start,
                    [Op.lte]: end
                }
            };

            // Lấy tất cả transactions, bao gồm category liên quan
            const transactions = await Transaction.findAll({
                where: whereClause,
                include: [{
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'] // Chỉ lấy ID và tên của category
                }]
            });

            // Nhóm theo category và tính tổng số tiền
            const categoryTotals = {};
            let totalAmount = 0;
            let salaryTotal = 0; // Tổng tiền của lương 
            let bonusTotal = 0; // Tổng tiền của thưởng 

            transactions.forEach(transaction => {
                const categoryId = transaction.category.id;
                const categoryName = transaction.category.name;
                const amount = parseFloat(transaction.amount);

                // Tính tổng cho từng category
                if (!categoryTotals[categoryId]) {
                    categoryTotals[categoryId] = {
                        categoryName,
                        totalAmount: 0
                    };
                }
                categoryTotals[categoryId].totalAmount += amount;

                // Tính tổng số tiền lương và thưởng 
                if (categoryId === 8) {
                    salaryTotal += amount;
                }
                if (categoryId === 11) {
                    bonusTotal += amount;
                }

                // Tổng tất cả các giao dịch
                totalAmount += amount;
            });
            // Tính phần trăm cho từng category
            Object.keys(categoryTotals).forEach(categoryId => {
                const category = categoryTotals[categoryId];
                category.percentage = ((category.totalAmount / totalAmount) * 100).toFixed(2);
            });
            // Tính phần trăm tăng hoặc giảm so với lương (category 8) và thưởng (category 11)
            const salaryPercentage = (salaryTotal / totalAmount) * 100;
            const bonusPercentage = (bonusTotal / totalAmount) * 100;

            return {
                totalAmount,
                categoryTotals,
                salaryTotal,
                bonusTotal,
                salaryPercentage: salaryPercentage.toFixed(2), // Làm tròn 2 chữ số sau dấu thập phân
                bonusPercentage: bonusPercentage.toFixed(2)
            };
        } catch (error) {
            console.error('Error getting transaction summary:', error);
            throw new BadRequestError('Error getting transaction summary');
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