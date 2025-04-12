const Goal = require('../models/Goals');
const Task = require('../models/Task');

// @desc    Get all goals
// @route   GET /api/goals
// @access  Public
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find();
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Public
exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Public
exports.createGoal = async (req, res) => {
  try {
    const goal = await Goal.create(req.body);
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Public
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    // Also update color in associated tasks if color is changed
    if (req.body.color) {
      await Task.updateMany(
        { goalId: req.params.id },
        { color: req.body.color }
      );
    }
    
    res.status(200).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Public
exports.deleteGoal = async (req, res) => {
  try {
    // First delete all associated tasks
    await Task.deleteMany({ goalId: req.params.id });
    
    // Then delete the goal
    const goal = await Goal.findByIdAndDelete(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    res.status(200).json({ message: 'Goal and associated tasks removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tasks for a goal
// @route   GET /api/goals/:id/tasks
// @access  Public
exports.getGoalTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ goalId: req.params.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};