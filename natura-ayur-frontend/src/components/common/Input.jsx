import React, { forwardRef } from 'react';

/**
 * Input component for text input fields
 * 
 * @param {Object} props - Component props
 * @param {string} props.name - Input name attribute
 * @param {string} [props.label] - Input label text
 * @param {string} [props.type='text'] - Input type
 * @param {string} [props.placeholder] - Input placeholder text
 * @param {string} [props.value] - Input value
 * @param {Function} [props.onChange] - Change handler
 * @param {Function} [props.onBlur] - Blur handler
 * @param {string} [props.error] - Error message
 * @param {boolean} [props.required=false] - Whether the input is required
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} props.rest - Additional props to pass to the input element
 */
const Input = forwardRef(({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
  ...rest
}, ref) => {
  // Base input classes
  const inputClasses = `
    block w-full px-4 py-2 mt-1 text-gray-900 border-gray-300 rounded-md shadow-sm
    focus:ring-green-500 focus:border-green-500 sm:text-sm
    ${error ? 'border-red-300' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClasses}
        {...rest}
      />
      
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

/**
 * Textarea component for multiline text input
 */
export const Textarea = forwardRef(({
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  ...rest
}, ref) => {
  // Base textarea classes
  const textareaClasses = `
    block w-full px-4 py-2 mt-1 text-gray-900 border-gray-300 rounded-md shadow-sm
    focus:ring-green-500 focus:border-green-500 sm:text-sm
    ${error ? 'border-red-300' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={textareaClasses}
        {...rest}
      />
      
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

/**
 * Select component for dropdown selection
 */
export const Select = forwardRef(({
  name,
  label,
  options = [],
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
  placeholder = 'Select an option',
  ...rest
}, ref) => {
  // Base select classes
  const selectClasses = `
    block w-full px-4 py-2 mt-1 text-gray-900 border-gray-300 rounded-md shadow-sm
    focus:ring-green-500 focus:border-green-500 sm:text-sm
    ${error ? 'border-red-300' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={selectClasses}
        {...rest}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

/**
 * Checkbox component
 */
export const Checkbox = forwardRef(({
  name,
  label,
  checked,
  onChange,
  error,
  disabled = false,
  className = '',
  ...rest
}, ref) => {
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <input
          ref={ref}
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded ${className}`}
          {...rest}
        />
        {label && (
          <label htmlFor={name} className="ml-2 block text-sm text-gray-700">
            {label}
          </label>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

/**
 * RadioGroup component
 */
export const RadioGroup = forwardRef(({
  name,
  label,
  options = [],
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  ...rest
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="mt-1 space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled}
              className={`h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 ${className}`}
              {...rest}
            />
            <label htmlFor={`${name}-${option.value}`} className="ml-2 block text-sm text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

export default Input;