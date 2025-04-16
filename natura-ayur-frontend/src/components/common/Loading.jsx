import React from 'react';

/**
 * Loading spinner component with several variants
 * 
 * @param {Object} props - Component props
 * @param {string} [props.size='md'] - Spinner size (sm, md, lg)
 * @param {string} [props.color='primary'] - Spinner color (primary, secondary, white)
 * @param {string} [props.type='spinner'] - Spinner type (spinner, dots, pulse)
 * @param {string} [props.text] - Optional loading text
 * @param {boolean} [props.fullScreen=false] - Whether to display as a fullscreen overlay
 * @param {string} [props.className] - Additional CSS classes
 */
const Loading = ({
  size = 'md',
  color = 'primary',
  type = 'spinner',
  text,
  fullScreen = false,
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  // Color classes
  const colorClasses = {
    primary: 'text-green-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };
  
  // Text size classes
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  // If fullScreen, display as overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          <LoadingIndicator type={type} size={size} color={color} />
          {text && <p className={`mt-3 font-medium ${textSizeClasses[size]}`}>{text}</p>}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <LoadingIndicator type={type} size={size} color={color} />
      {text && <p className={`mt-2 font-medium ${textSizeClasses[size]} ${colorClasses[color]}`}>{text}</p>}
    </div>
  );
};

/**
 * Loading indicator based on type
 */
const LoadingIndicator = ({ type, size, color }) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  // Color classes
  const colorClasses = {
    primary: 'text-green-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };
  
  // Spinner
  if (type === 'spinner') {
    return (
      <svg 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
  }
  
  // Dots
  if (type === 'dots') {
    const dotSize = {
      sm: 'h-1.5 w-1.5',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
    };
    
    const dotSpacing = {
      sm: 'space-x-1',
      md: 'space-x-2',
      lg: 'space-x-3',
    };
    
    return (
      <div className={`flex ${dotSpacing[size]}`}>
        <div className={`${dotSize[size]} rounded-full ${colorClasses[color]} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`${dotSize[size]} rounded-full ${colorClasses[color]} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
        <div className={`${dotSize[size]} rounded-full ${colorClasses[color]} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
      </div>
    );
  }
  
  // Pulse
  if (type === 'pulse') {
    return (
      <div className={`${sizeClasses[size]} ${colorClasses[color]} relative`}>
        <div className="absolute inset-0 rounded-full animate-ping opacity-75 bg-current"></div>
        <div className="relative rounded-full h-full w-full bg-current"></div>
      </div>
    );
  }
  
  // Default to spinner
  return (
    <svg 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

export const PageLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <Loading size="lg" text="Loading..." />
  </div>
);

export const ContentLoading = ({ text = "Loading content..." }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <Loading size="md" text={text} />
  </div>
);

export default Loading;