import React from 'react';
import { useDrag } from 'react-dnd';
import { FiTrash2, FiMove } from 'react-icons/fi';

const TaskItem = ({ task, onDelete }) => {
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
      <div className="task-content">
        <span 
          className="color-indicator" 
          style={{ backgroundColor: task.color }}
        ></span>
        <span className="task-name">{task.name}</span>
      </div>
      
      <div className="task-actions">
        <span className="drag-handle" title="Drag to calendar">
          <FiMove />
        </span>
        <button 
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete task"
        >
          <FiTrash2 />
        </button>
      </div>
    </li>
  );
};

export default TaskItem;