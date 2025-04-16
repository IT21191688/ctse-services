import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import { ERROR_MESSAGES } from '../../utils/constants';

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { resetUserPassword, loading, error, successMessage, clearAuthError, clearAuthSuccessMessage } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  
  // Validation state
  const [formErrors, setFormErrors] = useState({});
  const [isReset, setIsReset] = useState(false);
  
  // Clear errors and success messages when component unmounts
  useEffect(() => {
    return () => {
      clearAuthError();
      clearAuthSuccessMessage();
    };
  }, [clearAuthError, clearAuthSuccessMessage]);
  
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
    
    // Reset password
    const result = await resetUserPassword(token, formData.password, formData.confirmPassword);
    
    // If reset was successful
    if (result) {
      setIsReset(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { state: { message: 'Your password has been reset successfully. You can now log in with your new password.' } });
      }, 3000);
    }
  };
  
  // Navigate to login page
  const handleLoginClick = () => {
    navigate('/login');
  };
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Your Password</h2>
        
        {/* Show success message if password was reset */}
        {(isReset || successMessage) ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
            <p className="font-medium">Password Reset Successful!</p>
            <p className="mt-1">Your password has been reset successfully. You will be redirected to the login page in a moment.</p>
            <div className="mt-4">
              <Button variant="outline" fullWidth onClick={handleLoginClick}>
                Go to Login
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
              Please enter your new password below.
            </p>
            
            <form onSubmit={handleSubmit}>
              <Input
                name="password"
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
                required
              />
              
              <Input
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={formErrors.confirmPassword}
                required
              />
              
              <div className="mt-6">
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                >
                  Reset Password
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
    </div>
  );
};

export default ResetPasswordForm;