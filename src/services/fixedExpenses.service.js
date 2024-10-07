
const { Op } = require('sequelize');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { FixedExpense, Category } = require('../models');
const { parse, isValid } = require('date-fns');
const { enGB } = require('date-fns/locale');
class FixedExpensesService {

    static async addFixedExpenses(body, userId) {
        const user_id = userId;
        try {
            const expenseData = this._prepareFixedExpensesData(body, user_id);
            console.log("expenseData ", expenseData);
            return await FixedExpense.create(expenseData);
        } catch (error) {
            console.log("error ", error);
            throw new BadRequestError('Error adding FixedExpenses', error);
        }
    }
    static async updateFixedExpenses(data, userId) {
        const id = data.data.id;

        try {
            const expense = await FixedExpense.findOne({ where: { id, user_id: userId } });
            if (!expense) {
                throw new NotFoundError('FixedExpenses not found');
            }
            const currentDate = new Date();
            if (expense.end_date && expense.end_date instanceof Date) {
                if (currentDate > expense.end_date) {
                    throw new BadRequestError('Cannot update FixedExpense: End date has passed');
                }
            }
            const updatedData = this._prepareFixedExpensesData(data);
            await expense.update(updatedData);
            return expense;
        } catch (error) {
            throw new BadRequestError(`Error updating FixedExpenses ${error}`);
        }
    }
    static async getFixedExpensesById(id, userId) {
        try {
            return await FixedExpense.findOne({
                where: { id, user_id: userId }, include: [{
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'] // Chỉ lấy ID và tên của category
                }]
            });
        } catch (error) {
            console.error('Error getting FixedExpenses:', error);
            throw new BadRequestError('Error getting FixedExpenses');
        }
    }
    static async getFixedExpenses(userId, startDate, endDate) {
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
                start_date: {
                    [Op.gte]: start,
                    [Op.lte]: end
                }
            };

            return await FixedExpense.findAll({
                where: whereClause,
                include: [{
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'] // Chỉ lấy ID và tên của category
                }]
            });
        } catch (error) {
            throw new BadRequestError(`Error getting FixedExpenses:: ${error}`);
        }
    }

    static async deleteFixedExpenses(id, userId) {
        try {
            const expense = await FixedExpense.findOne({ where: { id, user_id: userId } });
            if (!expense) {
                throw new BadRequestError('FixedExpenses not found');
            }
            const currentDate = new Date();
            if (expense.end_date && expense.end_date instanceof Date) {
                // Compare the current date with the end_date
                if (currentDate > expense.end_date) {
                    throw new BadRequestError('Cannot delete FixedExpense: End date has passed');
                }
            }
            await expense.destroy();
            return expense;
        } catch (error) {
            throw new BadRequestError(`Error deleting FixedExpenses ${error}`,);
        }
    }
    static _prepareFixedExpensesData(data, userId = null) {

        const item = data.data
        if (typeof item.start_date === 'string' && typeof item.end_date === 'string') {
            const startDate = parse(item.start_date, 'yyyy-MM-dd HH:mm:ss', new Date());
            const endDate = parse(item.end_date, 'yyyy-MM-dd HH:mm:ss', new Date());

            if (!isValid(startDate) || !isValid(endDate)) {
                throw new BadRequestError('Invalid date format');
            }

            return {
                name: item.name || '',
                amount: item.amount || 0,
                frequency: item.frequency || null,
                start_date: startDate,
                end_date: endDate,
                category_id: item.category_id,
                description: item.description,
                ...(userId && { user_id: userId })
            };
        } else {
            throw new BadRequestError('Start date or end date is missing or in the incorrect format');
        }
    }
}
module.exports = FixedExpensesService;