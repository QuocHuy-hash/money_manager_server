'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SpendingLimits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id'
        },
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      period_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'monthly'
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notification_threshold: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 80
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_premium: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    await queryInterface.dropTable('SpendingLimits');
  }
};