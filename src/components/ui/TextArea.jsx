import React, { forwardRef } from 'react';

const TextArea = forwardRef(({
  name,
  label,
  value,
  placeholder,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  rows = 4,
  className = '',
  labelClassName = '',
  textareaClassName = '',
  errorClassName = '',
  ...props
}, ref) => {
  const textareaId = `textarea-${name}`;
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={textareaId} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={textareaId}
        ref={ref}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
          ${textareaClassName}
        `}
        {...props}
      />
      
      {error && (
        <p className={`mt-1 text-sm text-red-600 ${errorClassName}`}>
          {error}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;