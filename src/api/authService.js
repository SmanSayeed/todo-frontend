// src/api/authService.js
import api from './axios';

export const authService = {
  register: async (userData) => {
    return await api.post('/register', userData);
  },
  
  login: async (credentials) => {
    return await api.post('/login', credentials);
  },
  
  logout: async () => {
    return await api.post('/logout');
  },
  
  getProfile: async () => {
    return await api.get('/user');
  }
};
