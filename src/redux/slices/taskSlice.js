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
  isLoading: false,
  error: null,
  filters: {
    status: '',
    due_date_from: '',
    due_date_to: '',
    search: '',
    sort_by: 'created_at',
    sort_direction: 'desc',
    per_page: 10,
    page: 1
  }
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Start loading
    taskStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    // Tasks loaded
    tasksLoaded: (state, action) => {
      state.isLoading = false;
      state.tasks = action.payload.data;
      state.meta = action.payload.meta;
      state.error = null;
    },
    
    // Single task loaded
    taskLoaded: (state, action) => {
      state.isLoading = false;
      state.task = action.payload;
      state.error = null;
    },
    
    // Task added
    taskAdded: (state, action) => {
      state.isLoading = false;
      state.tasks = [action.payload, ...state.tasks];
      state.meta.total += 1;
      state.meta.count += 1;
      state.error = null;
    },
    
    // Task updated
    taskUpdated: (state, action) => {
      state.isLoading = false;
      state.tasks = state.tasks.map(task => 
        task.id === action.payload.id ? action.payload : task
      );
      if (state.task && state.task.id === action.payload.id) {
        state.task = action.payload;
      }
      state.error = null;
    },
    
    // Task deleted
    taskDeleted: (state, action) => {
      state.isLoading = false;
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      if (state.task && state.task.id === action.payload) {
        state.task = null;
      }
      state.meta.total -= 1;
      state.meta.count -= 1;
      state.error = null;
    },
    
    // Task operation failed
    taskFailed: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Clear errors
    clearTaskErrors: (state) => {
      state.error = null;
    },
    
    // Update filters
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
        // Reset to page 1 when filters change (except when explicitly changing page)
        page: action.payload.hasOwnProperty('page') ? action.payload.page : 1
      };
    },
    
    // Reset filters
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

// Export actions
export const { 
  taskStart, 
  tasksLoaded, 
  taskLoaded, 
  taskAdded, 
  taskUpdated, 
  taskDeleted, 
  taskFailed, 
  clearTaskErrors,
  updateFilters,
  resetFilters
} = taskSlice.actions;

// Selectors
export const selectTasks = (state) => state.tasks.tasks;
export const selectTask = (state) => state.tasks.task;
export const selectTaskMeta = (state) => state.tasks.meta;
export const selectTaskFilters = (state) => state.tasks.filters;
export const selectTasksLoading = (state) => state.tasks.isLoading;
export const selectTaskError = (state) => state.tasks.error;

export default taskSlice.reducer;