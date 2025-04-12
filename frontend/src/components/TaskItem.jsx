import React from 'react';
import { useDrag } from 'react-dnd';

const TaskItem = ({ task }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { 
      type: 'TASK',
      task 
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <li 
      ref={drag}
      className={`task-item ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span 
        className="color-indicator" 
        style={{ backgroundColor: task.color }}
      ></span>
      <span className="task-name">{task.name}</span>
    </li>
  );
};

export default TaskItem;