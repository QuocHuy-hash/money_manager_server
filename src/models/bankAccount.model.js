'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BankAccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BankAccount.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      BankAccount.hasMany(models.Transaction, { foreignKey: 'bankAccount_id', as: 'transactions' });
    }
  }
  BankAccount.init({
    user_id: DataTypes.INTEGER,
    bank_name: DataTypes.STRING,
    account_name: DataTypes.STRING,
    account_number: DataTypes.STRING,
    balance: DataTypes.DECIMAL,
    last_sync: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'BankAccount',
  });
  return BankAccount;
};

