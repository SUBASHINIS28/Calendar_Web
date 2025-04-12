import axios from 'axios';
import config from '../config/config';

// Create an axios instance with the configured API URL
const api = axios.create({
  baseURL: config.API_URL
});

// Events API
export const eventsApi = {
  getAll: async (startDate, endDate) => {
    try {
      console.log('Fetching events from:', config.API_URL + '/events');
      console.log('Params:', { startDate, endDate });
      
      const response = await api.get('/events', {
        params: { startDate, endDate }
      });
      
      console.log('Events API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
      throw error;
    }
  },
  getById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  create: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  update: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};

// Goals API
export const goalsApi = {
  getAll: async () => {
    const response = await api.get('/goals');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },
  create: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },
  update: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },
  getTasks: async (id) => {
    const response = await api.get(`/goals/${id}/tasks`);
    return response.data;
  }
};

// Tasks API
export const tasksApi = {
  getAll: async (goalId = null) => {
    const params = goalId ? { goalId } : {};
    const response = await api.get('/tasks', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  create: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  update: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

export default api;