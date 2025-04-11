const { Op } = require('sequelize');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../core/error.response');
const { SpendingLimit, User, Category, Transaction, sequelize } = require('../models');

class SpendingLimitService {

    // Create a new spending limit for a category
    static async createSpendingLimit(userId, data) {
        // Check if user is premium
        const user = await User.findByPk(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        if (!user.is_premium) {
            throw new NotFoundError('Spending limits are a premium feature', 403);
        }

        // Check if category exists
        const category = await Category.findOne({ where: { id: data.category_id } });
        if (!category) {
            throw new NotFoundError('Category not found');
        }
        console.log("category", category);
        // Check if spending limit already exists for this category
        const existingLimit = await SpendingLimit.findOne({
            where: {
                user_id: userId,
                category_id: data.category_id,
                is_active: true
            }
        });

        if (existingLimit) {
            throw new BadRequestError('A spending limit for this category already exists');
        }

        // Create spending limit
        return await SpendingLimit.create({
            user_id: userId,
            category_id: data.category_id,
            amount: data.amount,
            period_type: data.period_type || 'monthly',
            start_date: data.start_date || new Date(),
            end_date: data.end_date || null,
            notification_threshold: data.notification_threshold || 80,
            is_active: true,
            is_premium: true
        });

    }

    // Update an existing spending limit
    static async updateSpendingLimit(userId, data) {
        try {
            const limit = await SpendingLimit.findOne({
                where: {
                    id: data.limitId,
                    user_id: userId,
                    is_active: true
                }
            });

            if (!limit) {
                throw new NotFoundError('Spending limit not found');
            }

            // Update the fields
            await limit.update({
                amount: data.amount || limit.amount,
                period_type: data.period_type || limit.period_type,
                start_date: data.start_date || limit.start_date,
                end_date: data.end_date || limit.end_date,
                notification_threshold: data.notification_threshold || limit.notification_threshold
            });

            return limit;
        } catch (error) {
            throw new BadRequestError(`Error updating spending limit: ${error.message}`);
        }
    }

    // Get all spending limits for a user
    static async getSpendingLimits(userId) {
        try {
            // Check if user is premium
            const user = await User.findByPk(userId);
            if (!user) {
                throw new NotFoundError('User not found');
            }

            if (!user.is_premium) {
                throw new BadRequestError('Spending limits are a premium feature');
            }

            return await SpendingLimit.findAll({
                where: {
                    user_id: userId,
                    is_active: true
                },
                attributes: ['id', 'amount', 'period_type', 'start_date', 'end_date', 'notification_threshold'],
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name', 'type']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
        } catch (error) {
            throw new BadRequestError(`Error fetching spending limits: ${error.message}`);
        }
    }

    // Get a specific spending limit by ID 8.4
    static async getSpendingLimitById(userId, spendingLimitId) {
        try {
            const limit = await SpendingLimit.findOne({
                where: {
                    id: spendingLimitId,
                    user_id: userId,
                    is_active: true
                },
                include: [{
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'type']
                }]
            });

            if (!limit) {
                throw new NotFoundError('Spending limit not found');
            }

            return limit;
        } catch (error) {
            throw new BadRequestError(`Error fetching spending limit: ${error.message}`);
        }
    }

    // Delete a spending limit
    static async deleteSpendingLimit(userId, limitId) {
        try {
            const limit = await SpendingLimit.findOne({
                where: {
                    id: limitId,
                    user_id: userId,
                    is_active: true
                }
            });

            if (!limit) {
                throw new NotFoundError('Spending limit not found');
            }

            // Instead of deleting, mark as inactive
            await limit.update({ is_active: false });

            return { message: 'Spending limit deleted successfully' };
        } catch (error) {
            throw new BadRequestError(`Error deleting spending limit: ${error.message}`);
        }
    }

    // Get current spending for each limit
    static async getSpendingLimitStatus(userId) {
        try {
            // Check if user is premium
            const user = await User.findByPk(userId);
            if (!user) {
                throw new NotFoundError('User not found');
            }

            if (!user.is_premium) {
                throw new BadRequestError('Spending limits are a premium feature');
            }

            // Get all active limits
            const limits = await SpendingLimit.findAll({
                where: {
                    user_id: userId,
                    is_active: true
                },
                include: [{
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'type']
                }]
            });

            const result = [];

            // For each limit, calculate the current spending
            for (const limit of limits) {
                // Calculate date range based on period_type
                const { startDate, endDate } = this._calculateDateRange(limit.period_type, limit.start_date);
                // Get sum of transactions in this category within date range
                const transactions = await Transaction.findAll({
                    where: {
                        user_id: userId,
                        category_id: limit.category_id,
                        transaction_date: {
                            [Op.gte]: startDate,
                            [Op.lte]: endDate
                        }
                    },
                    attributes: [
                        [sequelize.fn('SUM', sequelize.col('amount')), 'total']
                    ],
                    raw: true
                });

                const totalSpent = parseFloat(transactions[0].total || 0);
                const limitAmount = parseFloat(limit.amount);
                const percentageUsed = (totalSpent / limitAmount) * 100;
                const remaining = limitAmount - totalSpent;

                result.push({
                    limit_id: limit.id,
                    category_id: limit.category_id,
                    category_name: limit.category.name,
                    limit_amount: limitAmount,
                    total_spent: totalSpent,
                    percentage_used: Math.min(percentageUsed, 100).toFixed(2),
                    remaining: Math.max(remaining, 0).toFixed(2),
                    period: limit.period_type,
                    start_date: startDate,
                    end_date: endDate,
                    threshold_reached: percentageUsed >= limit.notification_threshold,
                    limit_exceeded: totalSpent > limitAmount
                });
            }

            return result;
        } catch (error) {
            throw new BadRequestError(`Error fetching spending limit status: ${error.message}`);
        }
    }

    // Helper method to calculate date range based on period type
    static _calculateDateRange(periodType, startDate) {
        const now = new Date();
        let start, end;

        switch (periodType) {
            case 'daily':
                start = new Date(now.setHours(0, 0, 0, 0));
                end = new Date(now.setHours(23, 59, 59, 999));
                break;

            case 'weekly':
                start = new Date(now);
                start.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
                start.setHours(0, 0, 0, 0);

                end = new Date(start);
                end.setDate(start.getDate() + 6); // End of week (Saturday)
                end.setHours(23, 59, 59, 999);
                break;

            case 'monthly':
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                break;

            case 'yearly':
                start = new Date(now.getFullYear(), 0, 1);
                end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
                break;

            default:
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        }

        // If a specific start date is provided and it's after the calculated start,
        // use it instead (for periods that started mid-cycle)
        if (startDate && new Date(startDate) > start) {
            start = new Date(startDate);
        }

        return { startDate: start, endDate: end };
    }
}

module.exports = SpendingLimitService;