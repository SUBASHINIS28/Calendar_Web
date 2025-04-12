const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true
  },
  color: {
    type: String,
    required: [true, 'Please add a color']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);