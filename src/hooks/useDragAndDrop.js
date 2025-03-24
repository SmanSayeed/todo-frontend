import { useState, useCallback } from 'react';

/**
 * Custom hook to manage drag and drop functionality for Kanban board
 * 
 * @param {Object} params - Hook parameters
 * @param {Function} params.onDrop - Callback when item is dropped
 * @returns {Object} - Drag and drop state and handlers
 */
export const useDragAndDrop = ({ onDrop }) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);
  
  // When drag starts, store the item being dragged
  const handleDragStart = useCallback((e, id, currentStatus) => {
    setDraggedItem({ id, currentStatus });
    
    // Set data for HTML5 drag and drop API
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);
  
  // Track which column the item is being dragged over
  const handleDragEnter = useCallback((e, column) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedItem && draggedItem.currentStatus !== column) {
      setDraggedOverColumn(column);
    }
  }, [draggedItem]);
  
  // Required for drag over - prevents default behavior
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Handle when the drag ends
  const handleDragEnd = useCallback((e) => {
    e.preventDefault();
    
    if (draggedItem && draggedOverColumn && draggedItem.currentStatus !== draggedOverColumn) {
      // Execute the drop callback
      onDrop(draggedItem.id, draggedOverColumn);
    }
    
    // Reset drag state
    setDraggedItem(null);
    setDraggedOverColumn(null);
  }, [draggedItem, draggedOverColumn, onDrop]);
  
  return {
    draggedItem,
    draggedOverColumn,
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDragEnd
  };
};