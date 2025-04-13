import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { formatTimeToString } from '../utils/dateUtils';
import { toggleEventExpanded, deleteEvent } from '../redux/slices/eventsSlice';

const EventTile = ({ event, currentWeek, viewType }) => {
  const dispatch = useDispatch();
  
  // Update your useDrag implementation
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'EVENT',
    item: () => ({ 
      id: event._id, 
      type: 'EVENT',
      originalEvent: {
        ...event,
        startTime: new Date(event.startTime).toISOString(),
        endTime: new Date(event.endTime).toISOString(),
        date: new Date(event.date).toISOString()
      }
    }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  
  // Remove the default drag preview
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);
  
  // Format time for display
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  const timeDisplay = `${formatTimeToString(startTime)} - ${formatTimeToString(endTime)}`;
  
  // Calculate position and height for the event tile
  const calculatePosition = () => {
    // Get hours and minutes, ensuring timezone consistency
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    
    // Calculate duration in minutes
    const durationMinutes = (endTime - startTime) / (1000 * 60);
    
    // Improved calculation for top position
    const top = (startHour * 60 + startMinute) / 30 * 40; // 40px per 30-min slot
    
    // Ensure minimum height for visibility
    let height = (durationMinutes / 30) * 40;
    const MIN_EVENT_HEIGHT = 20; 
    height = Math.max(height, MIN_EVENT_HEIGHT);
    
    console.log('Event position calculation:', {
      event: event.title,
      startHour,
      startMinute,
      durationMinutes,
      top,
      height
    });
    
    return {
      top: `${top}px`,
      height: `${height}px`,
      width: '90%',
      left: '5%',
      opacity: isDragging ? 0.5 : 1,
    };
  };
  
  // Generate category-based styles
  const getCategoryStyle = () => {
    const categoryColors = {
      exercise: '#ff7675',
      eating: '#74b9ff',
      work: '#55efc4',
      relax: '#a29bfe',
      family: '#ffeaa7',
      social: '#fd79a8'
    };
    
    return {
      backgroundColor: event.color || categoryColors[event.category] || '#dfe6e9',
    };
  };
  
  // Handle click to expand/contract the event
  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(toggleEventExpanded(event._id));
  };
  
  // Handle event deletion
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent expansion when clicking delete
    
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch(deleteEvent(event._id));
    }
  };

  const { deletingEventId } = useSelector(state => state.events);
  const isDeleting = deletingEventId === event._id;
  
  return (
    <div 
      ref={drag}
      className={`event-tile ${event.isExpanded ? 'expanded' : ''} ${isDragging ? 'dragging' : ''} ${isDeleting ? 'deleting' : ''}`}
      data-category={event.category}
      style={{
        ...calculatePosition(),
        ...getCategoryStyle(),
        cursor: isDeleting ? 'default' : 'grab',
        opacity: isDeleting ? 0.5 : isDragging ? 0.5 : 1,
      }}
      onClick={handleClick}
    >
      <div className="event-content">
        <div className="event-title">
          {isDeleting ? 'Deleting...' : event.title}
        </div>
        <div className="event-time">{timeDisplay}</div>
        
        {event.isExpanded && !isDeleting && (
          <div className="event-details">
            <div className="event-category">
              Category: {event.category}
            </div>
          </div>
        )}
      </div>
      
      {!isDeleting && (
        <button 
          className="event-delete-btn"
          onClick={handleDelete}
          title="Delete event"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default EventTile;