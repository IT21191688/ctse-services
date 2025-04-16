import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import { isRequired } from '../../utils/validation';

/**
 * Form component for collecting and managing address information
 * 
 * @param {Object} props
 * @param {Object} [props.initialAddress] - Initial address data
 * @param {Function} props.onChange - Callback for address changes
 * @param {Object} [props.errors] - Validation errors
 * @param {boolean} [props.disabled=false] - Whether the form is disabled
 */
const AddressForm = ({ 
  initialAddress = {}, 
  onChange, 
  errors = {},
  disabled = false
}) => {
  // Form state
  const [address, setAddress] = useState({
    address: initialAddress.address || initialAddress.street || '',
    city: initialAddress.city || '',
    postalCode: initialAddress.postalCode || '',
    country: initialAddress.country || initialAddress.province || 'India', // Default to India
  });
  
  // Local validation state
  const [localErrors, setLocalErrors] = useState({});
  
  // Update address when initialAddress changes
  useEffect(() => {
    if (initialAddress) {
      setAddress({
        address: initialAddress.address || initialAddress.street || '',
        city: initialAddress.city || '',
        postalCode: initialAddress.postalCode || '',
        country: initialAddress.country || initialAddress.province || 'India',
      });
    }
  }, [initialAddress]);
  
  // Merge external and local errors
  const formErrors = { ...localErrors, ...errors };
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update address state
    setAddress(prev => {
      const newAddress = { ...prev, [name]: value };
      
      // Call onChange callback
      if (onChange) {
        onChange(newAddress);
      }
      
      return newAddress;
    });
    
    // Clear local error for this field
    setLocalErrors(prev => ({ ...prev, [name]: '' }));
  };
  
  // Validate field on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Validate field
    let error = '';
    if (!isRequired(value)) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    
    // Set local error
    setLocalErrors(prev => ({ ...prev, [name]: error }));
  };
  
  return (
    <div className="space-y-4">
      {/* Street Address */}
      <Input
        name="address"
        label="Street Address"
        type="text"
        placeholder="123 Main St, Apt 4B"
        value={address.address}
        onChange={handleChange}
        onBlur={handleBlur}
        error={formErrors.address}
        disabled={disabled}
        required
      />
      
      {/* City */}
      <Input
        name="city"
        label="City"
        type="text"
        placeholder="Mumbai"
        value={address.city}
        onChange={handleChange}
        onBlur={handleBlur}
        error={formErrors.city}
        disabled={disabled}
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Postal Code */}
        <Input
          name="postalCode"
          label="Postal Code"
          type="text"
          placeholder="400001"
          value={address.postalCode}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formErrors.postalCode}
          disabled={disabled}
          required
        />
        
        {/* Country / State / Province */}
        <Input
          name="country"
          label="State/Province"
          type="text"
          placeholder="Maharashtra"
          value={address.country}
          onChange={handleChange}
          onBlur={handleBlur}
          error={formErrors.country}
          disabled={disabled}
          required
        />
      </div>
    </div>
  );
};

export default AddressForm;