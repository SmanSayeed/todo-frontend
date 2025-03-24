import { useState, useCallback } from 'react';
import { useTasksRedux } from './useTaskRedux';
import { toast } from 'react-hot-toast';
import { formatTaskForApi } from '../utils/taskUtils';

/**
 * Custom hook to manage inline task editing with optimistic updates
 * 
 * @param {Object} task - The task object to edit
 * @returns {Object} - Methods and state for inline task editing
 */
const useInlineTaskEdit = (task) => {
  const { updateTask } = useTasksRedux();
  const [updatingField, setUpdatingField] = useState(null);
  const [localTask, setLocalTask] = useState(task);
  
  // Update local task when prop task changes
  if (task.id !== localTask.id || 
      task.updated_at !== localTask.updated_at) {
    setLocalTask(task);
  }
  
  /**
   * Update a specific field in the task with optimistic UI updates
   * 
   * @param {string} fieldName - The name of the field to update
   * @param {any} fieldValue - The new value for the field
   */
  const handleFieldUpdate = useCallback(async (fieldName, fieldValue) => {
    // Don't update if value hasn't changed
    if (localTask[fieldName] === fieldValue) {
      return;
    }
    
    // Store original value for rollback if needed
    const originalValue = localTask[fieldName];
    
    // Set the field that's being updated (for loading state)
    setUpdatingField(fieldName);
    
    try {
      // Update local state immediately (optimistic update)
      setLocalTask(prev => ({
        ...prev,
        [fieldName]: fieldValue
      }));
      
      // Create update data with just the changed field
      const updateData = { [fieldName]: fieldValue };
      
      // Format data for API if needed (e.g., date formatting)
      const formattedData = formatTaskForApi(updateData);
      
      // Call API to update the task
      await updateTask(localTask.id, formattedData);
      
      // Show success message
      toast.success(`Task ${fieldName.replace('_', ' ')} updated`);
    } catch (error) {
      // On error, roll back to the original value
      setLocalTask(prev => ({
        ...prev,
        [fieldName]: originalValue
      }));
      
      // Handle error and show error message
      console.error(`Error updating task ${fieldName}:`, error);
      toast.error(error.message || `Failed to update task ${fieldName}`);
    } finally {
      // Clear updating state
      setUpdatingField(null);
    }
  }, [localTask, updateTask]);
  
  return {
    handleFieldUpdate,
    updatingField,
    isUpdatingField: (fieldName) => updatingField === fieldName,
    // Return the local task so components can use the optimistically updated version
    task: localTask
  };
};

export default useInlineTaskEdit;