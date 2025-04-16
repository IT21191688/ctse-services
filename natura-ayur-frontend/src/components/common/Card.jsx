import React from 'react';

/**
 * Card component for displaying content in a contained card format
 * 
 * @param {Object} props - Component props
 * @param {string} [props.title] - Card title
 * @param {React.ReactNode} [props.headerContent] - Optional custom header content
 * @param {React.ReactNode} [props.footerContent] - Optional footer content
 * @param {string} [props.className] - Additional CSS classes for the card container
 * @param {string} [props.bodyClassName] - Additional CSS classes for the card body
 * @param {boolean} [props.noPadding=false] - Whether to remove padding from the card body
 * @param {boolean} [props.hoverable=false] - Whether to show hover effects
 * @param {React.ReactNode} props.children - Card content
 */
const Card = ({
  title,
  headerContent,
  footerContent,
  className = '',
  bodyClassName = '',
  noPadding = false,
  hoverable = false,
  children,
  ...rest
}) => {
  // Base classes for card
  const cardClasses = `bg-white rounded-lg shadow-md overflow-hidden ${
    hoverable ? 'transition-shadow hover:shadow-lg' : ''
  } ${className}`;
  
  // Classes for card body
  const bodyClasses = `${noPadding ? '' : 'p-6'} ${bodyClassName}`;
  
  return (
    <div className={cardClasses} {...rest}>
      {/* Card Header */}
      {(title || headerContent) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {headerContent}
        </div>
      )}
      
      {/* Card Body */}
      <div className={bodyClasses}>
        {children}
      </div>
      
      {/* Card Footer */}
      {footerContent && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footerContent}
        </div>
      )}
    </div>
  );
};

/**
 * Grid layout for displaying multiple cards
 */
export const CardGrid = ({ children, columns = 3, gap = 6, className = '' }) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };
  
  const gapClasses = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };
  
  return (
    <div className={`grid ${gridClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;