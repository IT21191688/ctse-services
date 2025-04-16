import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import useAuth from '../hooks/useAuth';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { isAuthenticated } = useAuth();
  
  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Check if token is provided
  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">NaturaAyur</h1>
        <h2 className="mt-2 text-center text-xl font-semibold text-gray-600">Reset your password</h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {token ? (
          <ResetPasswordForm />
        ) : (
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <p className="text-gray-700 mb-4">Invalid or missing reset token.</p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Request a new password reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;