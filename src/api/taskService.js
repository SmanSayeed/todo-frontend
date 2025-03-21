
// src/api/taskService.js
import api from './axios';

export const taskService = {
  getTasks: async (params = {}) => {
    return await api.get('/tasks', { params });
  },
  
  getTask: async (id) => {
    return await api.get(`/tasks/${id}`);
  },
  
  createTask: async (taskData) => {
    return await api.post('/tasks', taskData);
  },
  
  updateTask: async (id, taskData) => {
    return await api.put(`/tasks/${id}`, taskData);
  },
  
  deleteTask: async (id) => {
    return await api.delete(`/tasks/${id}`);
  }
};