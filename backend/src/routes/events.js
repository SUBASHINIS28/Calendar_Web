const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { createEvent, updateEvent, deleteEvent, getEvent } = require('../controllers/eventsController');

// Get all events with optimization
router.get('/', async (req, res) => {
  try {
    console.log('Getting events');
    // Set a reasonable limit on results and only fetch necessary fields
    const events = await Event.find({})
      .select('title category date startTime endTime isExpanded color')
      .limit(100);
    
    console.log(`Found ${events.length} events`);
    return res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// Add missing routes
router.post('/', createEvent);
router.get('/:id', getEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;