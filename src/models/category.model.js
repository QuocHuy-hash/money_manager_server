'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.hasMany(models.Transaction, {
        foreignKey: 'categoryId',
        as: 'transactions',
      });
    }
  }

  Category.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
  }, {
    sequelize,
    timestamp: true,
    modelName: 'Category',
  });

  // Gọi hàm để thêm danh mục
  return Category;
};
