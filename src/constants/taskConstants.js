// Task status options
export const TASK_STATUS = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done'
  };
  
  // Task status options as an array for dropdowns, etc.
  export const TASK_STATUS_OPTIONS = [
    { value: TASK_STATUS.TODO, label: 'To Do' },
    { value: TASK_STATUS.IN_PROGRESS, label: 'In Progress' },
    { value: TASK_STATUS.DONE, label: 'Done' }
  ];
  
  // Sort options
  export const SORT_OPTIONS = [
    { value: 'created_at', label: 'Created Date' },
    { value: 'due_date', label: 'Due Date' },
    { value: 'name', label: 'Name' },
    { value: 'status', label: 'Status' }
  ];
  
  // Sort direction options
  export const SORT_DIRECTION_OPTIONS = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' }
  ];
  
  // Per page options
  export const PER_PAGE_OPTIONS = [
    { value: 5, label: '5 per page' },
    { value: 10, label: '10 per page' },
    { value: 25, label: '25 per page' },
    { value: 50, label: '50 per page' }
  ];
  
  // Date format for displaying dates
  export const DATE_FORMAT = 'MMM DD, YYYY';