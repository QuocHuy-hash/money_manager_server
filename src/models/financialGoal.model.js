'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FinancialGoal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FinancialGoal.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  FinancialGoal.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    target_amount: DataTypes.DECIMAL,
    current_amount: DataTypes.DECIMAL,
    deadline: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'FinancialGoal',
  });
  return FinancialGoal;
}; 