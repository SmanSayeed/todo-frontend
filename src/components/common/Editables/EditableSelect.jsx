import React, { useState, useRef, useEffect } from 'react';
import Button from '../../ui/Button';

const EditableSelect = ({
  value,
  onSave,
  options = [],
  displayRenderer = null,
  className = '',
  displayClassName = '',
  selectClassName = ''
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
  
  // Function to render the display value based on the options
  const renderDisplayValue = (val) => {
    if (displayRenderer) {
      return displayRenderer(val);
    }
    
    const option = options.find(opt => opt.value === val);
    return option ? option.label : 'Select...';
  };
  
  const handleEdit = () => {
    setIsEditing(true);
    setIsConfirming(false);
  };
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setTempValue(newValue);
    
    // Automatically go to confirmation step for select inputs
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
        <select
          value={tempValue || ''}
          onChange={handleChange}
          autoFocus
          className={`w-full px-2 py-1 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectClassName}`}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : isConfirming ? (
        // Confirmation mode
        <div className="space-y-2">
          <div className="border border-blue-500 rounded-md p-2 bg-blue-50">
            {renderDisplayValue(tempValue)}
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
            {renderDisplayValue(value)}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableSelect;