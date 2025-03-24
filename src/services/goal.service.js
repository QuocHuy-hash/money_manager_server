// financialGoalService.js

const { FinancialGoal, MonthlySaving, User } = require('../models');
const { Op } = require('sequelize');
const { BadRequestError, NotFoundError } = require('../core/error.response');

class FinancialGoalService {
    // Tạo một mục tiêu tài chính mới cho người dùng
    async createFinancialGoal(data, userId) {
        try {
            const goal = await FinancialGoal.create({
                user_id: userId,
                name: data.name,
                target_amount: data.target_amount,
                current_amount: data.current_amount || 0,
                deadline: data.deadline,
            });

            goal.calculateMonthlySaving();
            await goal.save();

            if (data.current_amount && parseFloat(data.current_amount) > 0) {
                await logMonthlySaving(goal, parseFloat(data.current_amount));
            }
            return goal;
        } catch (error) {
            throw new BadRequestError('Error creating financial goal: ' + error.message);
        }
    }

    // Lấy danh sách mục tiêu tài chính của một người dùng
    async getUserFinancialGoals(userId) {
        try {
            const goals = await FinancialGoal.findAll({
                where: { user_id: userId, status: { [Op.ne]: 'deleted' } },
            });
            return goals;
        } catch (error) {
            throw new BadRequestError('Error fetching financial goals: ' + error.message);
        }
    }

    // Lấy thông tin chi tiết của một mục tiêu tài chính dựa trên ID
    async getFinancialGoalById(id, userId) {
        try {
            const goal = await FinancialGoal.findOne({
                where: {
                    id,
                    user_id: userId,
                    status: { [Op.ne]: 'deleted' }
                },
                include: [{ model: User, as: 'user' }]
            });
            if (!goal) {
                throw new NotFoundError('Financial goal not found');
            }
            return goal;
        } catch (error) {
            throw new BadRequestError('Error fetching financial goal: ' + error.message);
        }
    }

    // Cập nhật một mục tiêu tài chính
    async updateFinancialGoal(userId, data) {
        try {
            console.log("updateFinancialGoal:::", data);
            const goal = await FinancialGoal.findOne({
                where: { id: data.id, user_id: userId }
            });
            if (!goal) {
                throw new NotFoundError('Financial goal not found');
            }

            await logMonthlySaving(goal, data.amount_saved);

            goal.current_amount = parseFloat(goal.current_amount) + parseFloat(data.amount_saved);
            goal.current_amount = parseFloat(goal.current_amount.toFixed(2));

            goal.calculateMonthlySaving();
            await goal.save();

            return goal;
        } catch (error) {
            throw new BadRequestError('Error updating financial goal: ' + error.message);
        }
    }

    // Xóa một mục tiêu tài chính
    async deleteFinancialGoal(id, userId) {
        try {
            const goal = await FinancialGoal.findOne({
                where: { id, user_id: userId }
            });
            if (!goal) {
                throw new NotFoundError('Financial goal not found');
            }
            goal.status = 'deleted';
            await goal.save();
            return { message: 'Financial goal deleted successfully' };
        } catch (error) {
            throw new BadRequestError('Error deleting financial goal: ' + error.message);
        }
    }

    // Lấy danh sách lịch sử tiết kiệm của một mục tiêu tài chính
    async getMonthlySavings(goalId) {
        try {
            const savings = await MonthlySaving.findAll({
                where: { financial_goal_id: goalId },
                order: [['month', 'ASC']]
            });
            return savings;
        } catch (error) {
            throw new BadRequestError('Error fetching monthly savings: ' + error.message);
        }
    }

    // Lấy tổng tiết kiệm trong tháng cho tất cả mục tiêu của người dùng
    async getMonthlySavingsTotalForUser(userId, month) {
        try {
            if (!month || !/^\d{4}-\d{2}$/.test(month)) {
                throw new BadRequestError('Invalid month format (required: YYYY-MM)');
            }

            // Lấy danh sách các FinancialGoal của userId
            const goals = await FinancialGoal.findAll({
                where: {
                    user_id: userId,
                    status: { [Op.ne]: 'deleted' }
                },
                attributes: ['id']
            });

            if (!goals || goals.length === 0) {
                return { totalSavings: 0 };
            }

            // Lấy danh sách financial_goal_id từ các mục tiêu
            const goalIds = goals.map(goal => goal.id);

            // Truy vấn MonthlySaving dựa trên financial_goal_id và month
            const savings = await MonthlySaving.findAll({
                where: {
                    financial_goal_id: { [Op.in]: goalIds }, // Lọc theo danh sách goalIds
                    month
                }
            });

            // Tính tổng tiết kiệm
            const totalSavings = savings.reduce((sum, saving) => sum + parseFloat(saving.amount_saved), 0);
            return { totalSavings };
        } catch (error) {
            throw new BadRequestError('Error fetching total monthly savings: ' + error.message);
        }
    }
    // Tạo báo cáo cho một mục tiêu tài chính
    async generateGoalReport(goalId, userId) {
        if (!goalId) {
            throw new Error('Goal id is required');
        }
        const goal = await FinancialGoal.findOne({
            where: { id: goalId, user_id: userId }
        });
        if (!goal) {
            throw new NotFoundError('Financial goal not found');
        }

        const transactions = await MonthlySaving.findAll({
            where: { financial_goal_id: goalId },
            order: [['month', 'ASC']]
        });

        const reportData = transactions.map(transaction => ({
            month: transaction.month,
            amount_saved: parseFloat(transaction.amount_saved),
            percentage_of_goal_this_time: parseFloat(transaction.percentage_of_goal)
        }));

        const totalSaved = reportData.reduce((sum, transaction) => sum + transaction.amount_saved, 0);

        return {
            goalName: goal.name,
            targetAmount: goal.target_amount,
            currentAmount: goal.current_amount,
            totalSaved,
            totalPercentageCompleted: goal.total_percentage_completed,
            reportData
        };
    }

    async getTotalMonthlySavings(userId, month) {
        if (!month || !/^\d{4}-\d{2}$/.test(month)) {
            throw new BadRequestError('Invalid month format (required: YYYY-MM)');
        }
        const goals = await FinancialGoal.findAll({
            where: {
                user_id: userId,
                status: { [Op.ne]: 'deleted' }
            },
            attributes: ['id']
        });
        if (!goals || goals.length === 0) {
            return { totalSavings: 0 };
        }
        const goalIds = goals.map(goal => goal.id);


        const savings = await MonthlySaving.findAll({
            where: {
                financial_goal_id: { [Op.in]: goalIds },
                month: month
            }
        });
        const totalSavings = savings.reduce((sum, saving) => sum + parseFloat(saving.amount_saved), 0);
        console.log("Total savings for month:", month, "is", totalSavings);
        return { totalSavings };
    }
}

// Hàm hỗ trợ ghi lại lịch sử tiết kiệm hàng tháng
const logMonthlySaving = async (goal, amountSaved) => {
    try {
        const today = new Date();
        const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

        const targetAmount = parseFloat(goal.target_amount);
        const percentageOfGoalThisTime = (amountSaved / targetAmount) * 100;

        await MonthlySaving.create({
            financial_goal_id: goal.id,
            user_id: goal.user_id,
            month,
            amount_saved: amountSaved,
            percentage_of_goal: parseFloat(percentageOfGoalThisTime.toFixed(2))
        });
    } catch (error) {
        throw new Error('Error logging monthly saving: ' + error.message);
    }
};

module.exports = new FinancialGoalService();