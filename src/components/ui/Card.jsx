import React from 'react';

const Card = ({
  children,
  title,
  footer,
  className = '',
  titleClassName = '',
  bodyClassName = '',
  footerClassName = '',
  onClick,
  ...props
}) => {
  return (
    <div 
      className={`bg-white shadow-sm rounded-lg overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {title && (
        <div className={`px-4 py-3 border-b border-gray-200 ${titleClassName}`}>
          {typeof title === 'string' ? (
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          ) : (
            title
          )}
        </div>
      )}
      
      <div className={`p-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-4 py-3 border-t border-gray-200 bg-gray-50 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;