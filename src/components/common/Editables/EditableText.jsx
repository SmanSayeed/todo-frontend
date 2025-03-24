import React from 'react';
import EditableField from './EditableField';

const EditableText = ({
  value,
  onSave,
  placeholder = 'Edit text...',
  className = '',
  displayClassName = '',
  inputClassName = '',
  multiline = false,
  maxLength = null
}) => {
  return (
    <EditableField
      value={value}
      onSave={onSave}
      className={className}
      renderDisplay={({ value }) => (
        <div className={displayClassName}>
          {value || <span className="text-gray-400 italic">{placeholder}</span>}
        </div>
      )}
      renderEdit={({ value, onChange, onKeyDown, autoFocus }) => (
        multiline ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus={autoFocus}
            className={`w-full px-2 py-1 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={3}
          />
        ) : (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus={autoFocus}
            className={`w-full px-2 py-1 border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        )
      )}
    />
  );
};

export default EditableText;