const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'ecommercegroup',
    api_key: '772858273968731',
    api_secret: 'NdLAr1tYR9QDwlRZZB-LDJZXtvk'
});

module.exports = cloudinary;