import React, { useState, useRef, useEffect } from 'react';

/**
 * EditableText component for inline text editing
 * This component allows for clicking on text to edit it inline
 */
const EditableText = ({
  value,
  onChange,
  onBlur,
  placeholder = 'Click to edit',
  as = 'p',
  multiline = false,
  maxLength,
  className = '',
  viewClassName = '',
  editClassName = '',
  disabled = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value || '');
  const inputRef = useRef(null);
  
  // Update local state when prop value changes
  useEffect(() => {
    setText(value || '');
  }, [value]);
  
  // Focus the input/textarea when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      
      // Position cursor at the end of the text
      if (inputRef.current.setSelectionRange) {
        const len = text.length;
        inputRef.current.setSelectionRange(len, len);
      }
    }
  }, [isEditing, text]);
  
  const handleViewClick = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    
    // Apply maxLength if provided
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    
    setText(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };
  
  const handleBlur = () => {
    setIsEditing(false);
    
    if (onBlur) {
      onBlur(text);
    }
  };
  
  const handleKeyDown = (e) => {
    // Submit on Enter key, unless it's a multiline input
    if (e.key === 'Enter' && !multiline) {
      inputRef.current.blur();
    }
    
    // Always submit on Escape key
    if (e.key === 'Escape') {
      inputRef.current.blur();
    }
  };
  
  // When not in editing mode, render the text view
  if (!isEditing) {
    const ViewComponent = as;
    return (
      <ViewComponent
        className={`${text ? '' : 'text-gray-400 italic'} cursor-pointer ${disabled ? 'cursor-default' : 'hover:bg-gray-100'} rounded px-1 py-0.5 -mx-1 ${viewClassName} ${className}`}
        onClick={handleViewClick}
      >
        {text || placeholder}
      </ViewComponent>
    );
  }
  
  // When in editing mode, render the input or textarea
  if (multiline) {
    return (
      <textarea
        ref={inputRef}
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full p-1 border border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${editClassName} ${className}`}
        rows={Math.max(2, (text.match(/\n/g) || []).length + 1)}
      />
    );
  }
  
  return (
    <input
      ref={inputRef}
      type="text"
      value={text}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={`w-full p-1 border border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${editClassName} ${className}`}
    />
  );
};

export default EditableText;