const multer = require('multer')    // Import multer

const uploadMemory = multer({ storage: multer.memoryStorage() });
const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'src/uploads-img/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '.' + file.originalname);
        }
    }),
    fileFilter: imageFilter
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
module.exports = { uploadMemory, uploadDisk };    // Export the multer instance