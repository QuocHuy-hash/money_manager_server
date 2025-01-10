'use strict'

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { uploadFromLocal, showAvatar } = require("../services/uploadImage.service");

const HEADER = {
    CLIENT_ID: 'x-client-id',
};
class UploadController {
    userId = null;
    setUserId(req) {
        this.userId = req.headers[HEADER.CLIENT_ID];
    }
    uploadFromLocal = async (req, res, next) => {
        const file = req.file;
        this.setUserId(req);
        if (!file) {
            throw new BadRequestError('Please upload a file');
        }
        new SuccessResponse({
            message: 'upload image From Local Success',
            metadata: await uploadFromLocal(file.path, this.userId),
        }).send(res)

    }
    showAvatar = async (req, res, next) => {
        this.setUserId(req);
        new SuccessResponse({
            message: 'Get Avatar Success',
            metadata: await showAvatar(this.userId),
        }).send(res)

    }
    // deleteImage = async (req, res, next) => {
    //     this.setUserId(req);
    //     new SuccessResponse({
    //         message: 'deleteImage image From cloud Success',
    //         metadata: await deleteImage(req.body, this.userId),
    //     }).send(res)

    // }

} 

module.exports = new UploadController();