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
        month: DataTypes.STRING, 
        amount_saved: DataTypes.DECIMAL, 
        percentage_of_goal: DataTypes.FLOAT 
    }, {
        sequelize,
        modelName: 'MonthlySaving',
        timestamp: true
    });

    return MonthlySaving;
};
