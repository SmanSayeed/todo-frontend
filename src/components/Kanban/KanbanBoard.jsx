import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { getStatusColumnStyles } from '../../utils/taskUtils';
import { TASK_STATUS } from '../../constants/taskConstants';
import TaskCard from '../tasks/TaskCard';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { useTasksRedux } from '../../hooks/useTaskRedux';
import { toast } from 'react-hot-toast';

// Memoized TaskCard wrapper component
const DraggableTaskCard = memo(({ task, onDragStart, onDragEnd, isDragging }) => {
  const handleDragStart = useCallback((e) => {
    onDragStart(e, task.id, task.status);
  }, [onDragStart, task.id, task.status]);

  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className="transition-all"
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(0.95)' : 'scale(1)',
        cursor: 'grab'
      }}
    >
      <TaskCard task={task} />
    </div>
  );
});

const KanbanBoard = ({ tasks: propTasks, onStatusChange }) => {
  // Local state for optimistic updates
  const [localTasks, setLocalTasks] = useState(propTasks);
  const { updateTask } = useTasksRedux();
  
  // Update local tasks when prop tasks change
  useEffect(() => {
    setLocalTasks(propTasks);
  }, [propTasks]);
  
  // Memoize the grouped tasks to prevent unnecessary recalculations
  const columns = useMemo(() => {
    const grouped = {
      [TASK_STATUS.TODO]: [],
      [TASK_STATUS.IN_PROGRESS]: [],
      [TASK_STATUS.DONE]: []
    };
    
    localTasks.forEach(task => {
      const column = task.status;
      if (grouped[column]) {
        grouped[column].push(task);
      }
    });
    
    return grouped;
  }, [localTasks]);
  
  // Optimistic update handler for task status changes
  const handleTaskDrop = useCallback(async (taskId, newStatus) => {
    // Find the task
    const taskIndex = localTasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const task = localTasks[taskIndex];
    if (task.status === newStatus) return; // No change needed
    
    try {
      // Optimistic update - update UI immediately
      const updatedTasks = [...localTasks];
      updatedTasks[taskIndex] = { ...task, status: newStatus };
      setLocalTasks(updatedTasks);
      
      // API call
      await updateTask(taskId, { status: newStatus });
      
      // Success notification
      toast.success(`Task moved to ${newStatus}`);
      
      // Notify parent component if needed
      if (onStatusChange) {
        onStatusChange(taskId, newStatus);
      }
    } catch (error) {
      // Revert optimistic update on error
      toast.error('Failed to update task status');
      setLocalTasks(propTasks); // Revert to original state
      console.error('Error updating task status:', error);
    }
  }, [localTasks, updateTask, onStatusChange, propTasks]);
  
  const {
    draggedItem,
    draggedOverColumn,
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDragEnd
  } = useDragAndDrop({
    onDrop: handleTaskDrop
  });
  
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {Object.entries(columns).map(([status, columnTasks]) => {
        const styles = getStatusColumnStyles(status);
        return (
          <div 
            key={status}
            className={`flex-1 ${styles.background} ${styles.border} border rounded-lg overflow-hidden flex flex-col h-full min-h-[500px]`}
            onDragEnter={(e) => handleDragEnter(e, status)}
            onDragOver={handleDragOver}
            onDrop={(e) => {
              e.preventDefault();
              // This helps ensure the drop event is recognized
              // The actual logic is in handleDragEnd
            }}
          >
            {/* Column Header */}
            <div className={`${styles.headerBackground || ''} ${styles.headerColor || ''} px-4 py-3 font-medium flex items-center`}>
              <h3 className="text-lg flex-1">{status}</h3>
              <span className="rounded-full bg-white px-2 py-1 text-sm">{columnTasks.length}</span>
            </div>
            
            {/* Task List - with scroll */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="space-y-3">
                {columnTasks.map(task => (
                  <DraggableTaskCard 
                    key={task.id} 
                    task={task}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedItem?.id === task.id}
                  />
                ))}
              </div>
              
              {/* Drop indicator - only render when needed */}
              {draggedOverColumn === status && draggedItem && draggedItem.currentStatus !== status && (
                <div className="mt-3 border-2 border-blue-400 border-dashed rounded-lg p-4 bg-blue-50 text-center text-blue-500">
                  Drop here to move to {status}
                </div>
              )}
              
              {/* Empty column indicator */}
              {columnTasks.length === 0 && !(draggedOverColumn === status && draggedItem) && (
                <div className="mt-3 border-2 border-gray-200 border-dashed rounded-lg p-4 text-center text-gray-400">
                  No tasks in {status}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(KanbanBoard);