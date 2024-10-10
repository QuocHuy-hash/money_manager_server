'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MonthlySavings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      financial_goal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'FinancialGoals',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      month: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount_saved: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      percentage_of_goal: {
        type: Sequelize.FLOAT,
        allowNull: false
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MonthlySavings');
  }
};