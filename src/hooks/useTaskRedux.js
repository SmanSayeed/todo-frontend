import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectTasks, 
  selectTask, 
  selectTaskMeta, 
  selectTaskFilters,
  selectTasksLoading, 
  selectTaskError,
  updateFilters,
  resetFilters
} from '../redux/slices/taskSlice';
import { 
  getTasks as getTasksAction, 
  getTask as getTaskAction, 
  createTask as createTaskAction, 
  updateTask as updateTaskAction, 
  deleteTask as deleteTaskAction
} from '../redux/actions/taskActions';

export const useTasksRedux = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const tasks = useSelector(selectTasks);
  const task = useSelector(selectTask);
  const meta = useSelector(selectTaskMeta);
  const filters = useSelector(selectTaskFilters);
  const isLoading = useSelector(selectTasksLoading);
  const error = useSelector(selectTaskError);
  
  // Memoized action dispatchers
  const getTasks = useCallback((filters) => dispatch(getTasksAction(filters)), [dispatch]);
  const getTask = useCallback((id) => dispatch(getTaskAction(id)), [dispatch]);
  const createTask = useCallback((taskData) => dispatch(createTaskAction(taskData)), [dispatch]);
  const updateTask = useCallback((id, taskData) => dispatch(updateTaskAction(id, taskData)), [dispatch]);
  const deleteTask = useCallback((id) => dispatch(deleteTaskAction(id)), [dispatch]);
  
  // Filter actions
  const setFilters = useCallback((newFilters) => dispatch(updateFilters(newFilters)), [dispatch]);
  const clearFilters = useCallback(() => dispatch(resetFilters()), [dispatch]);
  
  return {
    // State
    tasks,
    task,
    meta,
    filters,
    isLoading,
    error,
    
    // Task CRUD actions
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    
    // Filter actions
    setFilters,
    clearFilters
  };
};