import React, { useState, useEffect } from 'react';
import Button from '../../ui/Button';
import Loader from '../../ui/Loader';
import TaskCard from '../../tasks/TaskCard';
import TaskFilter from '../../tasks/TaskFilter';
import Pagination from '../../ui/Pagination';
import CreateTaskModal from '../../tasks/CreateTaskModal';
import { useTasksRedux } from '../../../hooks/useTaskRedux';

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
  
  // Load tasks on component mount and when filters change
  useEffect(() => {
    getTasks();
  }, [getTasks, filters]);
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const handleResetFilters = () => {
    clearFilters();
  };
  
  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };
  
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };
  
  const handleTaskSuccess = () => {
    // Refresh tasks after successful creation/update
    getTasks();
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Button
          variant="primary"
          onClick={handleOpenCreateModal}
        >
          Create New Task
        </Button>
      </div>
      
      {/* Filters */}
      <TaskFilter 
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
      
      {/* Tasks Grid */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader size="lg" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500 mb-4">
            {Object.values(filters).some(Boolean) 
              ? 'Try adjusting your filters or create a new task'
              : 'Get started by creating your first task'}
          </p>
          <Button
            variant="primary"
            onClick={handleOpenCreateModal}
          >
            Create New Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task}
              onEdit={handleOpenEditModal}
            />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {!isLoading && tasks.length > 0 && (
        <Pagination 
          meta={meta}
          onPageChange={handlePageChange}
        />
      )}
      
      {/* Create/Edit Task Modal */}
      <CreateTaskModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        onSuccess={handleTaskSuccess}
      />
    </div>
  );
};

export default Task;