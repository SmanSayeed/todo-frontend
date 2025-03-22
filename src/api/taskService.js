import api from './axios';

export const taskService = {
  /**
   * Get all tasks with optional filtering
   * @param {Object} params - Filter parameters
   * @returns {Promise} - API response
   */
  getTasks: async (params = {}) => {
    return await api.get('/tasks', { params });
  },
  
  /**
   * Get a single task by ID
   * @param {number} id - Task ID
   * @returns {Promise} - API response
   */
  getTask: async (id) => {
    return await api.get(`/tasks/${id}`);
  },
  
  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Promise} - API response
   */
  createTask: async (taskData) => {
    return await api.post('/tasks', taskData);
  },
  
  /**
   * Update an existing task
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise} - API response
   */
  updateTask: async (id, taskData) => {
    return await api.put(`/tasks/${id}`, taskData);
  },
  
  /**
   * Delete a task
   * @param {number} id - Task ID
   * @returns {Promise} - API response
   */
  deleteTask: async (id) => {
    return await api.delete(`/tasks/${id}`);
  }
};