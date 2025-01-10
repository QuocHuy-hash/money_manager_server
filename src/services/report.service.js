const { Op } = require('sequelize');
const { Transaction, Category } = require('../models');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const moment = require('moment');

class ReportService {



    // Hàm thống kê chi tiêu từng ngày để tạo dữ liệu cho biểu đồ đường (line chart)
    static async generateDailyExpenseReport(userId, startDate, endDate, type) {
        if (!startDate || !endDate) {
            throw new BadRequestError('Start date and end date are required');
        }
        const transactionType = type == 1 ? 'Chi tiêu' : 'Thu nhập';
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            throw new BadRequestError('End date cannot be earlier than start date');
        }

        try {
            const transactions = await Transaction.findAll({
                where: {
                    user_id: userId,
                    transaction_type: transactionType,
                    transaction_date: { [Op.gte]: start, [Op.lte]: end }
                },
                order: [['transaction_date', 'ASC']]
            });

            const dailyExpenses = {};

            transactions.forEach(transaction => {
                const date = moment(transaction.transaction_date).format('YYYY-MM-DD');
                const amount = parseFloat(transaction.amount);

                if (!dailyExpenses[date]) {
                    dailyExpenses[date] = amount;
                } else {
                    dailyExpenses[date] += amount;
                }
            });

            const dailyExpenseData = Object.keys(dailyExpenses).map(date => ({
                date,
                amount: dailyExpenses[date]
            }));

            return dailyExpenseData
        } catch (error) {
            console.error('Error generating daily expense report:', error);
            throw new BadRequestError('Error generating daily expense report');
        }
    }
    // Hàm thống kê tổng chi tiêu theo danh mục
    static async generateExpenseSummaryReport(userId, startDate, endDate, type) {
        if (!startDate || !endDate) {
            throw new BadRequestError('Start date and end date are required');
        }
        const transactionType = type == 1 ? 'Chi tiêu' : 'Thu nhập';
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            throw new BadRequestError('End date cannot be earlier than start date');
        }

        try {
            const transactions = await Transaction.findAll({
                where: {
                    user_id: userId,
                    transaction_type: transactionType,
                    transaction_date: { [Op.gte]: start, [Op.lte]: end }
                },
                include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
                order: [['transaction_date', 'DESC']]
            });

            let totalExpense = 0;
            const expenseByCategory = {};

            transactions.forEach(transaction => {
                const amount = parseFloat(transaction.amount);
                totalExpense += amount;

                const categoryId = transaction.category.id;
                const categoryName = transaction.category.name;

                if (!expenseByCategory[categoryId]) {
                    expenseByCategory[categoryId] = { categoryName, totalAmount: 0 };
                }
                expenseByCategory[categoryId].totalAmount += amount;
            });

            // Tính phần trăm cho mỗi danh mục dựa trên tổng chi tiêu
            Object.keys(expenseByCategory).forEach(categoryId => {
                const category = expenseByCategory[categoryId];
                category.percentage = ((category.totalAmount / totalExpense) * 100).toFixed(2);
            });
            console.log('generateExpenseSummaryReport', { totalExpense, expenseByCategory });
            return { totalExpense, expenseByCategory };
        } catch (error) {
            console.error('Error generating expense summary report:', error);
            throw new BadRequestError('Error generating expense summary report');
        }
    }
    static async getSummaryReport(userId, startDate, endDate) {
        if (!startDate || !endDate) {
            throw new BadRequestError('Start date and end date are required');
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        const transactions = await Transaction.findAll({
            where: {
                user_id: userId,
                transaction_date: { [Op.gte]: start, [Op.lte]: end }
            },
            include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
            order: [['transaction_type', 'DESC']]
        });

        if (!transactions) {
            throw new NotFoundError('Transactions not found');
        }
        let expense = 0;
        let salary = 0;

        transactions.forEach(transaction => {
            const amount = parseFloat(transaction.amount);
            if (transaction.transaction_type === 'Chi tiêu') {
                expense += amount;
            } else {
                salary += amount;
            }
        });
       return { expense, salary };
    }
}

module.exports = ReportService;
