import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addEvent, updateEvent } from '../redux/slices/eventsSlice';
import { formatDateToString, formatTimeToString } from '../utils/dateUtils';
import '../styles/modal.css';

const EventModal = ({ isOpen, onClose, initialData, editMode = false }) => {
  const dispatch = useDispatch();
  
  // State for form fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'work', // Default category
    date: '',
    startTime: '',
    endTime: '',
    color: ''
  });
  
  // List of categories
  const categories = [
    { value: 'exercise', label: 'Exercise', color: '#ff7675' },
    { value: 'eating', label: 'Eating', color: '#74b9ff' },
    { value: 'work', label: 'Work', color: '#55efc4' },
    { value: 'relax', label: 'Relax', color: '#a29bfe' },
    { value: 'family', label: 'Family', color: '#ffeaa7' },
    { value: 'social', label: 'Social', color: '#fd79a8' }
  ];
  
  // Update the useEffect for initialData
  useEffect(() => {
    if (initialData) {
      // Handle both Date objects and ISO strings
      const startDate = initialData.startTime instanceof Date ? 
        initialData.startTime : new Date(initialData.startTime);
      
      const endDate = initialData.endTime instanceof Date ? 
        initialData.endTime : new Date(initialData.endTime);
      
      // Get date from startTime, not from separate date field
      const eventDate = initialData.date instanceof Date ?
        initialData.date : new Date(initialData.date || initialData.startTime);
      
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'work',
        date: formatDateToString(eventDate),
        startTime: formatTimeToString(startDate),
        endTime: formatTimeToString(endDate),
        color: initialData.color || ''
      });
    }
  }, [initialData]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update color when category changes
    if (name === 'category') {
      const selectedCategory = categories.find(cat => cat.value === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        color: selectedCategory ? selectedCategory.color : prev.color
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Update the handleSubmit function
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create proper Date objects with timezone awareness
    const dateObj = new Date(formData.date);
    
    // Parse time inputs into hours and minutes
    const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
    const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
    
    // Create new date objects for start and end times
    const startTime = new Date(dateObj);
    startTime.setHours(startHours, startMinutes, 0, 0);
    
    const endTime = new Date(dateObj);
    endTime.setHours(endHours, endMinutes, 0, 0);
    
    // Validate times
    if (endTime <= startTime) {
      alert('End time must be after start time');
      return;
    }
    
    // Create a midnight version of the date for date-only comparisons
    const midnightDate = new Date(dateObj);
    midnightDate.setHours(0, 0, 0, 0);
    
    // Prepare event data
    const eventData = {
      title: formData.title,
      category: formData.category,
      date: midnightDate.toISOString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      color: formData.color,
      isExpanded: false
    };
    
    // Dispatch action
    if (editMode && initialData?._id) {
      dispatch(updateEvent({ id: initialData._id, eventData }));
    } else {
      dispatch(addEvent(eventData));
    }
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editMode ? 'Edit Event' : 'Create New Event'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map(category => (
                <option 
                  key={category.value} 
                  value={category.value}
                  style={{ backgroundColor: category.color }}
                >
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group time-inputs">
            <div>
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {editMode ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;