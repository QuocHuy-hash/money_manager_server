/**
 * @swagger
 * tags:
 *   name: CassoBank
 *   description: Bank account linking and transaction management via Casso API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BankAccount:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Bank account ID
 *         userId:
 *           type: string
 *           description: User ID
 *         bankName:
 *           type: string
 *           description: Bank name
 *         accountNumber:
 *           type: string
 *           description: Bank account number
 *         accountName:
 *           type: string
 *           description: Bank account name
 *       example:
 *         id: 123abc
 *         userId: 60d0fe4f5311236168a109ca
 *         bankName: VietcomBank
 *         accountNumber: '1234567890'
 *         accountName: John Doe
 */

/**
 * @swagger
 * /api/link-bank:
 *   post:
 *     summary: Link a bank account using Casso API
 *     tags: [CassoBank]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bankName
 *               - accountNumber
 *               - accountName
 *             properties:
 *               bankName:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               accountName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bank account linked successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/get-transactions:
 *   get:
 *     summary: Get bank transactions from linked account
 *     tags: [CassoBank]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *     responses:
 *       200:
 *         description: List of bank transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   type:
 *                     type: string
 *                     enum: [credit, debit]
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/get-info-bank:
 *   get:
 *     summary: Get linked bank account information
 *     tags: [CassoBank]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bank account information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BankAccount'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No linked bank account found
 */

/**
 * @swagger
 * /api/get-transactions-details:
 *   post:
 *     summary: Get detailed information for a specific transaction
 *     tags: [CassoBank]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *             properties:
 *               transactionId:
 *                 type: string
 *                 description: Transaction ID to get details for
 *     responses:
 *       200:
 *         description: Transaction details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */

/**
 * @swagger
 * /api/get-bank-connected:
 *   get:
 *     summary: Get list of connected bank accounts
 *     tags: [CassoBank]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of connected bank accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BankAccount'
 *       401:
 *         description: Unauthorized
 */

const express = require('express');
const router = express.Router()
const { asyncHandle } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtil');
const CassoBankController = require('../../controllers/casso/bank.controller');
// const EmailController = require('../../controllers/verify_email/verify.controller');
router.use(authentication) //require login
router.post('/link-bank', asyncHandle(CassoBankController.addBankAccount));
router.get('/get-transactions', asyncHandle(CassoBankController.getTransactions)); 
router.get('/get-info-bank', asyncHandle(CassoBankController.getInfo)); 
router.post('/get-transactions-details', asyncHandle(CassoBankController.getTransactionDetail)); 
router.get('/get-bank-connected', asyncHandle(CassoBankController.getInfoConnected)); 


module.exports = router;