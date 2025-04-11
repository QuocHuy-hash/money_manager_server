'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupMember extends Model {
    static associate(models) {
      GroupMember.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      GroupMember.belongsTo(models.Group, { foreignKey: 'group_id', as: 'group' });
    }
  }
  
  GroupMember.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['owner', 'admin', 'member']]
      },
      defaultValue: 'member'
    },
    permissions: {
      type: DataTypes.JSON,
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
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    invitation_status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['pending', 'accepted', 'rejected']]
      },
      defaultValue: 'pending'
    }
  }, {
    sequelize,
    modelName: 'GroupMember',
    tableName: 'GroupMembers',
    timestamps: true,
  });
  
  return GroupMember;
};