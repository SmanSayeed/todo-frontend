import React, { useState, useRef, useEffect } from 'react';
import Button from '../../ui/Button';
import { formatDate } from '../../../utils/taskUtils';

const EditableDate = ({
  value,
  onSave,
  displayFormat = 'MMM dd, yyyy',
  className = '',
  displayClassName = '',
  inputClassName = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const wrapperRef = useRef(null);
  
  // When value prop changes, update temp value
  useEffect(() => {
    setTempValue(value);
  }, [value]);
  
  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        if (isEditing) {
          setIsEditing(false);
          if (tempValue !== value) {
            setIsConfirming(true);
          }
        } else if (isConfirming) {
          // Cancel confirmation if clicked outside during confirmation
          setIsConfirming(false);
          setTempValue(value);
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, isConfirming, tempValue, value]);
  
  // Format the date for input field (YYYY-MM-DD)
  const formatForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date for input:', error);
      return '';
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
    setIsConfirming(false);
  };
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setTempValue(newValue);
    
    // Automatically go to confirmation step when date is selected
    setIsEditing(false);
    if (newValue !== value) {
      setIsConfirming(true);
    }
  };
  
  const confirmChanges = () => {
    onSave(tempValue);
    setIsConfirming(false);
  };
  
  const cancelChanges = () => {
    setTempValue(value);
    setIsConfirming(false);
  };
  
  return (
    <div 
      ref={wrapperRef} 
      className={`${className}`}
    >
      {isEditing ? (
        // Edit mode
        <input
          type="date"
          value={formatForInput(tempValue)}
          onChange={handleChange}
          autoFocus
          className={`w-full px-2 py-1 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
        />
      ) : isConfirming ? (
        // Confirmation mode
        <div className="space-y-2">
          <div className="border border-blue-500 rounded-md p-2 bg-blue-50">
            {tempValue ? formatDate(tempValue, displayFormat) : <span className="text-gray-400 italic">No date set</span>}
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
          <div className={displayClassName}>
            {value ? formatDate(value, displayFormat) : <span className="text-gray-400 italic">Set date...</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableDate;