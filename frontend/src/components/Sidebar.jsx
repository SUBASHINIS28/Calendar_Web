import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoals, addGoal, selectGoal, deleteGoal } from '../redux/slices/goalsSlice';
import { fetchTasks, addTask, filterTasksByGoal, deleteTask } from '../redux/slices/tasksSlice';
import TaskItem from './TaskItem';
import { FiPlus, FiTarget, FiCheckSquare, FiTrash2, FiStar } from 'react-icons/fi';
import '../styles/sidebar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { items: goals, selectedGoalId, loading: goalsLoading } = useSelector(state => state.goals);
  const { filteredItems: filteredTasks, loading: tasksLoading } = useSelector(state => state.tasks);
  
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalColor, setNewGoalColor] = useState('#00CED1');
  const [newTaskName, setNewTaskName] = useState('');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  
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
    setIsAddingGoal(false);
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
        <div className="sidebar-logo">
          <FiStar className="star-icon" />
          <h2>Goals & Tasks</h2>
        </div>
        <div className="sidebar-stats">
          <div className="stat-item">
            <div className="stat-value">{goals.length}</div>
            <div className="stat-label">Goals</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{filteredTasks.length}</div>
            <div className="stat-label">Tasks</div>
          </div>
        </div>
      </div>
      
      <div className="goals-section">
        <div className="section-header">
          <h3><FiTarget className="section-icon" /> Goals</h3>
          <button 
            className="add-button"
            onClick={() => setIsAddingGoal(!isAddingGoal)}
            title="Add new goal"
          >
            <FiPlus />
          </button>
        </div>
        
        {isAddingGoal && (
          <form onSubmit={handleAddGoal} className="add-goal-form">
            <input
              type="text"
              placeholder="New goal name"
              value={newGoalName}
              onChange={e => setNewGoalName(e.target.value)}
              required
              autoFocus
            />
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={newGoalColor}
                onChange={e => setNewGoalColor(e.target.value)}
                className="color-picker"
              />
            </div>
            <button type="submit" className="submit-button">Add</button>
          </form>
        )}
        
        {goalsLoading ? (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <span>Loading goals...</span>
          </div>
        ) : (
          <ul className="goals-list">
            {goals.map(goal => (
              <li 
                key={goal._id}
                className={`goal-item ${selectedGoalId === goal._id ? 'selected' : ''}`}
                onClick={() => handleGoalSelect(goal._id)}
              >
                <div className="goal-content">
                  <span 
                    className="color-indicator" 
                    style={{ backgroundColor: goal.color }}
                  ></span>
                  <span className="goal-name">{goal.name}</span>
                </div>
                <button 
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGoal(goal._id);
                  }}
                  title="Delete goal"
                >
                  <FiTrash2 />
                </button>
              </li>
            ))}
            
            {goals.length === 0 && !goalsLoading && (
              <div className="empty-state">
                <p>No goals yet. Create your first goal!</p>
              </div>
            )}
          </ul>
        )}
      </div>
      
      <div className="tasks-section">
        <div className="section-header">
          <h3><FiCheckSquare className="section-icon" /> Tasks</h3>
        </div>
        
        {!selectedGoalId ? (
          <div className="no-goal-selected">
            <p>Select a goal to see tasks</p>
            <FiTarget className="large-icon" />
          </div>
        ) : tasksLoading ? (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <span>Loading tasks...</span>
          </div>
        ) : (
          <>
            <ul className="tasks-list">
              {filteredTasks.map(task => (
                <TaskItem 
                  key={task._id} 
                  task={task} 
                  onDelete={() => handleDeleteTask(task._id)}
                />
              ))}
              
              {filteredTasks.length === 0 && (
                <div className="empty-state">
                  <p>No tasks for this goal yet</p>
                </div>
              )}
            </ul>
            
            <form onSubmit={handleAddTask} className="add-task-form">
              <input
                type="text"
                placeholder="New task name"
                value={newTaskName}
                onChange={e => setNewTaskName(e.target.value)}
                required
              />
              <button type="submit" className="submit-button">
                <FiPlus />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;