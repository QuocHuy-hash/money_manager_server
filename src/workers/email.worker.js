const Queue = require('bull');
const redisClient = require('../config/redis.config');
const { sendEmail } = require('../services/sendMailer/send.mail.service');

// Tạo hàng đợi email với redisClient
const emailQueue = new Queue('email', {
    redis: redisClient
});
// emailQueue.on('completed', (job) => {
//   console.log(`Job ${job.id} đã hoàn thành! Email đã gửi thành công đến ${job.data.to}`);
// });

// emailQueue.on('failed', (job, error) => {
//   console.error(`Job ${job.id} thất bại khi gửi email đến ${job.data.to}: ${error.message}`);
// });

// Sửa hàm process để lưu dữ liệu đúng format
emailQueue.process('group-invitation', async (job) => {
    const { to, groupName, invitee } = job.data;
    try {
        const subject = `Lời mời tham gia ${groupName}`;
        const text = `Xin chào,\n\nBạn đã được mời tham gia nhóm "${groupName}" bởi ${invitee.firstName} ${invitee.lastName}.\n\nVui lòng nhấp vào liên kết dưới đây để chấp nhận lời mời:\n\n[Chấp nhận lời mời]\n\nCảm ơn bạn!`;

        await sendEmail({ to, subject, text });
        return { success: true, message: `Đã gửi email thành công đến ${to}` };
    } catch (error) {
        console.error(`Lỗi khi gửi email đến ${to}:`, error);
        throw error;
    }
});

module.exports = emailQueue;
