'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Avatar extends Model {
    static associate(models) {
      // define association here
    }
  }
  Avatar.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    url: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'Avatar',
  });
  return Avatar;
};