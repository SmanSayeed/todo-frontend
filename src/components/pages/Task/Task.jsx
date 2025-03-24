//src/components/pages/Task/Task.jsx
import React, { useState, useEffect, useCallback, memo } from 'react';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import TaskCard from '../../tasks/TaskCard';
import TaskFilter from '../../tasks/TaskFilter';
import Pagination from '../../ui/Pagination';
import CreateTaskModal from '../../tasks/CreateTaskModal';
import KanbanBoard from '../../Kanban/KanbanBoard';
import { useTasksRedux } from '../../../hooks/useTaskRedux';

// Memoized component for the empty state
const EmptyState = memo(({ hasFilters, onCreateTask }) => (
  <div className="bg-white rounded-lg shadow p-8 text-center">
    <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks found</h3>
    <p className="text-gray-500 mb-4">
      {hasFilters 
        ? 'Try adjusting your filters or create a new task'
        : 'Get started by creating your first task'}
    </p>
    <Button
      variant="primary"
      onClick={onCreateTask}
    >
      Create New Task
    </Button>
  </div>
));

// Memoized grid view component
const TaskGrid = memo(({ tasks }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {tasks.map(task => (
      <TaskCard 
        key={task.id} 
        task={task}
      />
    ))}
  </div>
));

const Task = () => {
  const { 
    tasks, 
    meta, 
    filters, 
    isLoading, 
    getTasks, 
    setFilters, 
    clearFilters
  } = useTasksRedux();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewMode, setViewMode] = useState('kanban'); // 'grid' or 'kanban'
  
  // Load tasks on component mount and when filters change
  useEffect(() => {
    getTasks();
  }, [getTasks, filters]);
  
  // Memoized handlers to prevent unnecessary re-renders
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, [setFilters]);
  
  const handleResetFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);
  
  const handlePageChange = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, [setFilters]);
  
  const handleOpenCreateModal = useCallback(() => {
    setEditingTask(null);
    setIsModalOpen(true);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);
  
  const handleTaskSuccess = useCallback(() => {
    // Refresh tasks after successful creation/update
    getTasks();
  }, [getTasks]);
  
  // This function is now simplified since the actual update happens in the KanbanBoard component
  const handleStatusChange = useCallback(() => {
    // Refresh the task list to ensure all components have the latest data
    getTasks();
  }, [getTasks]);
  
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'grid' ? 'kanban' : 'grid');
  }, []);

  // Determine if filters are applied
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={toggleViewMode}
          >
            {viewMode === 'grid' ? 'Switch to Kanban View' : 'Switch to Grid View'}
          </Button>
          <Button
            variant="primary"
            onClick={handleOpenCreateModal}
          >
            Create New Task
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <TaskFilter 
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
      
      {/* Tasks Display */}
      {isLoading && tasks.length === 0 ? (
        <div className="flex justify-center py-10">
          <Loader size="lg" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState 
          hasFilters={hasFilters} 
          onCreateTask={handleOpenCreateModal} 
        />
      ) : viewMode === 'kanban' ? (
        // Kanban View - now with optimistic updates
        <KanbanBoard 
          tasks={tasks} 
          onStatusChange={handleStatusChange}
        />
      ) : (
        // Grid View - now with optimistic updates in each card
        <TaskGrid 
          tasks={tasks}
        />
      )}
      
      {/* Loading indicator for filtered results */}
      {isLoading && tasks.length > 0 && (
        <div className="flex justify-center py-4">
          <Loader size="md" />
        </div>
      )}
      
      {/* Pagination - Only for grid view */}
      {!isLoading && tasks.length > 0 && viewMode === 'grid' && (
        <Pagination 
          meta={meta}
          onPageChange={handlePageChange}
        />
      )}
      
      {/* Create/Edit Task Modal */}
      {isModalOpen && (
        <CreateTaskModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          task={editingTask}
          onSuccess={handleTaskSuccess}
        />
      )}
    </div>
  );
};

export default Task;