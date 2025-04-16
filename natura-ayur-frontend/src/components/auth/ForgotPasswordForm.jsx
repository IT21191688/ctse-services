import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { openModal } from '../../redux/slices/uiSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import { ERROR_MESSAGES } from '../../utils/constants';

const ForgotPasswordForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { requestPasswordReset, loading, error, successMessage, clearAuthError, clearAuthSuccessMessage } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearAuthError();
      clearAuthSuccessMessage();
    };
  }, [clearAuthError, clearAuthSuccessMessage]);
  
  // Handle input change
  const handleChange = (e) => {
    setEmail(e.target.value);
    setFormError('');
  };
  
  // Validate form
  const validateForm = () => {
    // Email validation
    if (!email) {
      setFormError(ERROR_MESSAGES.REQUIRED);
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError(ERROR_MESSAGES.EMAIL);
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Request password reset
    const result = await requestPasswordReset({ email });
    
    // If request was successful
    if (result) {
      setIsSubmitted(true);
      
      // If onSuccess callback provided
      if (onSuccess) {
        onSuccess();
      }
    }
  };
  
  // Open login modal
  const handleLoginClick = () => {
    dispatch(openModal({ modalType: 'login' }));
  };
  
  return (
    <div className="flex flex-col bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
      
      {/* Show success message */}
      {(isSubmitted || successMessage) ? (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
          <p className="font-medium">Password Reset Email Sent</p>
          <p className="mt-1">We've sent a password reset link to your email address. Please check your inbox and follow the instructions.</p>
          <div className="mt-4">
            <Button variant="outline" fullWidth onClick={handleLoginClick}>
              Back to Login
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Show error message if present */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            Enter your email address below, and we'll send you a link to reset your password.
          </p>
          
          <form onSubmit={handleSubmit}>
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={handleChange}
              error={formError}
              required
            />
            
            <div className="mt-6">
              <Button
                type="submit"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                Send Reset Link
              </Button>
            </div>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-green-600 hover:text-green-700 font-medium"
                onClick={handleLoginClick}
              >
                Back to Login
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordForm;