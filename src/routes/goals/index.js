
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

module.exports = router; 