'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FinancialGoals', {
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
          model: 'Users', // Liên kết với bảng Users
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false // Tên mục tiêu tài chính, không được để trống
      },
      target_amount: {
        type: Sequelize.DECIMAL(10, 2), // Số tiền mục tiêu, 10 chữ số, 2 chữ số thập phân
        allowNull: false
      },
      current_amount: {
        type: Sequelize.DECIMAL(10, 2), // Số tiền hiện tại, mặc định là 0
        allowNull: false,
        defaultValue: 0
      },
      deadline: {
        type: Sequelize.DATE, // Thời hạn hoàn thành mục tiêu
        allowNull: false
      },
      monthly_saving_amount: {
        type: Sequelize.DECIMAL(10, 2), // Số tiền cần tiết kiệm mỗi tháng, mặc định là 0
        allowNull: false,
        defaultValue: 0
      },
      missed_saving_amount: {
        type: Sequelize.DECIMAL(10, 2), // Số tiền chưa tiết kiệm được từ các tháng trước, mặc định là 0
        allowNull: false,
        defaultValue: 0
      },
      total_percentage_completed: {
        type: Sequelize.DECIMAL(5, 2), // Tổng phần trăm đã hoàn thành, 5 chữ số, 2 chữ số thập phân, mặc định là 0
        allowNull: false,
        defaultValue: 0
      },
      updated_saving_date: {
        type: Sequelize.DATE // Thời gian gần nhất cập nhật tiền tiết kiệm
      },
      reminder_day: {
        type: Sequelize.INTEGER // Ngày nhắc nhở trong tháng
      },
      status: {
        type: Sequelize.STRING, // Trạng thái của mục tiêu (active, completed, deleted)
        defaultValue: 'active'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE // Thời gian tạo bản ghi
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE // Thời gian cập nhật bản ghi
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FinancialGoals'); // Xóa bảng nếu cần rollback
  }
};