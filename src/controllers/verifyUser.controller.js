'use strict'

const { CreatedResponse, SuccessResponse } = require("../core/success.response");
const { verifyOtp, reSendMail } = require("../services/sendMailer/send.mail.service");
class EmailController {
    verifyOtp = async (req, res, next) => {
        new CreatedResponse({
            message: 'verifyOtp Success',
            metadata: await verifyOtp(req.body,),
        }).send(res)

    }
    reSendMail = async (req, res, next) => {
        new CreatedResponse({
            message: 'reSend Mail Success',
            metadata: await reSendMail(req.body,),
        }).send(res)

    }
}

module.exports = new EmailController();