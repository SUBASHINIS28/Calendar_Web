const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const events = await Event.find(query).sort({ startTime: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Public
exports.createEvent = async (req, res) => {
  try {
    console.log('Received event data:', req.body);
    
    // Parse the date strings with explicit handling
    const startTime = new Date(req.body.startTime);
    const endTime = new Date(req.body.endTime);
    
    // Set date to midnight in local timezone
    const date = new Date(req.body.date);
    date.setHours(0, 0, 0, 0);
    
    // Log time parts for debugging
    console.log('Time components:', {
      startHours: startTime.getHours(),
      startMinutes: startTime.getMinutes(),
      endHours: endTime.getHours(),
      endMinutes: endTime.getMinutes(),
      startTimeISOString: startTime.toISOString(),
      endTimeISOString: endTime.toISOString(),
      dateISOString: date.toISOString()
    });
    
    // Create the event with properly parsed dates
    const eventData = {
      ...req.body,
      startTime,
      endTime,
      date
    };
    
    const event = await Event.create(eventData);
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Public
exports.updateEvent = async (req, res) => {
  try {
    // Ensure dates are properly parsed
    const eventData = {
      ...req.body
    };
    
    // Only convert strings to dates (to avoid double conversion)
    if (typeof req.body.startTime === 'string') {
      eventData.startTime = new Date(req.body.startTime);
    }
    if (typeof req.body.endTime === 'string') {
      eventData.endTime = new Date(req.body.endTime);
    }
    if (typeof req.body.date === 'string') {
      eventData.date = new Date(req.body.date);
    }
    
    const event = await Event.findByIdAndUpdate(
      req.params.id, 
      eventData, 
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Public
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};