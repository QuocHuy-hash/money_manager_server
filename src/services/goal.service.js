// financialGoalService.js

const { FinancialGoal, MonthlySaving, User } = require('../models');
const { Op } = require('sequelize');

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
            throw new Error('Error creating financial goal: ' + error.message);
        }
    }

    // Lấy danh sách mục tiêu tài chính của một người dùng
    async getUserFinancialGoals(userId) {
        try {
            const goals = await FinancialGoal.findAll({
                where: { user_id: userId },
                // include: [{ model: User, as: 'user' }]
            });
            return goals;
        } catch (error) {
            throw new Error('Error fetching financial goals: ' + error.message);
        }
    }

    // Lấy thông tin chi tiết của một mục tiêu tài chính dựa trên ID
    async getFinancialGoalById(id, userId) {
        try {
            const goal = await FinancialGoal.findOne({
                where: { id, user_id: userId },
                include: [{ model: User, as: 'user' }]
            });
            if (!goal) {
                throw new Error('Financial goal not found');
            }
            return goal;
        } catch (error) {
            throw new Error('Error fetching financial goal: ' + error.message);
        }
    }

    // Cập nhật một mục tiêu tài chính và xử lý số tiền chưa tiết kiệm được
    async updateFinancialGoal(userId, data) {
        try {
            const goal = await FinancialGoal.findOne({
                where: { id: data.id, user_id: userId }
            });
            if (!goal) {
                throw new Error('Financial goal not found');
            }

            // Xử lý số tiền chưa tiết kiệm được nếu cần
            goal.handleMissedSaving();

            // Lưu lại lịch sử tiết kiệm của tháng hiện tại
            await logMonthlySaving(goal, data.amount_saved);
          

            goal.current_amount = parseFloat(goal.current_amount) + data.amount_saved;
            goal.calculateMonthlySaving();
            return await goal.save();
        } catch (error) {
            throw new Error('Error updating financial goal: ' + error.message);
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
                throw new Error('Financial goal not found');
            }
            await goal.destroy();
            return { message: 'Financial goal deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting financial goal: ' + error.message);
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
            throw new Error('Error fetching monthly savings: ' + error.message);
        }
    }
    // Tính phần trăm hoàn thành của một mục tiêu tài chính
    // async calculateCompletionPercentage(goalId) {
    //     try {
    //         const goal = await FinancialGoal.findByPk(goalId);
    //         if (!goal) {
    //             throw new Error('Financial goal not found');
    //         }
    //         const percentage = (goal.current_amount / goal.target_amount) * 100;
    //         return Math.min(percentage, 100); // Giới hạn ở 100%
    //     } catch (error) {
    //         throw new Error('Error calculating completion percentage: ' + error.message);
    //     }
    // }

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
