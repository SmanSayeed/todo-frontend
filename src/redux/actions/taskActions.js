import { 
    taskStart, 
    tasksLoaded, 
    taskLoaded, 
    taskAdded, 
    taskUpdated, 
    taskDeleted, 
    taskFailed 
  } from '../slices/taskSlice';
  import { taskService } from '../../api/taskService';
  
  /**
   * Get all tasks with optional filtering
   * @param {Object} filters - Filter parameters
   * @returns {Function} - Thunk action
   */
  export const getTasks = (filters = {}) => async (dispatch, getState) => {
    dispatch(taskStart());
    
    try {
      // Get current filters from state and merge with provided filters
      const currentFilters = getState().tasks.filters;
      const mergedFilters = { ...currentFilters, ...filters };
      
      const response = await taskService.getTasks(mergedFilters);
      
      dispatch(tasksLoaded(response.data));
      return response.data;
    } catch (error) {
      dispatch(taskFailed({
        message: error.message || 'Failed to load tasks',
        errors: error.errors || {}
      }));
      
      throw error;
    }
  };
  
  /**
   * Get a single task by ID
   * @param {number} id - Task ID
   * @returns {Function} - Thunk action
   */
  export const getTask = (id) => async (dispatch) => {
    dispatch(taskStart());
    
    try {
      const response = await taskService.getTask(id);
      
      dispatch(taskLoaded(response.data));
      return response.data;
    } catch (error) {
      dispatch(taskFailed({
        message: error.message || `Failed to load task #${id}`,
        errors: error.errors || {}
      }));
      
      throw error;
    }
  };
  
  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Function} - Thunk action
   */
  export const createTask = (taskData) => async (dispatch) => {
    dispatch(taskStart());
    
    try {
      const response = await taskService.createTask(taskData);
      
      dispatch(taskAdded(response.data));
      return response.data;
    } catch (error) {
      dispatch(taskFailed({
        message: error.message || 'Failed to create task',
        errors: error.errors || {}
      }));
      
      throw error;
    }
  };
  
  /**
   * Update an existing task
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Function} - Thunk action
   */
  export const updateTask = (id, taskData) => async (dispatch) => {
    dispatch(taskStart());
    
    try {
      const response = await taskService.updateTask(id, taskData);
      
      dispatch(taskUpdated(response.data));
      return response.data;
    } catch (error) {
      dispatch(taskFailed({
        message: error.message || `Failed to update task #${id}`,
        errors: error.errors || {}
      }));
      
      throw error;
    }
  };
  
  /**
   * Delete a task
   * @param {number} id - Task ID
   * @returns {Function} - Thunk action
   */
  export const deleteTask = (id) => async (dispatch) => {
    dispatch(taskStart());
    
    try {
      await taskService.deleteTask(id);
      
      dispatch(taskDeleted(id));
      return id;
    } catch (error) {
      dispatch(taskFailed({
        message: error.message || `Failed to delete task #${id}`,
        errors: error.errors || {}
      }));
      
      throw error;
    }
  };