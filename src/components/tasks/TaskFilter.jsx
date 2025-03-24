import React, { useState, useEffect } from 'react';
import { 
  TASK_STATUS_OPTIONS, 
  SORT_OPTIONS, 
  SORT_DIRECTION_OPTIONS 
} from '../../constants/taskConstants';
import Button from '../ui/Button';
import Input from '../ui/Input';

const TaskFilter = ({ filters, onFilterChange, onResetFilters }) => {
  const [localFilters, setLocalFilters] = useState({
    status: '',
    search: '',
    due_date_from: '',
    due_date_to: '',
    sort_by: 'created_at',
    sort_direction: 'desc'
  });
  
  // Initialize with current filters
  useEffect(() => {
    setLocalFilters({
      status: filters.status || '',
      search: filters.search || '',
      due_date_from: filters.due_date_from || '',
      due_date_to: filters.due_date_to || '',
      sort_by: filters.sort_by || 'created_at',
      sort_direction: filters.sort_direction || 'desc'
    });
  }, [filters]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };
  
  const handleReset = () => {
    setLocalFilters({
      status: '',
      search: '',
      due_date_from: '',
      due_date_to: '',
      sort_by: 'created_at',
      sort_direction: 'desc'
    });
    onResetFilters();
  };
  
  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localFilters.search !== filters.search) {
        onFilterChange({ ...filters, search: localFilters.search, page: 1 });
      }
    }, 500);
    
    return () => {
      clearTimeout(handler);
    };
  }, [localFilters.search, filters.search, onFilterChange, filters]);
  
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <Input
            label="Search (debounced)"
            name="search"
            value={localFilters.search}
            onChange={handleChange}
            placeholder="Search tasks..."
          />
          
          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status 
            </label>
            <select
              id="status"
              name="status"
              value={localFilters.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {TASK_STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Due Date From */}
          <Input
            label="Due Date From"
            name="due_date_from"
            type="date"
            value={localFilters.due_date_from}
            onChange={handleChange}
          />
          
          {/* Due Date To */}
          <Input
            label="Due Date To"
            name="due_date_to"
            type="date"
            value={localFilters.due_date_to}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Sort By */}
          <div>
            <label htmlFor="sort_by" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort_by"
              name="sort_by"
              value={localFilters.sort_by}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort Direction */}
          <div>
            <label htmlFor="sort_direction" className="block text-sm font-medium text-gray-700 mb-1">
              Sort Direction
            </label>
            <select
              id="sort_direction"
              name="sort_direction"
              value={localFilters.sort_direction}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {SORT_DIRECTION_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
          >
            Reset Filters
          </Button>
          <Button 
            type="submit" 
            variant="primary"
          >
            Apply Filters
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskFilter;