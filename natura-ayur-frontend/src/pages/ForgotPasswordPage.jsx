import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import useAuth from '../hooks/useAuth';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle successful password reset request
  const handleRequestSuccess = () => {
    // Instead of navigating away, the form itself displays a success message
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">NaturaAyur</h1>
        <h2 className="mt-2 text-center text-xl font-semibold text-gray-600">Forgot your password?</h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ForgotPasswordForm onSuccess={handleRequestSuccess} />
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;