const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  color: {
    type: String,
    required: [true, 'Please add a color']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', GoalSchema);