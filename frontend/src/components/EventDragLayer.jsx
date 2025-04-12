import React from 'react';
import { useDragLayer } from 'react-dnd';
import { formatTimeToString } from '../utils/dateUtils';

const EventDragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging() && monitor.getItemType() === 'EVENT',
  }));

  if (!isDragging || !currentOffset || !item.originalEvent) {
    return null;
  }

  const event = item.originalEvent;
  
  // Format time for display
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  const timeDisplay = `${formatTimeToString(startTime)} - ${formatTimeToString(endTime)}`;

  // Calculate position for drag preview
  const getItemStyles = () => {
    const { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
      transform,
      WebkitTransform: transform,
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 100,
      left: 0,
      top: 0,
      width: '200px',
      opacity: 0.8,
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

  return (
    <div style={getItemStyles()} className="event-drag-preview">
      <div 
        className="event-preview-content"
        style={{ 
          ...getCategoryStyle(),
          padding: '8px 12px',
          borderRadius: '4px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          color: '#fff'
        }}
      >
        <div className="event-title">{event.title}</div>
        <div className="event-time">{timeDisplay}</div>
      </div>
    </div>
  );
};

export default EventDragLayer;