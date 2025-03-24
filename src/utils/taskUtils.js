// src/utils/taskUtils.js
import { format, parseISO, isValid } from 'date-fns';
import { TASK_STATUS } from '../constants/taskConstants';

/**
 * Format a date string to the application's standard format
 * @param {string} dateString - ISO date string
 * @param {string} formatString - Optional custom format
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString, formatString = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    
    if (!isValid(date)) {
      return '';
    }
    
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Convert date from DD-MM-YYYY format (API expects) to YYYY-MM-DD format
 * @param {string} dateString - Date in DD-MM-YYYY format
 * @returns {string} - Date in YYYY-MM-DD format
 */
export const formatDateForApi = (dateString) => {
  if (!dateString) return '';
  
  // Handle already formatted dates
  if (dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
    return dateString;
  }
  
  // Convert from DD-MM-YYYY to YYYY-MM-DD
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
};

/**
 * Convert a task object from the form to the format expected by the API
 * @param {Object} taskData - Task data from form
 * @returns {Object} - Formatted task data for API
 */
export const formatTaskForApi = (taskData) => {
  const formattedTask = { ...taskData };
  
  // Format due_date if present
  if (formattedTask.due_date) {
    formattedTask.due_date = formatDateForApi(formattedTask.due_date);
  }
  
  return formattedTask;
};

/**
 * Get status color class based on task status
 * @param {string} status - Task status
 * @returns {string} - Tailwind CSS color class
 */
export const getStatusColorClass = (status) => {
  switch (status) {
    case TASK_STATUS.TODO:
      return 'bg-yellow-100 text-yellow-800';
    case TASK_STATUS.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800';
    case TASK_STATUS.DONE:
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Check if a task is overdue
 * @param {Object} task - Task object
 * @returns {boolean} - True if overdue
 */
export const isTaskOverdue = (task) => {
  if (!task.due_date || task.status === TASK_STATUS.DONE) return false;
  
  const dueDate = parseISO(task.due_date);
  const today = new Date();
  
  // Set both dates to the start of the day for accurate comparison
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  return dueDate < today;
};

/**
 * Group tasks by status
 * @param {Array} tasks - List of tasks
 * @returns {Object} - Tasks grouped by status
 */
export const groupTasksByStatus = (tasks) => {
  return tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {});
};

/**
 * Get the status color for kanban board columns
 * @param {string} status - Task status
 * @returns {Object} - Styles object with background and border colors
 */
export const getStatusColumnStyles = (status) => {
  switch (status) {
    case TASK_STATUS.TODO:
      return {
        background: 'bg-yellow-50',
        border: 'border-yellow-200'
      };
    case TASK_STATUS.IN_PROGRESS:
      return {
        background: 'bg-blue-50',
        border: 'border-blue-200'
      };
    case TASK_STATUS.DONE:
      return {
        background: 'bg-green-50',
        border: 'border-green-200'
      };
    default:
      return {
        background: 'bg-gray-50',
        border: 'border-gray-200'
      };
  }
};