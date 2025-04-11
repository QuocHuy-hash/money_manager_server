const Queue = require('bull');
const redisClient = require('../config/redis.config');
const { sendEmail } = require('../services/sendMailer/send.mail.service');

// Tạo hàng đợi email với redisClient
const emailQueue = new Queue('email', {
    redis: redisClient
});

// Xử lý công việc trong hàng đợi
emailQueue.process(async ({to, subject, html}) => {
    try {
        await sendEmail({ to, subject, html });
        console.log(`Đã gửi email thành công đến ${to}`);
    } catch (error) {
        console.error(`Lỗi khi gửi email đến ${to}:`, error);
    }
});

module.exports = emailQueue;

console.log('Worker đang chạy và chờ xử lý email...');