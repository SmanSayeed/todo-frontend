import React, { useState, useRef, useEffect } from 'react';
import Button from '../../ui/Button';

const EditableField = ({
  value,
  onSave,
  renderDisplay,
  renderEdit,
  className = '',
  autoFocus = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPendingConfirmation, setIsPendingConfirmation] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [tempValue, setTempValue] = useState(value);
  const wrapperRef = useRef(null);
  
  // When value prop changes, update local value
  useEffect(() => {
    setLocalValue(value);
    setTempValue(value);
  }, [value]);
  
  // Handle outside click when editing
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target) && isEditing) {
        requestConfirmation();
      }
    }
    
    // Add event listener when editing
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, tempValue]);
  
  // Handle outside click when confirming
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target) && isPendingConfirmation) {
        cancelChanges();
      }
    }
    
    // Add event listener when confirmation is pending
    if (isPendingConfirmation) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPendingConfirmation]);
  
  const handleEdit = () => {
    setIsEditing(true);
    setTempValue(localValue);
  };
  
  const handleChange = (newValue) => {
    setTempValue(newValue);
    
    // For select and date inputs, we want to show confirmation immediately after change
    // This is optional, but provides better UX for these types of inputs
    if (typeof newValue === 'string' && 
        (newValue.includes('-') || ['To Do', 'In Progress', 'Done'].includes(newValue))) {
      requestConfirmation();
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      requestConfirmation();
    }
    if (e.key === 'Escape') {
      cancelEdit();
    }
  };
  
  const requestConfirmation = () => {
    setIsEditing(false);
    if (tempValue !== localValue) {
      setIsPendingConfirmation(true);
    } else {
      cancelEdit();
    }
  };
  
  const confirmChanges = () => {
    setLocalValue(tempValue);
    onSave(tempValue);
    setIsPendingConfirmation(false);
  };
  
  const cancelChanges = () => {
    setTempValue(localValue);
    setIsPendingConfirmation(false);
  };
  
  const cancelEdit = () => {
    setIsEditing(false);
    setTempValue(localValue);
  };
  
  return (
    <div 
      ref={wrapperRef} 
      className={`editable-field ${className} ${isEditing ? 'is-editing' : ''} ${isPendingConfirmation ? 'is-confirming' : ''}`}
    >
      {isEditing ? (
        // Edit mode
        <div>
          {renderEdit({
            value: tempValue,
            onChange: handleChange,
            onKeyDown: handleKeyDown,
            autoFocus
          })}
        </div>
      ) : isPendingConfirmation ? (
        // Confirmation mode
        <div className="space-y-2">
          <div className="border border-blue-500 rounded-md p-2 bg-blue-50">
            {renderDisplay({ value: tempValue })}
          </div>
          <div className="flex space-x-2 justify-end">
            <Button
              size="xs"
              variant="outline"
              onClick={cancelChanges}
            >
              Cancel
            </Button>
            <Button
              size="xs"
              variant="primary"
              onClick={confirmChanges}
            >
              Confirm
            </Button>
          </div>
        </div>
      ) : (
        // Display mode
        <div
          className="cursor-pointer hover:bg-gray-50 rounded p-1 -m-1 transition-colors"
          onClick={handleEdit}
        >
          {renderDisplay({ value: localValue })}
        </div>
      )}
    </div>
  );
};

export default EditableField;