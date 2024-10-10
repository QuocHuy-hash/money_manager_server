'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class MonthlySaving extends Model {
        static associate(models) {
            MonthlySaving.belongsTo(models.FinancialGoal, {
                foreignKey: 'financial_goal_id',
                as: 'financialGoal'
            });
        }
    }

    MonthlySaving.init({
        financial_goal_id: DataTypes.INTEGER,
        month: DataTypes.STRING, // Ví dụ: "2024-10"
        amount_saved: DataTypes.DECIMAL, // Số tiền tiết kiệm được trong tháng
        percentage_of_goal: DataTypes.FLOAT // Phần trăm đạt được so với mục tiêu còn lại
    }, {
        sequelize,
        modelName: 'MonthlySaving',
        timestamp: true
    });

    return MonthlySaving;
};
