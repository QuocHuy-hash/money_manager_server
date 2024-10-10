'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Debt extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Debt.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        }
    }
    Debt.init({
        user_id: DataTypes.INTEGER,
        debtor_name: DataTypes.STRING,
        type: DataTypes.STRING,
        creditor: DataTypes.STRING,
        amount: DataTypes.DECIMAL,
        due_date: DataTypes.DATE,
        status: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Debt',
        timestamp: true
    });
    return Debt;
};
