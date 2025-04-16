import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { openModal } from '../../redux/slices/uiSlice';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { login, loading, error, clearAuthError } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // Validation state
  const [formErrors, setFormErrors] = useState({});
  
  // Check for redirect path from location state
  const from = location.state?.from?.pathname || '/';
  
  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
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
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
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
    
    // Attempt login
    const result = await login(formData);
    
    // If login successful and onSuccess callback provided
    if (result && onSuccess) {
      onSuccess();
      
      // Redirect if needed
      if (from !== '/') {
        navigate(from, { replace: true });
      }
    }
  };
  
  // Open registration modal
  const handleRegisterClick = () => {
    dispatch(openModal({ modalType: 'register' }));
  };
  
  // Open forgot password modal
  const handleForgotPasswordClick = () => {
    dispatch(openModal({ modalType: 'forgotPassword' }));
  };
  
  return (
    <div className="flex flex-col bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      
      {/* Show error message if present */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
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
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={formErrors.password}
          required
        />
        
        <div className="flex justify-between items-center mb-6 text-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-green-600 border-gray-300 rounded"
            />
            <span className="ml-2">Remember me</span>
          </label>
          
          <button
            type="button"
            className="text-green-600 hover:text-green-700"
            onClick={handleForgotPasswordClick}
          >
            Forgot password?
          </button>
        </div>
        
        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Log In
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-green-600 hover:text-green-700 font-medium"
            onClick={handleRegisterClick}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;