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
                ...data
            });

            // Tính toán số tiền cần tiết kiệm hàng tháng khi tạo mục tiêu
            goal.calculateMonthlySaving();
            await goal.save();

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
                // include: [{ model: User, as: 'user' }]
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
                    id, user_id: userId, status: { [Op.ne]: 'deleted' }
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

    // Cập nhật một mục tiêu tài chính và xử lý số tiền chưa tiết kiệm được
    async updateFinancialGoal(userId, data) {
        try {

            const goal = await FinancialGoal.findOne({
                where: { id: data.id, user_id: userId }
            });
            if (!goal) {
                throw new NotFoundError('Financial goal not found');
            }

            // Xử lý số tiền chưa tiết kiệm được nếu cần
            goal.handleMissedSaving();

            // Lưu lại lịch sử tiết kiệm của tháng hiện tại
            await logMonthlySaving(goal, data.amount_saved);

            console.log("goal:::", goal.current_amount);
            console.log("data.amount_saved:::", data.amount_saved);
            // Cập nhật số tiền hiện tại và tính toán lại số tiền cần tiết kiệm hàng tháng
            goal.current_amount = parseFloat(goal.current_amount) + parseFloat(data.amount_saved);
            goal.current_amount = parseFloat(goal.current_amount.toFixed(2)); // Giới hạn số chữ số thập phân
            await goal.calculateMonthlySaving();
            console.log("goal:::", goal);
            return await goal.save();
        } catch (error) {
            throw new BadRequestError('Error updating financial goal: ' + error.message);
        }
    }

    // Xóa một mục tiêu tài chính
    async deleteFinancialGoal(id, userId) {
        try {
            const goal = await FinancialGoal.findOne({
                where: { id, user_id: userId },
                include: [{ model: User, as: 'user' }]
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
    // Hàm tạo báo cáo cho một mục tiêu tài chính
    async generateGoalReport(goalId, userId) {
        try {
            if (!goalId) { throw new Error('Goal id is required'); }
            // Lấy thông tin mục tiêu để đảm bảo nó tồn tại và thuộc về người dùng
            const goal = await FinancialGoal.findOne({
                where: { id: goalId, user_id: userId }
            });
            if (!goal) {
                throw new NotFoundError('Financial goal not found');
            }

            // Lấy tất cả các giao dịch liên quan đến mục tiêu này
            const transactions = await MonthlySaving.findAll({
                where: { financial_goal_id: goalId },
                order: [['month', 'ASC']] // Sắp xếp theo tháng từ cũ đến mới
            });

            // Tổng hợp dữ liệu theo thời gian
            const reportData = transactions.map(transaction => ({
                month: transaction.month, // tháng
                amount_saved: parseFloat(transaction.amount_saved), // số tiền đã tiết kiệm
                percentage_of_goal: parseFloat(transaction.percentage_of_goal) // phần trăm đạt được so với mục tiêu
            }));

            // Tổng số tiền đã tiết kiệm được
            const totalSaved = reportData.reduce((sum, transaction) => sum + transaction.amount_saved, 0);

            return  {
                    goalName: goal.name,
                    targetAmount: goal.target_amount,
                    currentAmount: goal.current_amount,
                    totalSaved,
                    reportData };
        } catch (error) {
            console.error('Error generating goal report:', error);
            throw new BadRequestError('Error generating goal report: ' + error.message);
        }
    }

    // // Kiểm tra và cập nhật trạng thái của một mục tiêu tài chính
    // async checkAndUpdateGoalStatus(goalId) {
    //     try {
    //         const goal = await FinancialGoal.findByPk(goalId);
    //         if (!goal) {
    //             throw new Error('Financial goal not found');
    //         }
    //         if (goal.current_amount >= goal.target_amount) {
    //             // Cập nhật trạng thái nếu đã hoàn thành
    //             await goal.update({ status: 'completed' });
    //             return { message: 'Goal has been marked as completed' };
    //         }
    //         return { message: 'Goal is not yet completed' };
    //     } catch (error) {
    //         throw new Error('Error updating goal status: ' + error.message);
    //     }
    // }

    // // Lấy danh sách mục tiêu tài chính gần hết hạn
    // async getGoalsNearDeadline(userId, days = 7) {
    //     try {
    //         const today = new Date();
    //         const deadlineDate = new Date(today);
    //         deadlineDate.setDate(today.getDate() + days);

    //         const goals = await FinancialGoal.findAll({
    //             where: {
    //                 user_id: userId,
    //                 deadline: {
    //                     [Op.lte]: deadlineDate
    //                 }
    //             }
    //         });
    //         return goals;
    //     } catch (error) {
    //         throw new Error('Error fetching goals near deadline: ' + error.message);
    //     }
    // }

    // Cập nhật số tiền tiết kiệm hàng tháng, xử lý số tiền chưa tiết kiệm được
    // async updateMonthlySavingAmount(goalId) {
    //     try {
    //         const goal = await FinancialGoal.findByPk(goalId);
    //         if (!goal) {
    //             throw new Error('Financial goal not found');
    //         }

    //         // Tính toán lại số tiền cần tiết kiệm hàng tháng và lưu lại
    //         goal.calculateMonthlySaving();
    //         await goal.save();

    //         return { message: 'Monthly saving amount updated successfully', monthly_saving_amount: goal.monthly_saving_amount };
    //     } catch (error) {
    //         throw new Error('Error updating monthly saving amount: ' + error.message);
    //     }
    // }

    // Ghi lại lịch sử tiết kiệm hàng tháng




}
const logMonthlySaving = async (goal, amountSaved) => {
    try {
        const today = new Date();
        const month = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`; // Lưu tháng dạng "YYYY-MM"

        // Tính phần trăm đạt được so với số tiền còn lại của mục tiêu
        const remainingAmount = goal.target_amount - goal.current_amount;
        const percentageOfGoal = (amountSaved / remainingAmount) * 100;

        // Tạo bản ghi lịch sử tiết kiệm cho tháng này
        await MonthlySaving.create({
            financial_goal_id: goal.id,
            month,
            amount_saved: amountSaved,
            percentage_of_goal: Math.min(percentageOfGoal, 100)
        });
    } catch (error) {
        throw new Error('Error logging monthly saving: ' + error.message);
    }
}
module.exports = new FinancialGoalService();
