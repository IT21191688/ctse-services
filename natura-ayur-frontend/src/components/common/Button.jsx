import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Button component that can be rendered as a button element or a Link component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, outline, text)
 * @param {string} [props.size='md'] - Button size (sm, md, lg)
 * @param {string} [props.to] - If provided, the button renders as a Link to this path
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.fullWidth=false] - Whether the button should take full width
 * @param {boolean} [props.loading=false] - Whether to show a loading spinner
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.type='button'] - Button type attribute
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  to,
  disabled = false,
  fullWidth = false,
  loading = false,
  className = '',
  children,
  onClick,
  type = 'button',
  ...rest
}) => {
  // Base classes for all button types
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-700 border border-transparent',
    secondary: 'bg-gray-800 text-white hover:bg-gray-900 border border-transparent',
    outline: 'bg-transparent text-green-600 hover:bg-green-50 border border-green-600',
    text: 'bg-transparent text-green-600 hover:bg-green-50 border border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 border border-transparent',
  };
  
  // Disabled classes
  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';
  
  // Full width class
  const fullWidthClass = fullWidth ? 'w-full' : '';
  
  // Combine all the classes
  const buttonClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${disabled ? disabledClasses : ''} 
    ${fullWidthClass} 
    ${className}
  `;
  
  // If a "to" prop is provided, render a Link, otherwise render a button
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        {...rest}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </Link>
    );
  }
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;