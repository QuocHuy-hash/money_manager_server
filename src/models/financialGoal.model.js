'use strict';
const { Model } = require('sequelize');

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
     * Tính toán số tiền cần tiết kiệm hàng tháng và tổng phần trăm đã hoàn thành.
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
      this.monthly_saving_amount = parseFloat(this.monthly_saving_amount);

      // Tính tổng phần trăm đã hoàn thành dựa trên số tiền hiện tại so với mục tiêu
      this.total_percentage_completed = (currentAmount / targetAmount) * 100;
      this.total_percentage_completed = parseFloat(this.total_percentage_completed.toFixed(2));
    }

    /**
     * Kiểm tra nếu người dùng không tiết kiệm tháng này, cộng dồn số tiền vào tháng sau (nếu cần).
     * (Tạm thời giữ lại nhưng có thể bỏ nếu không cần thiết theo yêu cầu mới.)
     */
    handleMissedSaving() {
      const today = new Date();
      let missedAmount = this.monthly_saving_amount;

      if (this.updated_saving_date) {
        const lastUpdateMonth = new Date(this.updated_saving_date).getMonth();
        const currentMonth = today.getMonth();
        if (currentMonth !== lastUpdateMonth) {
          this.missed_saving_amount = (parseFloat(this.missed_saving_amount) || 0) + missedAmount;
        }
      } else {
        this.missed_saving_amount = (parseFloat(this.missed_saving_amount) || 0) + missedAmount;
      }

      this.missed_saving_amount = parseFloat(this.missed_saving_amount.toFixed(2));
      this.updated_saving_date = today;
    }
  }

  FinancialGoal.init({
    user_id: DataTypes.INTEGER, // ID của người dùng sở hữu mục tiêu
    name: DataTypes.STRING, // Tên của mục tiêu tài chính
    target_amount: DataTypes.DECIMAL, // Số tiền mục tiêu cần đạt
    current_amount: {
      type: DataTypes.DECIMAL, // Số tiền hiện tại đã tiết kiệm được
      defaultValue: 0
    },
    deadline: DataTypes.DATE, // Thời hạn hoàn thành mục tiêu
    monthly_saving_amount: {
      type: DataTypes.DECIMAL, // Số tiền cần tiết kiệm mỗi tháng
      defaultValue: 0
    },
    missed_saving_amount: {
      type: DataTypes.DECIMAL, // Số tiền chưa tiết kiệm được từ các tháng trước (có thể bỏ nếu không cần)
      defaultValue: 0
    },
    total_percentage_completed: {
      type: DataTypes.DECIMAL, // Tổng phần trăm đã hoàn thành so với mục tiêu
      defaultValue: 0
    },
    updated_saving_date: DataTypes.DATE, // Thời gian gần nhất cập nhật tiền tiết kiệm
    reminder_day: DataTypes.INTEGER, // Ngày nhắc nhở trong tháng
    status: {
      type: DataTypes.STRING, // Trạng thái của mục tiêu (active, completed, deleted)
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'FinancialGoal',
    hooks: {
      beforeSave: (goal) => {
        goal.calculateMonthlySaving(); // Tự động tính toán trước khi lưu
      }
    }
  });

  return FinancialGoal;
};