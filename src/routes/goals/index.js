/**
 * @swagger
 * tags:
 *   name: Goals
 *   description: Financial goals management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Goal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Goal ID
 *         userId:
 *           type: string
 *           description: User ID
 *         name:
 *           type: string
 *           description: Goal name
 *         targetAmount:
 *           type: number
 *           description: Target amount to save
 *         currentAmount:
 *           type: number
 *           description: Current saved amount
 *         targetDate:
 *           type: string
 *           format: date-time
 *           description: Goal target date
 *         priority:
 *           type: string
 *           description: Goal priority level
 *         description:
 *           type: string
 *           description: Goal description
 *       example:
 *         id: 123abc
 *         userId: 60d0fe4f5311236168a109ca
 *         name: Buy a car
 *         targetAmount: 50000
 *         currentAmount: 10000
 *         targetDate: 2024-12-31T00:00:00.000Z
 *         priority: high
 *         description: Saving for a new car
 */

/**
 * @swagger
 * /api/goal/add:
 *   post:
 *     summary: Add a new financial goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - targetAmount
 *               - targetDate
 *             properties:
 *               name:
 *                 type: string
 *               targetAmount:
 *                 type: number
 *               currentAmount:
 *                 type: number
 *                 default: 0
 *               targetDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Goal added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/goal/update:
 *   post:
 *     summary: Update a financial goal
 *     tags: [Goals]
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
 *               name:
 *                 type: string
 *               targetAmount:
 *                 type: number
 *               currentAmount:
 *                 type: number
 *               targetDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Goal updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/goal/get-by-user:
 *   get:
 *     summary: Get all goals for the authenticated user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's goals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Goal'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/goal/get-by-id:
 *   get:
 *     summary: Get goal by ID
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Goal ID
 *     responses:
 *       200:
 *         description: Goal details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Goal not found
 */

/**
 * @swagger
 * /api/goal/get-monthly-saving:
 *   get:
 *     summary: Calculate monthly savings needed for goals
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly savings calculation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   goal:
 *                     $ref: '#/components/schemas/Goal'
 *                   monthlySaving:
 *                     type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/goal/delete:
 *   post:
 *     summary: Delete a goal
 *     tags: [Goals]
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
 *                 description: Goal ID
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Goal not found
 */

const express = require('express');
const router = express.Router();

const { asyncHandle } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtil');
const GoalsController = require('../../controllers/goal.controller');


router.use(authentication) //require login
router.post('/goal/add', asyncHandle(GoalsController.addGoal));
router.post('/goal/update', asyncHandle(GoalsController.updateGoal));
router.get('/goal/get-by-user', asyncHandle(GoalsController.getDetail));
router.get('/goal/get-by-id', asyncHandle(GoalsController.getFinancialGoalById));
router.get('/goal/get-monthly-saving', asyncHandle(GoalsController.getMonthlySavings));
router.post('/goal/delete', asyncHandle(GoalsController.delGoal)); 

module.exports = router; 