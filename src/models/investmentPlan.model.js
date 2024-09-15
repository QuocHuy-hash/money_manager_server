'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvestmentPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      InvestmentPlan.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  InvestmentPlan.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    target_amount: DataTypes.DECIMAL,
    current_amount: DataTypes.DECIMAL,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'InvestmentPlan',
  });
  return InvestmentPlan;
};