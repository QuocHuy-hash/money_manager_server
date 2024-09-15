
/**
 * @swagger
 * tags:
 *   name: Shop
 *   description: APIs related to shop operations
 */
const express = require('express');
const router = express.Router();
const AccessController = require('../../controllers/user.controller');
const { asyncHandle } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtil');
// const EmailController = require('../../controllers/verify_email/verify.controller');

/**
* @swagger
* /v1/api/shop/signup:
*   post:
*     summary: Register a new shop
*     tags: [Shop]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               firstName:
*                 type: string
*                 default: Quoc
*               lastName:
*                 type: string
*                 default: Huy
*               password:
*                 type: string
*                 default: 123456
*               email:
*                 type: string
*                 format: email
*                 default: huy123@gmail.com
*               roles:
*                 type: array
*                 items:
*                   type: string
*                 default: ["ADMIN", "SHOP"]
*               status:
*                 type: string
*                 enum: [inactive, active]
*                 default: inactive
*               verify:
*                 type: boolean
*                 default: false
*     responses:
*       '200':
*         description: OK
*       '400':
*         description: Bad request
*/
router.post('/user/signup', asyncHandle(AccessController.signUp));

/**
 * @swagger
 * /v1/api/shop/login:
 *   post:
 *     summary: Login
 *     tags: [Shop]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: user_name
 *                 default: huy123@gmail.com
 *               password:
 *                 type: string
 *                 default: 123456
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad request
 */
router.post('/user/login', asyncHandle(AccessController.login));


module.exports = router;