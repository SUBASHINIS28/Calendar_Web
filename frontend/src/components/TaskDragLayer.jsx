import React from 'react';
import { useDragLayer } from 'react-dnd';

const TaskDragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer(monitor => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset) {
    return null;
  }

  // Calculate position for the drag preview
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

  return (
    <div style={getItemStyles()} className="task-drag-preview">
      <div 
        className="task-preview-content"
        style={{ 
          backgroundColor: item.task?.color || '#ccc',
          padding: '8px 12px',
          borderRadius: '4px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          color: '#fff'
        }}
      >
        {item.task?.name || 'Task'}
      </div>
    </div>
  );
};

export default TaskDragLayer;