'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.hasMany(models.GroupMember, { foreignKey: 'group_id' });
      Group.belongsToMany(models.User, {  
        through: 'UserGroups', 
        foreignKey: 'group_id',
        as: 'group' 
      });
      Group.belongsTo(models.User, { 
        foreignKey: 'owner_id', 
        as: 'owner' 
      });
    }
  }
  
  Group.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: true // Family sharing is a premium feature
    },
    max_members: {
      type: DataTypes.INTEGER,
      defaultValue: 5 // Default max members in a group
    }
  }, {
    sequelize,
    modelName: 'Group',
    tableName: 'Groups',
    timestamps: true,
  });
  
  return Group;
};