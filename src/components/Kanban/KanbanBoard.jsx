import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { getStatusColumnStyles } from '../../utils/taskUtils';
import { TASK_STATUS } from '../../constants/taskConstants';
import TaskCard from '../tasks/TaskCard';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';

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

const KanbanBoard = ({ tasks, onStatusChange }) => {
  // Memoize the grouped tasks to prevent unnecessary recalculations
  const columns = useMemo(() => {
    const grouped = {
      [TASK_STATUS.TODO]: [],
      [TASK_STATUS.IN_PROGRESS]: [],
      [TASK_STATUS.DONE]: []
    };
    
    tasks.forEach(task => {
      const column = task.status;
      if (grouped[column]) {
        grouped[column].push(task);
      }
    });
    
    return grouped;
  }, [tasks]);
  
  // Memoize the onDrop callback
  const handleTaskDrop = useCallback((taskId, newStatus) => {
    if (onStatusChange) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== newStatus) {
        onStatusChange(taskId, newStatus);
      }
    }
  }, [tasks, onStatusChange]);
  
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

export default KanbanBoard;