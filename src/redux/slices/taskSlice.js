// src/redux/slices/taskSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  task: null,
  meta: {
    total: 0,
    count: 0,
    per_page: 10,
    current_page: 1,
    total_pages: 1
  },
  filters: {
    status: '',
    search: '',
    due_date_from: '',
    due_date_to: '',
    sort_by: 'created_at',
    sort_direction: 'desc',
    page: 1,
    per_page: 10
  },
  isLoading: false,
  error: null
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Existing reducers...
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setTask: (state, action) => {
      state.task = action.payload;
    },
    setMeta: (state, action) => {
      state.meta = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // New reducers for optimistic UI updates
    addTaskLocally: (state, action) => {
      // Add the new task to the beginning of the array
      state.tasks = [action.payload, ...state.tasks];
      
      // Update meta data
      if (state.meta) {
        state.meta.total = state.meta.total + 1;
        state.meta.count = Math.min(state.meta.count + 1, state.meta.per_page);
      }
    },
    
    updateTaskLocally: (state, action) => {
      const updatedTask = action.payload;
      
      // Update the task in the task list
      const taskIndex = state.tasks.findIndex(task => task.id === updatedTask.id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = updatedTask;
      }
      
      // If the individual task is currently viewed, update it too
      if (state.task && state.task.id === updatedTask.id) {
        state.task = updatedTask;
      }
    },
    
    // Helper for temporary tasks to be replaced with real ones
    replaceTemporaryTask: (state, action) => {
      const { tempId, realTask } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === tempId);
      
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = realTask;
      }
    },
    
    // Remove a task from the list (for delete operations)
    removeTaskLocally: (state, action) => {
      const taskId = action.payload;
      state.tasks = state.tasks.filter(task => task.id !== taskId);
      
      // Update meta data
      if (state.meta) {
        state.meta.total = Math.max(0, state.meta.total - 1);
        state.meta.count = Math.max(0, state.meta.count - 1);
      }
      
      // If the removed task is the current task, clear it
      if (state.task && state.task.id === taskId) {
        state.task = null;
      }
    }
  }
});

// Export actions
export const { 
  setTasks, 
  setTask, 
  setMeta, 
  updateFilters, 
  resetFilters, 
  setLoading, 
  setError,
  addTaskLocally,
  updateTaskLocally,
  replaceTemporaryTask,
  removeTaskLocally
} = taskSlice.actions;

// Export selectors
export const selectTasks = state => state.tasks.tasks;
export const selectTask = state => state.tasks.task;
export const selectTaskMeta = state => state.tasks.meta;
export const selectTaskFilters = state => state.tasks.filters;
export const selectTasksLoading = state => state.tasks.isLoading;
export const selectTaskError = state => state.tasks.error;

export default taskSlice.reducer;