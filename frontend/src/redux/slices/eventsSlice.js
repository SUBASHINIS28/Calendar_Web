import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventsApi } from '../../services/api';

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      return await eventsApi.getAll(startDate, endDate);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addEvent = createAsyncThunk(
  'events/addEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      return await eventsApi.create(eventData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      return await eventsApi.update(id, eventData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await eventsApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    selectedEvent: null,
    loading: false,
    error: null,
    deletingEventId: null,
    deletedEventBackup: null
  },
  reducers: {
    selectEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    toggleEventExpanded: (state, action) => {
      const event = state.items.find(item => item._id === action.payload);
      if (event) {
        event.isExpanded = !event.isExpanded;
      }
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch events';
      })
      
      // Add event
      .addCase(addEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add event';
      })
      
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update event';
      })
      
      // Delete event
      .addCase(deleteEvent.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        
        // Store the ID of the event being deleted
        state.deletingEventId = action.meta.arg;
        
        // Save a backup of the event for potential rollback
        const eventToDelete = state.items.find(item => item._id === action.meta.arg);
        if (eventToDelete) {
          state.deletedEventBackup = eventToDelete;
        }
        
        // Optimistically remove the event from the state
        state.items = state.items.filter(item => item._id !== action.meta.arg);
      })
      .addCase(deleteEvent.fulfilled, (state) => {
        state.loading = false;
        state.deletingEventId = null;
        state.deletedEventBackup = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete event';
        
        // Restore the event if deletion failed and we have a backup
        if (state.deletedEventBackup) {
          state.items.push(state.deletedEventBackup);
        }
        
        state.deletingEventId = null;
        state.deletedEventBackup = null;
      });
  }
});

// Export actions and reducer
export const { selectEvent, toggleEventExpanded, clearSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer;