const { Op } = require('sequelize');
const { Transaction, Category } = require('../models');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const moment = require('moment');
const financialGoalService = require('./goal.service');

class ReportService {

    /**
  * Tạo báo cáo tài chính hàng năm cho người dùng dựa trên năm được chọn.
  * @param {string} userId - ID của người dùng.
  * @param {string} year - Năm cần tạo báo cáo (định dạng YYYY).
  * @returns {Object} Báo cáo tài chính hàng năm bao gồm thu nhập, chi tiêu, tiết kiệm và phân loại chi tiêu.
  * @throws {BadRequestError} Nếu năm không hợp lệ hoặc có lỗi trong quá trình xử lý.
  */
    static async generateYearlyFinancialReport(userId, year) {
        // Kiểm tra năm có hợp lệ không (phải là chuỗi 4 chữ số)
        if (!year || !/^\d{4}$/.test(year)) {
            throw new BadRequestError('Năm không hợp lệ, cần định dạng YYYY (ví dụ: 2024)');
        }

        // Khởi tạo cấu trúc dữ liệu trả về
        const report = {
            months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], // Danh sách các tháng
            income: Array(12).fill(0), // Mảng thu nhập hàng tháng, khởi tạo bằng 0
            expenses: Array(12).fill(0), // Mảng chi tiêu hàng tháng, khởi tạo bằng 0
            savings: Array(12).fill(0), // Mảng tiết kiệm hàng tháng, khởi tạo bằng 0
            categoryBreakdown: {}, // Phân loại chi tiêu theo danh mục
            yearlyTotals: {
                totalIncome: 0, // Tổng thu nhập cả năm
                totalExpenses: 0, // Tổng chi tiêu cả năm
                totalSavings: 0, // Tổng tiết kiệm cả năm
            },
        };

        try {
            // Xác định khoảng thời gian của năm
            const startDate = new Date(`${year}-01-01`); // Ngày bắt đầu: 01/01/YYYY
            const endDate = new Date(`${year}-12-31`); // Ngày kết thúc: 31/12/YYYY

            // Lấy tất cả giao dịch trong năm của người dùng
            const transactions = await Transaction.findAll({
                where: {
                    user_id: userId,
                    transaction_date: {
                        [Op.gte]: startDate, // Lớn hơn hoặc bằng ngày bắt đầu
                        [Op.lte]: endDate, // Nhỏ hơn hoặc bằng ngày kết thúc
                    },
                },
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name'],
                    },
                ],
            });

            // Khởi tạo biến để tính tổng theo danh mục chi tiêu
            const categoryTotals = {};

            // Xử lý các giao dịch để tính thu nhập, chi tiêu và phân loại chi tiêu
            if (transactions.length > 0) {
                transactions.forEach((transaction) => {
                    const month = new Date(transaction.transaction_date).getMonth(); // Lấy tháng (0-11)
                    const amount = parseFloat(transaction.amount); // Chuyển đổi số tiền thành số thực

                    // Phân loại giao dịch
                    if (transaction.transaction_type === 'Chi tiêu') {
                        // Cộng dồn chi tiêu theo tháng
                        report.expenses[month] += amount;
                        report.yearlyTotals.totalExpenses += amount;

                        // Cộng dồn chi tiêu theo danh mục
                        if (transaction.category) {
                            const categoryName = transaction.category.name;
                            categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + amount;
                        }
                    } else {
                        // Nếu không phải chi tiêu, coi như thu nhập
                        report.income[month] += amount;
                        report.yearlyTotals.totalIncome += amount;
                    }
                });
            }

            // Tính tiết kiệm hàng tháng từ mục tiêu tài chính
            await Promise.all(
                report.months.map(async (month, index) => {
                    const monthStr = `${year}-${month.padStart(2, '0')}`; // Định dạng YYYY-MM

                    try {
                        // Lấy tổng tiết kiệm cho tháng này
                        const { totalSavings } = await financialGoalService.getTotalMonthlySavings(userId, monthStr);
                        console.log("totalSavings", totalSavings);
                        report.savings[index] = totalSavings || 0; // Gán tiết kiệm cho tháng
                        report.yearlyTotals.totalSavings += totalSavings || 0; // Cộng vào tổng tiết kiệm
                    } catch (error) {
                        console.error(`Lỗi khi lấy tiết kiệm cho tháng ${monthStr}:`, error);
                        report.savings[index] = 0; // Gán 0 nếu có lỗi
                    }
                })
            );

            // Gán phân loại chi tiêu vào báo cáo
            report.categoryBreakdown = categoryTotals;

            // Làm tròn tất cả các số để hiển thị đẹp hơn
            report.income = report.income.map((val) => Math.round(val));
            report.expenses = report.expenses.map((val) => Math.round(val));
            report.savings = report.savings.map((val) => Math.round(val));
            report.yearlyTotals.totalIncome = Math.round(report.yearlyTotals.totalIncome);
            report.yearlyTotals.totalExpenses = Math.round(report.yearlyTotals.totalExpenses);
            report.yearlyTotals.totalSavings = Math.round(report.yearlyTotals.totalSavings);

            // Làm tròn số liệu trong categoryBreakdown
            Object.keys(report.categoryBreakdown).forEach((category) => {
                report.categoryBreakdown[category] = Math.round(report.categoryBreakdown[category]);
            });

            return report;
        } catch (error) {
            throw new BadRequestError(`Lỗi khi tạo báo cáo tài chính hàng năm: ${error.message}`);
        }
    }
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
