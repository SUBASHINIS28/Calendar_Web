import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { goalsApi } from '../../services/api';

// Async thunks
export const fetchGoals = createAsyncThunk(
  'goals/fetchGoals',
  async (_, { rejectWithValue }) => {
    try {
      return await goalsApi.getAll();
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addGoal = createAsyncThunk(
  'goals/addGoal',
  async (goalData, { rejectWithValue }) => {
    try {
      return await goalsApi.create(goalData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateGoal = createAsyncThunk(
  'goals/updateGoal',
  async ({ id, goalData }, { rejectWithValue }) => {
    try {
      return await goalsApi.update(id, goalData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (id, { rejectWithValue }) => {
    try {
      await goalsApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const goalsSlice = createSlice({
  name: 'goals',
  initialState: {
    items: [],
    selectedGoalId: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectGoal: (state, action) => {
      state.selectedGoalId = action.payload;
    },
    clearSelectedGoal: (state) => {
      state.selectedGoalId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch goals
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch goals';
      })
      
      // Add goal
      .addCase(addGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add goal';
      })
      
      // Update goal
      .addCase(updateGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update goal';
      })
      
      // Delete goal
      .addCase(deleteGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        if (state.selectedGoalId === action.payload) {
          state.selectedGoalId = null;
        }
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete goal';
      });
  }
});

// Export actions and reducer
export const { selectGoal, clearSelectedGoal } = goalsSlice.actions;
export default goalsSlice.reducer;