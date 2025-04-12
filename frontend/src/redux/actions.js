import { selectGoal } from './slices/goalsSlice';
import { filterTasksByGoal, fetchTasks } from './slices/tasksSlice';

// Combined action to select a goal and filter tasks accordingly
export const selectGoalAndFilterTasks = (goalId) => (dispatch) => {
  dispatch(selectGoal(goalId));
  dispatch(filterTasksByGoal(goalId));
};

// Action to create an event from a task
export const createEventFromTask = (task, startTime, endTime) => ({
  type: 'CREATE_EVENT_FROM_TASK',
  payload: {
    task,
    startTime,
    endTime
  }
});