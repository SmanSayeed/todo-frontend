// src/redux/actions/taskActions.js
import { 
  setTasks, 
  setTask, 
  setMeta, 
  setLoading, 
  setError,
  replaceTemporaryTask,
  removeTaskLocally
} from '../slices/taskSlice';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import config from '../../config/apiConfig';

const API_URL = config.API_BASE_URL || '';

// Helper function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
  
  // Return error object for consistent handling
  return {
    message: errorMessage,
    errors: error.response?.data?.errors || null
  };
};

// Get all tasks with filters
export const getTasks = (filters = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    
    // Get current filters from state and merge with provided filters
    const currentFilters = getState().tasks.filters;
    const mergedFilters = { ...currentFilters, ...filters };
    
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(mergedFilters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    const response = await axios.get(`${API_URL}/tasks?${queryParams.toString()}`);
    
    if (response.data.success) {
      dispatch(setTasks(response.data.data.data));
      dispatch(setMeta(response.data.data.meta));
    } else {
      throw new Error(response.data.message || 'Failed to fetch tasks');
    }
  } catch (error) {
    const errorData = handleApiError(error);
    dispatch(setError(errorData.message));
    toast.error(errorData.message);
  } finally {
    dispatch(setLoading(false));
  }
};

// Get a single task by ID
export const getTask = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await axios.get(`${API_URL}/tasks/${id}`);
    
    if (response.data.success) {
      dispatch(setTask(response.data.data));
    } else {
      throw new Error(response.data.message || 'Failed to fetch task');
    }
  } catch (error) {
    const errorData = handleApiError(error);
    dispatch(setError(errorData.message));
    toast.error(errorData.message);
  } finally {
    dispatch(setLoading(false));
  }
};

// Create a new task
export const createTask = (taskData) => async (dispatch, getState) => {
  try {
    // Note: We're not setting loading state here because we're using optimistic UI
    // Optimistic updates are now handled in the TaskForm component
    
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    
    if (response.data.success) {
      // Find if there's a temporary task with similar data
      const tasks = getState().tasks.tasks;
      const tempTasks = tasks.filter(task => 
        task.id.toString().startsWith('temp-') && 
        task.name === taskData.name
      );
      
      if (tempTasks.length > 0) {
        // Replace the temporary task with the real one
        dispatch(replaceTemporaryTask({
          tempId: tempTasks[0].id,
          realTask: response.data.data
        }));
      } else {
        // If no temporary task found (unlikely, but possible), refresh task list
        dispatch(getTasks());
      }
      
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to create task');
    }
  } catch (error) {
    const errorData = handleApiError(error);
    dispatch(setError(errorData.message));
    throw errorData; // Propagate error to component for handling
  }
};

// Update an existing task
export const updateTask = (id, taskData) => async (dispatch) => {
  try {
    // Note: We're not setting loading state here because we're using optimistic UI
    // Optimistic updates are handled in the component
    
    const response = await axios.put(`${API_URL}/tasks/${id}`, taskData);
    
    if (response.data.success) {
      // The UI is already updated optimistically, but we still need the actual server data
      // to ensure consistency (e.g., updated_at timestamp)
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to update task');
    }
  } catch (error) {
    const errorData = handleApiError(error);
    dispatch(setError(errorData.message));
    throw errorData; // Propagate error to component for handling
  }
};

// Delete a task
export const deleteTask = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Optimistic UI update - remove task from list immediately
    dispatch(removeTaskLocally(id));
    
    const response = await axios.delete(`${API_URL}/tasks/${id}`);
    
    if (!response.data.success) {
      // If API call fails, we need to restore the task
      // However, we don't have the task data anymore, so we need to refresh
      dispatch(getTasks());
      throw new Error(response.data.message || 'Failed to delete task');
    }
    
    return true;
  } catch (error) {
    const errorData = handleApiError(error);
    dispatch(setError(errorData.message));
    throw errorData; // Propagate error to component for handling
  } finally {
    dispatch(setLoading(false));
  }
};