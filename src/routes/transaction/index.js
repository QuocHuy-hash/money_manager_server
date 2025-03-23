/**
 * @swagger
 * tags:
 *   name: Transaction
 *   description: Transaction management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Transaction ID
 *         userId:
 *           type: string
 *           description: User ID
 *         amount:
 *           type: number
 *           description: Transaction amount
 *         type:
 *           type: string
 *           description: Transaction type (income/expense)
 *         category:
 *           type: string
 *           description: Transaction category
 *         description:
 *           type: string
 *           description: Transaction description
 *         date:
 *           type: string
 *           format: date-time
 *           description: Transaction date
 *       example:
 *         id: 123abc
 *         userId: 60d0fe4f5311236168a109ca
 *         amount: 1000
 *         type: expense
 *         category: Food
 *         description: Lunch
 *         date: 2023-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/transaction/add:
 *   post:
 *     summary: Add a new transaction
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Transaction added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/transaction/update:
 *   post:
 *     summary: Update a transaction
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/transaction/get-detail:
 *   get:
 *     summary: Get transaction details
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */

/**
 * @swagger
 * /api/transaction/get-list:
 *   get:
 *     summary: Get list of transactions
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
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
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/transaction/get-categorys:
 *   get:
 *     summary: Get transaction categories
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/transaction/get-list-summary:
 *   get:
 *     summary: Get transaction list summary
 *     tags: [Transaction]
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
 *         description: Transaction summary
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/transaction/get-by-category:
 *   get:
 *     summary: Get transactions by category
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Category name
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
 *         description: List of transactions by category
 *       401:
 *         description: Unauthorized
 */

const express = require('express');
const router = express.Router();

const { asyncHandle } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtil');
const TransactionController = require('../../controllers/transactions.controller');

router.use(authentication) //require login
router.post('/transaction/add', asyncHandle(TransactionController.addTransaction));
router.post('/transaction/update', asyncHandle(TransactionController.updateTransaction));
router.get('/transaction/get-detail', asyncHandle(TransactionController.getDetail));
router.get('/transaction/get-list', asyncHandle(TransactionController.getList));
router.get('/transaction/get-categorys', asyncHandle(TransactionController.getCategorys));
router.get('/transaction/get-list-summary', asyncHandle(TransactionController.getListSummary));
router.get('/transaction/get-by-category', asyncHandle(TransactionController.getTransactionsByCategory)); 


module.exports = router; 