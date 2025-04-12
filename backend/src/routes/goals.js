const express = require('express');
const router = express.Router();
const { 
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalTasks
} = require('../controllers/goalsController');

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .get(getGoal)
  .put(updateGoal)
  .delete(deleteGoal);

router.route('/:id/tasks')
  .get(getGoalTasks);

module.exports = router;