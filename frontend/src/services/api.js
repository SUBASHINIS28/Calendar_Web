import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Events API
export const eventsApi = {
  getAll: async (startDate, endDate) => {
    const response = await axios.get(`${API_URL}/events`, {
      params: { startDate, endDate }
    });
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/events/${id}`);
    return response.data;
  },
  create: async (eventData) => {
    const response = await axios.post(`${API_URL}/events`, eventData);
    return response.data;
  },
  update: async (id, eventData) => {
    const response = await axios.put(`${API_URL}/events/${id}`, eventData);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/events/${id}`);
    return response.data;
  }
};

// Goals API
export const goalsApi = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/goals`);
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/goals/${id}`);
    return response.data;
  },
  create: async (goalData) => {
    const response = await axios.post(`${API_URL}/goals`, goalData);
    return response.data;
  },
  update: async (id, goalData) => {
    const response = await axios.put(`${API_URL}/goals/${id}`, goalData);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/goals/${id}`);
    return response.data;
  },
  getTasks: async (id) => {
    const response = await axios.get(`${API_URL}/goals/${id}/tasks`);
    return response.data;
  }
};

// Tasks API
export const tasksApi = {
  getAll: async (goalId = null) => {
    const params = goalId ? { goalId } : {};
    const response = await axios.get(`${API_URL}/tasks`, { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${API_URL}/tasks/${id}`);
    return response.data;
  },
  create: async (taskData) => {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    return response.data;
  },
  update: async (id, taskData) => {
    const response = await axios.put(`${API_URL}/tasks/${id}`, taskData);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/tasks/${id}`);
    return response.data;
  }
};