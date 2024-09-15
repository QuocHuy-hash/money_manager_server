'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account_id: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      tid: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      cusum_balance: {
        type: Sequelize.STRING
      },
      bookingDate: {
        type: Sequelize.STRING
      },
      transaction_type: {
        type: Sequelize.STRING
      },
      category_id: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      transaction_date: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};