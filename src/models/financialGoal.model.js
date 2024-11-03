'use strict';
const { Model, BIGINT } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FinancialGoal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FinancialGoal.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }

    /**
     * Tính toán số tiền cần tiết kiệm hàng tháng.
     * Tính toán này sẽ tính cả số tiền chưa tiết kiệm được từ các tháng trước (nếu có).
     */
    calculateMonthlySaving() {
      if (typeof this.deadline === 'string') {
        this.deadline = new Date(this.deadline);
      }
      if (!this.deadline || !(this.deadline instanceof Date) || isNaN(this.deadline.getTime())) {
        throw new Error('Invalid deadline date.');
      }

      const today = new Date();
      const monthsLeft = Math.max(1, (this.deadline.getFullYear() - today.getFullYear()) * 12 + (this.deadline.getMonth() - today.getMonth()));

      const targetAmount = parseFloat(this.target_amount || '0');
      const currentAmount = parseFloat(this.current_amount || '0');
      const remainingAmount = targetAmount - currentAmount;

      // Tính số tiền cần tiết kiệm hàng tháng và giới hạn số chữ số thập phân
      this.monthly_saving_amount = remainingAmount > 0 ? (remainingAmount / monthsLeft).toFixed(2) : 0;
      // Chuyển đổi lại về kiểu số để đảm bảo tính toán chính xác
      this.monthly_saving_amount = parseFloat(this.monthly_saving_amount);
    }

    /**
     * Kiểm tra nếu người dùng không tiết kiệm tháng này, cộng dồn số tiền vào tháng sau.
     */
    handleMissedSaving() {
      const today = new Date();
      let missedAmount = this.monthly_saving_amount;

      if (this.updated_saving_date) {
        const lastUpdateMonth = new Date(this.updated_saving_date).getMonth();
        const currentMonth = today.getMonth();
        // Nếu chưa tiết kiệm trong tháng này
        if (currentMonth !== lastUpdateMonth) {
          // Cộng dồn số tiền tiết kiệm bị bỏ lỡ và giới hạn số chữ số thập phân
          this.missed_saving_amount = this.missed_saving_amount  + missedAmount;
        }
      } else {
        // Nếu chưa bao giờ tiết kiệm
        this.missed_saving_amount = this.missed_saving_amount + missedAmount;
      }

      // Chuyển đổi lại về kiểu số để đảm bảo tính toán chính xác
      this.missed_saving_amount = parseFloat(this.missed_saving_amount);
      this.missed_saving_amount = this.missed_saving_amount.toFixed(2);
      // Cập nhật lại thời gian tiết kiệm
      this.updated_saving_date = today;
    }
}

  FinancialGoal.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    target_amount: DataTypes.DECIMAL,
    current_amount: DataTypes.DECIMAL,
    deadline: DataTypes.DATE,
    monthly_saving_amount: DataTypes.DECIMAL, // Số tiền cần tiết kiệm mỗi tháng
    missed_saving_amount: {
      type: DataTypes.DECIMAL, // Số tiền chưa tiết kiệm được từ các tháng trước
      defaultValue: 0
    },
    updated_saving_date: DataTypes.DATE, // Thời gian gần nhất cập nhật tiền tiết kiệm
    reminder_day: DataTypes.INTEGER, // Ngày nhắc nhở trong tháng
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active' // Trạng thái của mục tiêu
    }
  }, {
    sequelize,
    modelName: 'FinancialGoal',
    hooks: {
      beforeSave: (goal) => {
      
        goal.calculateMonthlySaving(); 
      }
    }
  });

  return FinancialGoal;
};
