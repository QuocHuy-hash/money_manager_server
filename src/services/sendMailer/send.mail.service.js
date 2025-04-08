const nodemailer = require('nodemailer');
require('dotenv').config();
const { BadRequestError } = require('../../core/error.response');
// const { cli } = require('winston/lib/winston/config');
const { User } = require('../../models');
const redisClient = require('../../config/redis.config');
const { get, set, expire, del } = require('../../utils/redis.util');
const { htmlEmailToken } = require('../../utils/template.html');

// const { log } = require('winston');
const sendMail = async (body) => {
    await redisClient.connect();
    try {
        const { to, subject, text } = body;
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
        const otp = Math.floor(100000 + Math.random() * 900000);
        // Save the OTP
        await set(to, otp);
        await expire(to, 300);
        const mailOptions = {
            from: 'admin.moneymanager@gmail.com',
            to: to,
            subject: subject,
            // text: `Input OTP [ ${otp} ]For Account ${text} Into Confirm Your Accoount  `, htmlEmailToken
            html: htmlEmailToken(otp, to),
        };
        let info = await transporter.sendMail(mailOptions);
        console.log("Send mail successfuly");
        await redisClient.disconnect();
        return info;
    } catch (error) {
        await redisClient.disconnect();
        throw new BadRequestError("An error occurred while sending the email::" + error);
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
    const info = await sendMail({ to: email, subject: 'Verify Your Account', text: '' });
    return info;
}



module.exports = { sendMail, verifyOtp, reSendMail }

