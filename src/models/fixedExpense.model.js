'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FixedExpense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FixedExpense.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });

    }
  }
  FixedExpense.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    frequency: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['daily', 'weekly', 'monthly', 'quarterly', 'annually']],
      }
    },
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    category_id: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'FixedExpense',
  });
  return FixedExpense;
};