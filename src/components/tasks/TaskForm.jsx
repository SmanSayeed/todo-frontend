import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { TASK_STATUS_OPTIONS } from '../../constants/taskConstants';
import { formatTaskForApi } from '../../utils/taskUtils';
import { useTasksRedux } from '../../hooks/useTaskRedux';
import { useDispatch } from 'react-redux';
import { addTaskLocally, updateTaskLocally } from '../../redux/slices/taskSlice';

const TaskForm = ({ task = null, onSuccess = () => {}, onCancel = () => {} }) => {
  const dispatch = useDispatch();
  const { createTask, updateTask, isLoading } = useTasksRedux();
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'To Do',
    due_date: ''
  });
  
  // If task is provided, we're editing an existing task
  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name || '',
        description: task.description || '',
        status: task.status || 'To Do',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
      });
    }
  }, [task]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required';
    } else if (formData.name.length > 255) {
      newErrors.name = 'Task name must be less than 255 characters';
    }
    
    if (formData.due_date) {
      const dueDate = new Date(formData.due_date);
      if (isNaN(dueDate.getTime())) {
        newErrors.due_date = 'Invalid date format';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      // Format data for API (e.g., date format)
      const taskData = formatTaskForApi(formData);
      
      if (task) {
        // Optimistic UI update for task editing
        const optimisticTask = {
          ...task,
          ...taskData,
          // Ensure fields are properly formatted
          due_date: taskData.due_date ? taskData.due_date : task.due_date,
          updated_at: new Date().toISOString()
        };
        
        // Optimistically update the task in the UI
        dispatch(updateTaskLocally(optimisticTask));
        
        // Show success message immediately
        toast.success('Task updated successfully');
        
        // Call the success callback
        onSuccess();
        
        // Then make the API call
        try {
          await updateTask(task.id, taskData);
        } catch (error) {
          // If API call fails, show an error, but don't roll back UI (it's already closed)
          toast.error('Changes may not have been saved. Please check your connection.');
          console.error('Error updating task:', error);
        }
      } else {
        // Create new task with optimistic UI
        
        // Create a temporary ID for optimistic UI
        const tempId = `temp-${Date.now()}`;
        
        // Create optimistic task object
        const optimisticTask = {
          id: tempId,
          ...taskData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // Ensure due_date is formatted correctly
          due_date: taskData.due_date ? new Date(taskData.due_date).toISOString() : null
        };
        
        // Add to UI immediately
        dispatch(addTaskLocally(optimisticTask));
        
        // Show success message
        toast.success('Task created successfully');
        
        // Call success callback (close modal, etc)
        onSuccess();
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          status: 'To Do',
          due_date: ''
        });
        
        // Then make the API call
        try {
          await createTask(taskData);
          // No need to handle success - UI already updated optimistically
        } catch (error) {
          // If API call fails, show an error but don't roll back UI (form already closed)
          toast.error('Task may not have been saved. Please check your connection and try again.');
          console.error('Error creating task:', error);
        }
      }
    } catch (error) {
      // Handle validation errors from validation (not API)
      if (error.errors) {
        setErrors(error.errors);
      } else {
        toast.error(error.message || 'An error occurred');
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Task Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="Enter task name"
        />
        
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {TASK_STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task description"
        ></textarea>
      </div>
      
      <Input
        label="Due Date"
        name="due_date"
        type="date"
        value={formData.due_date}
        onChange={handleChange}
        error={errors.due_date}
        placeholder="Choose a due date"
      />
      
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;