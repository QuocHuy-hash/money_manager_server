'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Report.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }
  Report.init({
    user_id: DataTypes.INTEGER,
    report_type: DataTypes.STRING,
    investment: DataTypes.STRING,
    goal: DataTypes.STRING,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};