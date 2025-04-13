import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoals, addGoal, selectGoal, deleteGoal } from '../redux/slices/goalsSlice';
import { fetchTasks, addTask, filterTasksByGoal, deleteTask } from '../redux/slices/tasksSlice';
import TaskItem from './TaskItem';
import '../styles/sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { items: goals, selectedGoalId, loading: goalsLoading } = useSelector(state => state.goals);
  const { filteredItems: filteredTasks, loading: tasksLoading } = useSelector(state => state.tasks);
  
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalColor, setNewGoalColor] = useState('#00CED1');
  const [newTaskName, setNewTaskName] = useState('');
  
  // Fetch goals and tasks when component mounts
  useEffect(() => {
    dispatch(fetchGoals());
    dispatch(fetchTasks());
  }, [dispatch]);
  
  // Handle selecting a goal
  const handleGoalSelect = (goalId) => {
    dispatch(selectGoal(goalId));
    dispatch(filterTasksByGoal(goalId));
  };
  
  // Handle creating a new goal
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalName.trim()) return;
    
    dispatch(addGoal({
      name: newGoalName,
      color: newGoalColor
    }));
    
    setNewGoalName('');
  };
  
  // Handle creating a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskName.trim() || !selectedGoalId) return;
    
    const selectedGoal = goals.find(goal => goal._id === selectedGoalId);
    
    dispatch(addTask({
      name: newTaskName,
      goalId: selectedGoalId,
      color: selectedGoal.color
    }));
    
    setNewTaskName('');
  };

  // Handle deleting a goal
  const handleDeleteGoal = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal? All associated tasks will also be deleted.')) {
      dispatch(deleteGoal(goalId));
    }
  };

  // Handle deleting a task
  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId));
    }
  };
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Goals & Tasks</h2>
      </div>
      
      <div className="goals-section">
        <h3>Goals</h3>
        
        {goalsLoading ? (
          <div className="loading-indicator">Loading goals...</div>
        ) : (
          <ul className="goals-list">
            {goals.map(goal => (
              <li 
                key={goal._id}
                className={`goal-item ${selectedGoalId === goal._id ? 'selected' : ''}`}
                onClick={() => handleGoalSelect(goal._id)}
              >
                <span 
                  className="color-indicator" 
                  style={{ backgroundColor: goal.color }}
                ></span>
                <span className="goal-name">{goal.name}</span>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent goal selection when clicking delete
                    handleDeleteGoal(goal._id);
                  }}
                  title="Delete goal"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        
        <form onSubmit={handleAddGoal} className="add-goal-form">
          <input
            type="text"
            placeholder="New goal name"
            value={newGoalName}
            onChange={e => setNewGoalName(e.target.value)}
            required
          />
          <input
            type="color"
            value={newGoalColor}
            onChange={e => setNewGoalColor(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>
      
      <div className="tasks-section">
        <h3>Tasks</h3>
        
        {!selectedGoalId ? (
          <div className="no-goal-selected">Select a goal to see tasks</div>
        ) : tasksLoading ? (
          <div className="loading-indicator">Loading tasks...</div>
        ) : (
          <ul className="tasks-list">
            {filteredTasks.map(task => (
              <TaskItem 
                key={task._id} 
                task={task} 
                onDelete={() => handleDeleteTask(task._id)}
              />
            ))}
            
            {filteredTasks.length === 0 && (
              <div className="no-tasks">No tasks for this goal yet</div>
            )}
          </ul>
        )}
        
        {selectedGoalId && (
          <form onSubmit={handleAddTask} className="add-task-form">
            <input
              type="text"
              placeholder="New task name"
              value={newTaskName}
              onChange={e => setNewTaskName(e.target.value)}
              required
            />
            <button type="submit">Add</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Sidebar;