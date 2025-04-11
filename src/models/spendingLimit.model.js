'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpendingLimit extends Model {
    static associate(models) {
      SpendingLimit.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      SpendingLimit.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    }
  }
  
  SpendingLimit.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    period_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['daily', 'weekly', 'monthly', 'yearly']]
      },
      defaultValue: 'monthly'
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notification_threshold: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      defaultValue: 80, // Default notification at 80% of limit
      validate: {
        min: 1,
        max: 100
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: true // This is a premium feature
    }
  }, {
    sequelize,
    modelName: 'SpendingLimit',
    tableName: 'SpendingLimits',
    timestamps: true,
  });
  
  return SpendingLimit;
};