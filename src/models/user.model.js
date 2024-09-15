'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
            User.hasMany(models.BankAccount, { foreignKey: 'user_id' });
            User.hasMany(models.Budget, { foreignKey: 'user_id' });
            User.hasMany(models.InvestmentPlan, { foreignKey: 'user_id' });
            User.hasMany(models.FinancialGoal, { foreignKey: 'user_id' });
            User.hasMany(models.Report, { foreignKey: 'user_id' });
            User.hasMany(models.FixedExpense, { foreignKey: 'user_id' });
            User.hasMany(models.FixedExpense, { foreignKey: 'user_id' });
            // User.hasMany(models.Notification, { foreignKey: 'user_id' });
        }
    }
    User.init({
        user_name: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING(10),
            unique: true,
            allowNull: false
        },
        full_name: {
            type: DataTypes.STRING(100),
            unique: true,
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        api_key: DataTypes.TEXT,
        token_device: {
            type: DataTypes.TEXT,
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        verify: {
            type: DataTypes.BOOLEAN, 
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'inactive',
            validate: {
                isIn: [['inactive', 'active']], // Giới hạn giá trị chỉ được là 'inactive' hoặc 'active'
            },
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        timestamps: true
    });
    return User;
};