const nodemailer = require('nodemailer');
require('dotenv').config();
const { BadRequestError } = require('../../core/error.response');
// const { cli } = require('winston/lib/winston/config');
const { User } = require('../../models');
const redisClient = require('../../config/redis.config');
const { get, set, expire, del } = require('../../utils/redis.util');
const { htmlEmailToken } = require('../../utils/template.html');

// const { log } = require('winston');
// const sendMail = async (body) => {
//     await redisClient.connect();
//     try {
//         const { to, subject, text } = body;
//         let transporter = nodemailer.createTransport({
//             host: "localhost:3055",
//             port: 587,
//             secure: false,
//             service: 'gmail',
//             auth: {
//                 user: 'huy343536@gmail.com',
//                 pass: 'swsa axux pgyc ljvy',
//             },
//         });
//         const otp = Math.floor(100000 + Math.random() * 900000);
//         // Save the OTP
//         await set(to, otp);
//         await expire(to, 300);
//         const mailOptions = {
//             from: 'admin.moneymanager@gmail.com',
//             to: to,
//             subject: subject,
//             // text: `Input OTP [ ${otp} ]For Account ${text} Into Confirm Your Accoount  `, htmlEmailToken
//             html: htmlEmailToken(otp, to),
//         };
//         let info = await transporter.sendMail(mailOptions);
//         console.log("Send mail successfuly");
//         await redisClient.disconnect();
//         return info;
//     } catch (error) {
//         await redisClient.disconnect();
//         throw new BadRequestError("An error occurred while sending the email::" + error);
//     }
// };
const sendEmail = async ({ to, subject, text, html }) => {
    let transporter = nodemailer.createTransport({
        host: "localhost:3055",
        port: 587,
        secure: false,
        service: 'gmail',
        auth: {
            user: 'huy343536@gmail.com',
            pass: 'swsa axux pgyc ljvy',
        },
    });

    const mailOptions = {
        from: 'admin.moneymanager@gmail.com',
        to: to,
        subject: subject,
    };

    if (html) {
        mailOptions.html = html;
    } else if (text) {
        mailOptions.text = text;
    } else {
        throw new BadRequestError('Phải cung cấp ít nhất text hoặc html');
    }

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Gửi email thành công");
        return info;
    } catch (error) {
        throw new BadRequestError(`Lỗi khi gửi email: ${error.message}`);
    }
};
const sendOtpEmail = async ({ to, subject }) => {
    await redisClient.connect();
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);
        await set(to, otp); // Giả sử set là hàm lưu vào Redis
        await expire(to, 300); // Hết hạn sau 300 giây
        const html = htmlEmailToken(otp, to); // Giả sử htmlEmailToken tạo HTML cho OTP
        await sendEmail({ to, subject, html });
    } catch (error) {
        throw new BadRequestError(`Lỗi khi gửi email OTP: ${error.message}`);
    } finally {
        await redisClient.disconnect();
    }
};
const verifyOtp = async (body) => {
    const { email, otp } = body;
    await redisClient.connect();
    const reply = await get(email)
    if (!reply) throw new BadRequestError('OTP Invalid');
    const strReply = reply.toString();
    const strOtp = otp.toString();
    if (strReply === strOtp) {
        await User.update({ verify: 1 }, { where: { email: email } });
        await del(email);
        await redisClient.disconnect();

        return ({
            success: true,
            message: 'OTP verification successful',
        });
    } else {
        await redisClient.disconnect();
        throw new BadRequestError('OTP did not match');
    }
};
const reSendMail = async (body) => {
    const { email } = body;
    if (!email) throw new BadRequestError('Email invalid');
    const checkVerify = await User.findOne({ where: { email: email } });
    console.log(checkVerify);
    if (checkVerify.verify == 1) throw new BadRequestError('Email already verify');
    const info = await sendOtpEmail({ to: email, subject: 'Verify Your Account', text: '' });
    return info;
}



module.exports = { sendOtpEmail, verifyOtp, reSendMail,sendEmail }

