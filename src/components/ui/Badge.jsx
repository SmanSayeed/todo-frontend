import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = 'full',
  className = '',
  ...props
}) => {
  // Variant classes
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-indigo-100 text-indigo-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    todo: 'bg-yellow-100 text-yellow-800',
    inprogress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800'
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };
  
  // Rounded classes
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };
  
  const allClasses = `
    inline-flex items-center font-medium
    ${variantClasses[variant] || variantClasses.default}
    ${sizeClasses[size] || sizeClasses.md}
    ${roundedClasses[rounded] || roundedClasses.full}
    ${className}
  `.trim();
  
  return (
    <span className={allClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge;