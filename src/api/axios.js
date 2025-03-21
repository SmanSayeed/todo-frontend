// src/api/axios.js
import axios from 'axios';
import config from '../config/apiConfig';
import { getAuthToken } from '../utils/auth';

// Create axios instance with default configurations
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Return data directly from successful responses
    return response.data;
  },
  (error) => {
    // Handle errors consistently
    const errorResponse = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors || {}
    };
    
    // Handle session expiry
    if (errorResponse.status === 401) {
      // Clear auth tokens and redirect to login
      localStorage.removeItem(config.AUTH_TOKEN_KEY);
      window.location.href = '/login';
    }
    
    return Promise.reject(errorResponse);
  }
);

export default api;