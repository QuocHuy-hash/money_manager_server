'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Budget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Budget.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
      Budget.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  Budget.init({
    user_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Budget',
  });
  return Budget;
};