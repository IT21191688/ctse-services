import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { openModal } from '../../redux/slices/uiSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import { ERROR_MESSAGES } from '../../utils/constants';

const RegisterForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { register, loading, error, clearAuthError } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    password: '',
    confirmPassword: '',
    avatar: null,
  });
  
  // File preview state
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // Validation state
  const [formErrors, setFormErrors] = useState({});
  
  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'avatar' && files && files[0]) {
      // Handle file input
      setFormData((prevData) => ({
        ...prevData,
        avatar: files[0],
      }));
      
      // Create preview URL
      const previewURL = URL.createObjectURL(files[0]);
      setAvatarPreview(previewURL);
    } else {
      // Handle text input
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    
    // Clear field error on change
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = ERROR_MESSAGES.REQUIRED;
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters long';
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = ERROR_MESSAGES.REQUIRED;
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters long';
    }
    
    // Email validation
    if (!formData.email) {
      errors.email = ERROR_MESSAGES.REQUIRED;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = ERROR_MESSAGES.EMAIL;
    }
    
    // Contact number validation (10 digits)
    if (!formData.contactNo) {
      errors.contactNo = ERROR_MESSAGES.REQUIRED;
    } else if (!/^\d{10}$/.test(formData.contactNo)) {
      errors.contactNo = ERROR_MESSAGES.PHONE;
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = ERROR_MESSAGES.REQUIRED;
    } else if (formData.password.length < 6) {
      errors.password = ERROR_MESSAGES.PASSWORD_MIN;
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = ERROR_MESSAGES.REQUIRED;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = ERROR_MESSAGES.PASSWORD_MATCH;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Create FormData for file upload
    const userData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword') {
        userData.append(key, formData[key]);
      }
    });
    
    // Attempt registration
    const result = await register(userData);
    
    // If registration successful and onSuccess callback provided
    if (result && onSuccess) {
      onSuccess();
    }
  };
  
  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);
  
  // Open login modal
  const handleLoginClick = () => {
    dispatch(openModal({ modalType: 'login' }));
  };
  
  return (
    <div className="flex flex-col bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      
      {/* Show error message if present */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="firstName"
            label="First Name"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={formErrors.firstName}
            required
          />
          
          <Input
            name="lastName"
            label="Last Name"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={formErrors.lastName}
            required
          />
        </div>
        
        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={handleChange}
          error={formErrors.email}
          required
        />
        
        <Input
          name="contactNo"
          label="Contact Number"
          type="tel"
          placeholder="1234567890"
          value={formData.contactNo}
          onChange={handleChange}
          error={formErrors.contactNo}
          required
        />
        
        <Input
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={formErrors.password}
          required
        />
        
        <Input
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={formErrors.confirmPassword}
          required
        />
        
        {/* Avatar upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Picture (Optional)
          </label>
          
          <div className="flex items-center space-x-4">
            {/* Preview */}
            <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg 
                  className="h-8 w-8 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              )}
            </div>
            
            {/* Upload button */}
            <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
              Upload Photo
              <input
                type="file"
                name="avatar"
                onChange={handleChange}
                accept="image/png, image/jpeg, image/jpg"
                className="sr-only"
              />
            </label>
          </div>
        </div>
        
        <div className="mt-4">
          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={loading}
          >
            Sign Up
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            className="text-green-600 hover:text-green-700 font-medium"
            onClick={handleLoginClick}
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;