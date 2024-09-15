// 'use strict'

// const { findByID } = require("../services/apiKey.service");
// const HEADER = {
//     API_KEY: 'x-api-key',
//     AUTHORIZATION: 'authorization'
// };

// const apiKey = async (req, res, next) => {
//     try {
//         const key = req.headers[HEADER.API_KEY]?.toString();
//         if (!key) {
//             return res.status(403).json({
//                 message: 'Forbidden Error'
//             });
//         };
//         // check Object Key
//         const objKey = await findByID(key);
//         if (!objKey) {
//             return res.status(403).json({
//                 message: 'Forbidden Error'
//             });
//         }
//         req.objKey = objKey;
//         return next;
//     } catch (error) {
//         console.log("error :: ", error.message);
//     }
// };

// const permissions = (permission) => {
//     return (req, res, next) => {
//         if (!req.objKey.permissions) {
//             return res.status(403).json({
//                 message: 'permissions Denied'
//             });
//         };

//         const validPermission = req.objKey.permissions.includes(permission);
//         if (!validPermission) {
//             return res.status(403).json({
//                 message: 'permissions Denied'
//             });
//         };
//     }
// };

const asyncHandle = _ => {
    return (req, res, next) => {
        _(req, res, next).catch(next)
    }
}

module.exports = {
    // apiKey,
    // permissions,
    asyncHandle,
}