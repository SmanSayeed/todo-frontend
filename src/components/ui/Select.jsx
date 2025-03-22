import React, { forwardRef } from 'react';

const Select = forwardRef(({
  name,
  label,
  value,
  onChange,
  onBlur,
  options = [],
  error,
  disabled = false,
  required = false,
  placeholder = 'Select an option',
  className = '',
  labelClassName = '',
  selectClassName = '',
  errorClassName = '',
  ...props
}, ref) => {
  const selectId = `select-${name}`;
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={selectId} 
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={selectId}
        ref={ref}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
          ${selectClassName}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className={`mt-1 text-sm text-red-600 ${errorClassName}`}>
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;