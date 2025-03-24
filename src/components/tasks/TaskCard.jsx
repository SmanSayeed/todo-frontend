import React, { useState, memo } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button';
import { formatDate } from '../../utils/taskUtils';
import { getStatusColorClass, isTaskOverdue } from '../../utils/taskUtils';
import useInlineTaskEdit from '../../hooks/useInlineTaskEdit';
import EditableText from '../common/Editables/EditableText';
import EditableDate from '../common/Editables/EditableDate';
import { useTasksRedux } from '../../hooks/useTaskRedux';

const TaskCard = memo(({ task: propTask }) => {
  const { deleteTask, isLoading } = useTasksRedux();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Use the optimistic hook to get the local task and update handlers
  const { handleFieldUpdate, isUpdatingField, task } = useInlineTaskEdit(propTask);
  
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
  
  // Render loading indicator for a specific field
  const renderFieldLoading = (fieldName) => {
    if (isUpdatingField(fieldName)) {
      return (
        <span className="ml-2 inline-block w-4 h-4">
          <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-2">
          <EditableText
            value={task.name}
            onSave={(value) => handleFieldUpdate('name', value)}
            placeholder="Task title"
            displayClassName="text-lg font-semibold text-gray-800"
            inputClassName="font-semibold text-lg"
            maxLength={255}
          />
          {renderFieldLoading('name')}
        </div>
        
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(task.status)}`}>
          {task.status}
        </span>
      </div>
      
      <div className="mb-4">
        <EditableText
          value={task.description}
          onSave={(value) => handleFieldUpdate('description', value)}
          placeholder="Add a description..."
          displayClassName="text-gray-600 text-sm"
          inputClassName="text-sm"
          multiline={true}
        />
        {renderFieldLoading('description')}
      </div>
      
      <div className="mt-4 flex flex-col space-y-2">
        <div className="text-sm flex items-center">
          <span className="text-gray-500 mr-1">Due: </span>
          <span className={overdue ? 'text-red-600 font-medium' : 'text-gray-700'}>
            <EditableDate
              value={task.due_date}
              onSave={(value) => handleFieldUpdate('due_date', value)}
              displayClassName={overdue ? 'text-red-600 font-medium' : 'text-gray-700'}
            />
            {overdue && ' (Overdue)'}
          </span>
          {renderFieldLoading('due_date')}
        </div>
        
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
          <Button 
            size="sm" 
            variant="danger" 
            onClick={handleDelete}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
});

TaskCard.displayName = 'TaskCard';

export default TaskCard;