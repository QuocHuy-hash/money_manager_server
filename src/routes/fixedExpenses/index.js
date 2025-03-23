/**
 * @swagger
 * tags:
 *   name: FixedExpenses
 *   description: Fixed expenses management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FixedExpense:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Fixed expense ID
 *         userId:
 *           type: string
 *           description: User ID
 *         amount:
 *           type: number
 *           description: Fixed expense amount
 *         name:
 *           type: string
 *           description: Fixed expense name
 *         description:
 *           type: string
 *           description: Fixed expense description
 *         dueDate:
 *           type: integer
 *           description: Due date (day of month)
 *         category:
 *           type: string
 *           description: Fixed expense category
 *       example:
 *         id: 123abc
 *         userId: 60d0fe4f5311236168a109ca
 *         amount: 1000
 *         name: Rent
 *         description: Monthly apartment rent
 *         dueDate: 15
 *         category: Housing
 */

/**
 * @swagger
 * /api/fixed-expense/add:
 *   post:
 *     summary: Add a new fixed expense
 *     tags: [FixedExpenses]
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
 *               - name
 *               - dueDate
 *             properties:
 *               amount:
 *                 type: number
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: integer
 *                 description: Day of the month
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fixed expense added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/fixed-expense/update:
 *   post:
 *     summary: Update a fixed expense
 *     tags: [FixedExpenses]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fixed expense updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/fixed-expense/get-detail:
 *   get:
 *     summary: Get fixed expense details
 *     tags: [FixedExpenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Fixed expense ID
 *     responses:
 *       200:
 *         description: Fixed expense details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FixedExpense'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Fixed expense not found
 */

/**
 * @swagger
 * /api/fixed-expense/get-list:
 *   get:
 *     summary: Get list of fixed expenses
 *     tags: [FixedExpenses]
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
 *     responses:
 *       200:
 *         description: List of fixed expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FixedExpense'
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
 * /api/fixed-expense/delete:
 *   post:
 *     summary: Delete a fixed expense
 *     tags: [FixedExpenses]
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
 *                 description: Fixed expense ID
 *     responses:
 *       200:
 *         description: Fixed expense deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Fixed expense not found
 */

const express = require('express');
const router = express.Router();

const { asyncHandle } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtil');
const fixedExpensesController = require('../../controllers/fixedExpenses.controller');


router.use(authentication) //require login
router.post('/fixed-expense/add', asyncHandle(fixedExpensesController.addFixedExpenses));
router.post('/fixed-expense/update', asyncHandle(fixedExpensesController.updateFixedExpenses));
router.get('/fixed-expense/get-detail', asyncHandle(fixedExpensesController.getDetail));
router.get('/fixed-expense/get-list', asyncHandle(fixedExpensesController.getList));
router.post('/fixed-expense/delete', asyncHandle(fixedExpensesController.deleteFixedExpenses));

module.exports = router; 