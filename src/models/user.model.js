'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
            User.hasMany(models.Budget, { foreignKey: 'user_id' });
            User.hasMany(models.InvestmentPlan, { foreignKey: 'user_id' });
            User.hasMany(models.FinancialGoal, { foreignKey: 'user_id' });
            User.hasMany(models.Report, { foreignKey: 'user_id' });
            User.hasMany(models.FixedExpense, { foreignKey: 'user_id' });
            User.hasMany(models.Transaction, { foreignKey: 'user_id' });
        }
    }
    User.init({
        user_name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        phone_number: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        full_name: {
            type: DataTypes.STRING(60),
        },
        email: {
            type: DataTypes.STRING(60),
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
        },
       
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['user_name']
            },
            {
                unique: true,
                fields: ['phone_number']
            }
        ]
    });
    return User;
};