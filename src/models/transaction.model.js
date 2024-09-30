'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category',
      });
      Transaction.hasMany(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Transaction.belongsTo(models.BankAccount, { foreignKey: 'bankAccount_id', as: 'bankAccount' });
    }
  }
  Transaction.init({
    account_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    tid: DataTypes.STRING,
    title: DataTypes.STRING,
    cusum_balance: DataTypes.STRING,
    bookingDate: DataTypes.STRING,
    transaction_type: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    transaction_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};