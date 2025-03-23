/**
 * @swagger
 * tags:
 *   name: Report
 *   description: Financial reports and analytics
 */

/**
 * @swagger
 * /api/report/expense-summary:
 *   get:
 *     summary: Generate expense summary report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for report (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for report (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Expense summary report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalExpense:
 *                   type: number
 *                 totalIncome:
 *                   type: number
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       percentage:
 *                         type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/report/summary:
 *   get:
 *     summary: Generate summary report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for report (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for report (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Summary report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalExpense:
 *                   type: number
 *                 totalIncome:
 *                   type: number
 *                 balance:
 *                   type: number
 *                 savingRate:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/report/expense-daily:
 *   get:
 *     summary: Generate daily expense report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for report (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for report (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Daily expense report
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                   expense:
 *                     type: number
 *                   income:
 *                     type: number
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/report/goal:
 *   get:
 *     summary: Generate financial goals report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial goals report
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   goal:
 *                     $ref: '#/components/schemas/Goal'
 *                   progress:
 *                     type: number
 *                   estimatedCompletion:
 *                     type: string
 *                     format: date
 *       401:
 *         description: Unauthorized
 */

const express = require('express');
const router = express.Router();

const { asyncHandle } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtil');
const ReportController = require('../../controllers/report.controller');

router.use(authentication) //require login

router.get('/report/expense-summary', asyncHandle(ReportController.GenerateReport));
router.get('/report/summary', asyncHandle(ReportController.GenerateSummaryReport));
router.get('/report/expense-daily', asyncHandle(ReportController.DailyExpenseReport));
router.get('/report/goal', asyncHandle(ReportController.DailyGoalReport));



module.exports = router; 