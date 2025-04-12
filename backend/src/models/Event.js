const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['exercise', 'eating', 'work', 'relax', 'family', 'social']
  },
  startTime: {
    type: Date,
    required: [true, 'Please add a start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Please add an end time']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  color: {
    type: String
  },
  isExpanded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Validation to ensure endTime is after startTime
EventSchema.pre('save', function(next) {
  if (this.endTime <= this.startTime) {
    const error = new Error('End time must be after start time');
    return next(error);
  }
  next();
});

// Add index for efficient querying
EventSchema.index({ date: 1, startTime: 1 });

module.exports = mongoose.model('Event', EventSchema);