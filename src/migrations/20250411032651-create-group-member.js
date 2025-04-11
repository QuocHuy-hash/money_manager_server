'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('GroupMembers', {
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
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'id'
        },
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'member'
      },
      permissions: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {
          view_transactions: true,
          add_transactions: false,
          edit_transactions: false,
          delete_transactions: false,
          view_budgets: true,
          edit_budgets: false
        }
      },
      joined_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      invitation_status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'
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
    await queryInterface.dropTable('GroupMembers');
  }
};