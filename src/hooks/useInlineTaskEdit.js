import { useState } from 'react';
import { useTasksRedux } from './useTaskRedux';
import { toast } from 'react-hot-toast';
import { formatTaskForApi } from '../utils/taskUtils';

/**
 * Custom hook to manage inline task editing with confirmation
 * 
 * @param {Object} task - The task object to edit
 * @returns {Object} - Methods and state for inline task editing
 */
const useInlineTaskEdit = (task) => {
  const { updateTask, isLoading } = useTasksRedux();
  const [updatingField, setUpdatingField] = useState(null);
  
  /**
   * Update a specific field in the task
   * 
   * @param {string} fieldName - The name of the field to update
   * @param {any} fieldValue - The new value for the field
   */
  const handleFieldUpdate = async (fieldName, fieldValue) => {
    // Don't update if value hasn't changed
    if (task[fieldName] === fieldValue) {
      return;
    }
    
    // Set the field that's being updated (for loading state)
    setUpdatingField(fieldName);
    
    try {
      // Create update data with just the changed field
      const updateData = { [fieldName]: fieldValue };
      
      // Format data for API if needed (e.g., date formatting)
      const formattedData = formatTaskForApi(updateData);
      
      // Call API to update the task
      await updateTask(task.id, formattedData);
      
      // Show success message
      toast.success(`Task ${fieldName.replace('_', ' ')} updated`);
    } catch (error) {
      // Handle error and show error message
      console.error(`Error updating task ${fieldName}:`, error);
      toast.error(error.message || `Failed to update task ${fieldName}`);
    } finally {
      // Clear updating state
      setUpdatingField(null);
    }
  };
  
  return {
    handleFieldUpdate,
    isUpdating: isLoading,
    updatingField,
    isUpdatingField: (fieldName) => updatingField === fieldName
  };
};

export default useInlineTaskEdit;