const { Category } = require('../models');
class CategoryClass {
    static async getListCategories() {
        return await Category.findAll();
    }
}


module.exports = CategoryClass;