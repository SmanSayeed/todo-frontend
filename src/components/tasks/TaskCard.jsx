import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button';
import { formatDate } from '../../utils/taskUtils';
import { getStatusColorClass, isTaskOverdue } from '../../utils/taskUtils';
import { useTasksRedux } from '../../hooks/useTaskRedux';

const TaskCard = ({ task, onEdit }) => {
  const { deleteTask, isLoading } = useTasksRedux();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    try {
      await deleteTask(task.id);
      toast.success('Task deleted successfully');
      setConfirmDelete(false);
    } catch (error) {
      toast.error(error.message || 'Failed to delete task');
      setConfirmDelete(false);
    }
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };
  
  const overdue = isTaskOverdue(task);
  
  return (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800 truncate pr-2">{task.name}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(task.status)}`}>
          {task.status}
        </span>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{task.description}</p>
      )}
      
      <div className="mt-4 flex flex-col space-y-2">
        {task.due_date && (
          <div className="text-sm">
            <span className="text-gray-500">Due: </span>
            <span className={overdue ? 'text-red-600 font-medium' : 'text-gray-700'}>
              {formatDate(task.due_date)}
              {overdue && ' (Overdue)'}
            </span>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          Created: {formatDate(task.created_at)}
        </div>
      </div>
      
      <div className="mt-4 flex justify-end space-x-2">
        {confirmDelete ? (
          <>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCancelDelete}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              variant="danger" 
              onClick={handleDelete} 
              loading={isLoading}
            >
              Confirm
            </Button>
          </>
        ) : (
          <>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onEdit(task)}
            >
              Edit
            </Button>
            <Button 
              size="sm" 
              variant="danger" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;