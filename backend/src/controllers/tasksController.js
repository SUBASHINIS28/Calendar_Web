const Task = require('../models/Task');
const Goal = require('../models/Goals');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
exports.getTasks = async (req, res) => {
  try {
    const { goalId } = req.query;
    let query = {};
    
    if (goalId) {
      query.goalId = goalId;
    }
    
    const tasks = await Task.find(query).populate('goalId', 'name color');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('goalId', 'name color');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
exports.createTask = async (req, res) => {
  try {
    // Check if goal exists
    const goal = await Goal.findById(req.body.goalId);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    // If color is not provided, use goal's color
    if (!req.body.color) {
      req.body.color = goal.color;
    }
    
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
exports.updateTask = async (req, res) => {
  try {
    // If goalId is changed, check if new goal exists
    if (req.body.goalId) {
      const goal = await Goal.findById(req.body.goalId);
      if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
      }
      
      // Update color to match new goal if not explicitly provided
      if (!req.body.color) {
        req.body.color = goal.color;
      }
    }
    
    const task = await Task.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('goalId', 'name color');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};